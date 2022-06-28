/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Command, CommandRunner } from "nest-commander";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import {
  AggregateTransactionInfo,
  Transaction,
  TransactionGroup,
  TransactionInfo,
  TransferTransaction,
  Order,
  TransactionType,
} from "@dhealth/sdk";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import { AccountsService } from "../../services/AccountsService";
import { Account, AccountDocument, AccountQuery } from "../../models/AccountSchema";
import { AccountDiscoveryStateData } from "../../models/AccountDiscoveryStateData";

/**
 * @class DiscoverAccounts
 * @description The private implementation for the scheduler as
 * defined in {@link DiscoverAccountsCommand}. Contains source
 * code for the execution logic of a cronjob with identifier:
 * `accountsDiscovery`.
 *
 * @since v0.1.0
 */
@Command({
  name: "discovery:accounts",
  options: { isDefault: false },
})
export class DiscoverAccounts
  extends DiscoveryCommand
  implements CommandRunner
{
  /**
   * Memory store of addresses that have been discovered as recipient
   * of transfer transactions issued from the dApp's main account.
   *
   * @access protected
   * @var {string[]}
   */
  protected discoveredAddresses: string[] = [];

  /**
   * Memory store of transactions by addresses to faciliate the count
   * process and filtering capabilities by already processed transfers.
   *
   * @access protected
   * @var {string[]}
   */
  protected transactionsByAddress: Map<string, string[]> = new Map<string, string[]>();

  /**
   * Memory store for *all* transactions processed in one run of this
   * command. Note that it contains **only transfer** transactions as
   * those are the only relevant to this discovery command.
   *
   * @access protected
   * @var {TransferTransaction[]}
   */
  protected transactions: TransferTransaction[] = [];

  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {ConfigService}   configService
   * @param {StateService}   statesService
   * @param {NetworkService}  networkService
   * @param {AccountsService} accountsService
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly statesService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly accountsService: AccountsService,
  ) {
    // required super call
    super(statesService);
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `DiscoverAccounts`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required 
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `${this.command} [--source "SOURCE-ADDRESS-OR-PUBKEY"]`;
  }

  /**
   * Getter for the discovery state identifier, e.g.
   * "discovery.accounts", "discovery.transactions",
   * "payout.outputs" etc.
   * <br /><br />
   * This method must be implemented by extended classes
   * to create the correct state query for this discovery
   * service.
   *
   * @see StatefulModule
   * @access protected
   * @var {string}
   */
  public get stateIdentifier(): string {
    return "discovery:accounts";
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * of the `CommandRunner` interface in {@link BaseCommand},
   * the nest backend runtime is able to discover this when the
   * `discovery` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--source` option.
   * <br /><br />
   * This scheduler is registered to run **every 5 minutes**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams  
   * @param   {BaseCommandOptions}  options 
   * @returns {Promise<void>}
   */
  @Cron("0 */5 * * * *", { name: "discovery:cronjobs:accounts" })
  public async runAsScheduler(): Promise<void> {
    // accounts discovery cronjob always ready the dApp's main account
    const dappPubKey = this.configService.get<string>("dappPublicKey");

    // executes the actual command logic (this will call discover())
    super.run([], { source: dappPubKey, debug: true } as DiscoveryCommandOptions);
  }

 /**
   * This method implements the discovery logic for this command
   * that will find relevant *subjects*. Subjects in this command
   * are **accounts** that have previously *received* a transaction
   * from the dApp's main account.
   * <br /><br />
   * Discovery is done in 3 steps as described below:
   * - Step 1: Reads the dApp's main account outgoing transactions
   * - Step 2: Updates accounts' transaction time if necessary
   * - Step 3: Updates the accounts documents in a batch operation
   * - Step 4: Updates the discovery state document for next runs
   *
   * @access public
   * @async
   * @param   {DiscoveryCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async discover(options?: DiscoveryCommandOptions): Promise<void> {
    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog(`Starting discovery with "${this.command}"`);
    }

    // starts the account discovery process
    // prepares execution template
    const repository = this.networkService.getTransactionRepository();
    const signerPubKey = this.configService.get<string>("dappPublicKey");

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(`Discovery is tracking the account: "${
        this.discoverySource.plain()
      }"`);
    }

    // reads the latest execution state, fields will be modified later ("let")
    let lastPageNumber: number = 1;
    let lastTransactionHash: string = undefined;
    if (this.state && this.state.data) {
      lastPageNumber = this.state.data.latestTxPage;
      lastTransactionHash = this.state.data.latestTxHash;
    }

    // display debug information about pagination
    if (options.debug && !options.quiet) {
      this.debugLog(`Now reading 5 pages including page ${lastPageNumber}`);
    }

    // (1) each round queries 1 page of transactions from REST gateway
    // after the 10th [and last] round we update the `states` document
    for (let i = lastPageNumber, max = lastPageNumber+5; i < max; i++, lastPageNumber++) {
      // fetches *confirmed* transaction from node, in *ascending* order
      // @todo this may fail due to intermittent connection problems
      const result = await repository.search({
        signerPublicKey: signerPubKey,
        group: TransactionGroup.Confirmed,
        embedded: true,
        order: Order.Asc,
        pageNumber: i, // 1 and above
        pageSize: 100,
      }).toPromise();

      // display debug information about result
      if (options.debug && !options.quiet) {
        this.debugLog(`Found transaction page with ${result.data.length} transactions.`);
      }

      // retrieves the account address from transactions
      // @todo Ordering must be passed here to determine
      //       if "last" or "first" has "current" attribute.
      lastTransactionHash = this.processTransactionsPage(
        lastTransactionHash,
        result.data,
      );

      // bail out if no more results
      if (result.isLastPage) {
        break;
      }
    }

    // (2) each round creates or finds 1 `accounts` document
    const accounts: Account[] = [];
    for (let j = 0, max = this.discoveredAddresses.length; j < max; j++) {

      const address: string = this.discoveredAddresses[j];
      const fstHash: string = this.transactionsByAddress.get(address)[0];

      // create account models or find already existing ones
      const account: Account = await this.createOrFindAccount(
        address,
        fstHash
      );

      accounts.push(account);
    }

    // display debug information database operation
    if (options.debug && !options.quiet) {
      this.debugLog(`Updating ${accounts.length} accounts documents in database`);
    }

    // (3) updates `accounts` entries in batch operation
    this.accountsService.updateBatch(accounts.map(a => a as AccountDocument));

    // (4) updates state with this round's information
    this.state = await this.statesService.updateOne(this.getStateQuery(), {
      latestTxPage: lastPageNumber,
      latestTxHash: lastTransactionHash,
    } as AccountDiscoveryStateData);
  }

  /**
   * This method builds an index of transaction hashes and processes
   * them individually such that transactions are mapped by addresses.
   * It returns the *last* transaction hash that is found in the
   * `transactions` parameter. No sorting or ordering is done on the
   * input transactions before the hash index is built.
   * <br /><br />
   * Note that this method *modifies* the {@link discoveredAddress} class
   * property as well as the {@link transactionsByAddress} and also saves
   * a copy of all *transfer* transactions processed in {@link transactions}.
   *
   * @todo Add ordering parameter and determine "current" using "last" or "first" accordingly.
   * @access protected
   * @async
   * @param {Transaction[]} transactions
   * @returns {string}
   */
  protected processTransactionsPage(
    latestTxHash: string | undefined,
    transactions: Transaction[],
  ): string {
    // helps keeping track of transactions already processed
    const hashIndex: string[] = transactions.map(
      (tx: Transaction) => this.extractTransactionHash(tx)
    );

    // in case the latest processed transaction is in the index *again*,
    // drop all transactions preceding it and keep only the new ones.
    if (undefined !== latestTxHash && hashIndex.includes(latestTxHash)) {
      transactions.splice(0, hashIndex.indexOf(latestTxHash) + 1);
    }

    // transforms transactions to contain only transfers
    const transfers: TransferTransaction[] = transactions.filter(
      t => t.type === TransactionType.TRANSFER
    ).map(t => t as TransferTransaction);

    // stores all transfers in memory for later re-use
    this.transactions = this.transactions.concat(transfers);

    // proceeds to extracting accounts from **transfer** transactions
    this.discoveredAddresses = this.discoveredAddresses.concat(
      transfers.map(t => t.recipientAddress.plain()),
    ).filter((v, i, s) => s.indexOf(v) === i); // unique

    // each round stores a *memory* copy of transaction hashes
    // mapped to recipient addresses, for later counting process
    for (let i = 0, max = this.discoveredAddresses.length; i < max; i++) {
      const address: string = this.discoveredAddresses[i]; // shortcut

      // keeps only relevant transactions
      const transactions = transfers.filter(
        t => t.recipientAddress.plain() === address,
      );

      // retrieves memory checkpoint for this account
      const olderTransactions = this.transactionsByAddress.has(address)
        ? this.transactionsByAddress.get(address)
        : [];

      // stores new transaction hashes in memory
      this.transactionsByAddress.set(address, olderTransactions.concat(
        transactions.map(t => this.extractTransactionHash(t))
      ));
    };

    // returns the last processed transaction hash
    return hashIndex.pop();
  }

  /**
   * This method uses the {@link accountsService} to fetch a
   * document *by address* and updates the number of processed
   * transactions depending on the {@link transactionsByAddress}
   * records for said recipient.
   * <br /><br />
   * Additionally, if an address is not found in the database,
   * the first transaction will be queried to determine the
   * block height at which the transaction got confirmed.
   *
   * @access protected
   * @async
   * @param   {string} recipient              The address of the account being searched for.
   * @param   {string} firstTransactionHash   The first transaction hash, if any. (optional)
   * @returns {Promise<Account>}    An instance of {@link Account}, either created JiT or updated.
   */
  protected async createOrFindAccount(
    recipient: string,
    firstTransactionHash: string,
  ): Promise<Account> {
    // shortcut for the number of processed transactions
    const countProcessed = this.transactionsByAddress.get(recipient).length;

    // queries the database to find account by address
    const document = await this.accountsService.findOne(
      new AccountQuery(undefined, recipient),
    );

    // if the document exists, we must update `transactionsCount`
    if (!! document) {
      const countOlderTxes = document.transactionsCount ?? 0;

      // increments the number of transactions
      document.transactionsCount = countOlderTxes + countProcessed;
      return document;
    }

    // gets the first transfer object (used to read "height")
    const firstTransfer: TransferTransaction = this.transactions.find(
      t => firstTransactionHash === this.extractTransactionHash(t)
    )

    // unknown account that is processed for the first time
    const account = new Account();
    account.address = recipient;
    account.transactionsCount = countProcessed;
    account.firstTransactionAtBlock = firstTransfer.transactionInfo.height.compact();
    return account;
  }

  /**
   * Helper method to extract the transaction hash of a `Transaction`
   * instance. This is necessary because aggregate transactions store
   * their hash in a separate field.
   *
   * @param {Transaction} transaction 
   * @returns {string}
   */
  protected extractTransactionHash(transaction: Transaction): string {
    return transaction.transactionInfo.hash
      ? (transaction.transactionInfo as TransactionInfo).hash
      : (transaction.transactionInfo as AggregateTransactionInfo).aggregateHash
  }
}
