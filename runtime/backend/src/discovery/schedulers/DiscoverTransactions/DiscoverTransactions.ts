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
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import {
  Address,
  AggregateTransactionInfo,
  Order,
  Page,
  Transaction as SdkTransaction,
  TransactionGroup,
  TransactionInfo,
  TransactionType,
} from "@dhealth/sdk";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { State, StateQuery } from "../../../common/models/StateSchema";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import { TransactionsService } from "../../../discovery/services/TransactionsService";
import { getTransactionType } from "../../../discovery/models/TransactionTypes";
import { Transaction, TransactionModel, TransactionQuery } from "../../models/TransactionSchema";
import { TransactionDiscoveryStateData } from "../../models/TransactionDiscoveryStateData";

/**
 * @interface DiscoverTransactionsCommandOptions
 * @description This interface defines **arguments** that can be
 * passed to this **discovery** command that is implemented in the
 * backend runtime.
 * <br /><br />
 * Note that it is important that child classes extend this interface
 * with their own specification of arguments.
 *
 * @see DiscoveryCommandOptions
 * @since v0.2.0
 */
export interface DiscoverTransactionsCommandOptions extends DiscoveryCommandOptions {
  /**
   * Defines which *transaction types* must be considered relevant
   * during runtime. If this array is left empty, *any* transaction
   * type that involves the dApp's main account will be considered
   * a relevant subject.
   *
   * @access public
   * @var {TransactionType[]}
   */
  includeTypes?: TransactionType[],

  /**
   * Defines whether *unconfirmed* transactions must be included in
   * the resulting transaction page(s).
   *
   * @access public
   * @var {boolean}
   */
  includeUnconfirmed?: boolean;

  /**
   * Defines whether *partial* transactions must be included in
   * the resulting transaction page(s).
   *
   * @access public
   * @var {boolean}
   */
  includePartial?: boolean
}

/**
 * @class DiscoverTransactions
 * @description The implementation for the transaction discovery
 * scheduler. Contains source code for the execution logic of a
 * command with name: `discovery:transactions`.
 *
 * @since v0.2.0
 */
@Injectable()
export class DiscoverTransactions
  extends DiscoveryCommand
{
  /**
   * Memory store for *all* transactions processed in one run of this
   * command. Note that it contains **only transfer** transactions as
   * those are the only relevant to this discovery command.
   *
   * @access protected
   * @var {SdkTransaction[]}
   */
  protected transactions: SdkTransaction[] = [];

  /**
   * Memory store for the last page number being read. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastPageNumber: number;

  /**
   * Memory store for the last account being read. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {string}
   */
  private lastUsedAccount: string;

  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {ConfigService}   configService
   * @param {StateService}   stateService
   * @param {NetworkService}  networkService
   * @param {TransactionsService}  transactionsService
   */
  constructor(
    @InjectModel(Transaction.name) protected readonly model: TransactionModel,
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly transactionsService: TransactionsService,
  ) {
    // required super call
    super(stateService);

    // sets default state data
    this.lastPageNumber = 1;
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
    return `DiscoverTransactions`;
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
   * This helper method should return the latest execution state
   * such that it can be saved.
   * <br /><br />
   * Execution states refer to one module's required state data,
   * potentially necessary during execution, and which is fetched
   * in {@link run} before execution and updated in {@link run}
   * after execution.
   *
   * @access protected
   * @returns {StateData}
   */
  protected getStateData(): TransactionDiscoveryStateData {
    return {
      lastUsedAccount: this.lastUsedAccount,
    } as TransactionDiscoveryStateData
  }

  /**
   * This helper method serves as a *parser* for the `-t`
   * or `--include-types` option of this command.
   *
   * @param     {string}  transactionTypes     The transactionTypes as passed in the terminal.
   * @returns   {TransactionType[]|undefined}   An array of transaction types or undefined.
   */
  protected parseTransactionTypes(transactionTypes: string): TransactionType[] {
    // maps utility names to transaction types
    if (transactionTypes.toLowerCase().indexOf("transfer")) {
      return [ TransactionType.TRANSFER ];
    }

    // no transaction types filtering means "any type"
    return [];
  }

  /**
   * This helper method serves as a *parser* for the `-u`
   * or `--include-unconfirmed` option of this command.
   *
   * @param     {string}  unconfirmedOption     The unconfirmedOption as passed in the terminal.
   * @returns   {boolean}   A boolean value that determines if unconfirmed transactions are included or not.
   */
  protected parseUnconfirmedFlag(unconfirmedOption: string): boolean {
    return !!unconfirmedOption;
  }

  /**
   * This helper method serves as a *parser* for the `-p`
   * or `--include-partial` option of this command.
   *
   * @param     {string}  partialOption     The partialOption as passed in the terminal.
   * @returns   {boolean}   A boolean value that determines if unconfirmed transactions are included or not.
   */
  protected parsePartialFlag(partialOption: string): boolean {
    return !!partialOption;
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
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
  @Cron("0 */1 * * * *", { name: "discovery:cronjobs:transactions" })
  public async runAsScheduler(): Promise<void> {
    // read discovery configuration
    const sources = this.configService.get<string[]>("discovery.sources");

    // bail out if configuration is empty
    if (!sources || !sources.length) {
      return ;
    }

    // iterate through all configured discovery sources and
    // fetch transactions. Transactions will first be read
    // for accounts that are *not yet synchronized*.
    const source: string = await this.getNextSource(sources);
    this.lastUsedAccount = source;

    // executes the actual command logic (this will call discover())
    // additionally, updates state.data.lastUsedAccount
    await this.run([], { source, debug: true } as DiscoveryCommandOptions);
  }

  /**
   * This method implements the discovery logic for this command
   * that will find relevant *subjects*. Subjects in this command
   * are **transactions** that are either incoming or outgoing in
   * relation to the dApp's main account.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {DiscoverTransactionsCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async discover(
    options?: DiscoverTransactionsCommandOptions,
  ): Promise<void> {
    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog(`Starting transactions discovery for source "${options.source}"`);
    }

    // per-source synchronization: "discovery:DiscoverTransactions:%SOURCE%"
    const stateIdentifier = `${this.stateIdentifier}:${options.source}`;
    const stateQuerySrc = new StateQuery({ name: stateIdentifier } as State);

    // fetch **per-source** synchronization state once
    // Caution: do not confuse with `this.state`, this one
    // is internal and synchronizes **per each source**.
    const state = await this.stateService.findOne(stateQuerySrc);

    // reads the latest per-source execution state
    if (!!state && "lastPageNumber" in state.data) {
      this.lastPageNumber = state.data.lastPageNumber ?? 1;
    }

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(`Last discovery ended with page: "${this.lastPageNumber}"`);
    }

    // note that these may be undefined
    const { includeUnconfirmed, includePartial} = options;

    // (1) each round queries 1 page of transactions from REST gateway
    // and fetches a maximum of 5 transaction pages following the last
    let uniqueHashes: string[] = [];
    for (let i = this.lastPageNumber, max = this.lastPageNumber+5;
      i < max;
      i++, this.lastPageNumber++) {

      // prepare the transaction queries
      const promises = this.getTransactionQueriesForPage(i, includeUnconfirmed, includePartial);

      // executes the promises and fetches sync-state
      const transactionPages = await Promise.all(promises);
      const isSynchronized = transactionPages.reduce(
        (prev, cur) => prev && cur.isLastPage,
        true,
      );

      // keeps only the transaction part and drops pagination
      this.transactions = transactionPages.reduce(
        (prev, cur) => prev.concat(cur.data),
        []
      );

      // (2) each transaction that is read from the network is
      // cached in our `transactions` collection using the hash
      // of the transaction as the document primary key.
      const hashes = this.transactions.map(t => this.extractTransactionHash(t));
      uniqueHashes = uniqueHashes.concat(hashes.filter(
        async (transactionHash: string) => undefined === await this.transactionsService.findOne(
          new TransactionQuery({ transactionHash } as Transaction)
        )
      ));

      // break if this source is now considered synchronized
      if (true === isSynchronized) {
        break;
      }
    }

    // (3) prepares and populates individual `transactions` documents
    let documents: Transaction[] = [];
    for (let i = 0, max = uniqueHashes.length; i < max; i++) {
      // retrieve full transaction details
      const transaction = this.transactions.find(
        t => uniqueHashes[i] === this.extractTransactionHash(t)
      );

      // create a `transactions` document
      documents.push(this.model.create({
        transactionHash: uniqueHashes[i],
        signerAddress: this.extractSignerAddress(transaction),
        signerPublicKey: this.extractSignerPublicKey(transaction),
        transactionType: this.extractTransactionType(transaction),
        signature: this.extractTransactionSignature(transaction),
        encodedBody: this.extractTransactionBody(transaction),
      }));
    }

    // (4) commits documents to database collection `transactions`
    if (documents.length > 0) {
      // display debug information about database operation
      if (options.debug && !options.quiet) {
        this.debugLog(`Creating ${documents.length} transactions documents in database`);
      }

      this.transactionsService.updateBatch(documents);
    }

    // (5) update per-source state `lastPageNumber`
    await this.stateService.updateOne(
      stateQuerySrc, 
      {
        lastPageNumber: this.lastPageNumber,
      }, 
    );
  }

  /**
   * 
   * @param sources 
   * @param state
   * @returns 
   */
  protected async getNextSource(
    sources: string[],
  ): Promise<string> {
    // iterate through all configured discovery sources and
    // fetch transactions. Transactions will first be read
    // for accounts that are *not yet synchronized*.
    let address: Address,
        cursor: number = 0;
    do {
      address = this.parseSource(sources[cursor++]);

      // fetch **per-source** synchronization state once
      // Caution: do not confuse with `this.state`, this one
      // is internal and synchronizes **per each source**.
      const state = await this.stateService.findOne(new StateQuery({
        name: `${this.stateIdentifier}:${address.plain()}`, // "discovery:DiscoverTransactions:%SOURCE%"
      } as State));

      // if current source is synchronized, move to next
      if (!!state && "sync" in state.data && true === state.data.sync) {
        continue;
      }

      // if no sync state is available, use **current source**
      return address.plain();
    }
    while(cursor < sources.length);

    // use first with no sync configuration
    if (!this.state || !("lastUsedAccount" in this.state.data)) {
      return sources[0];
    }

    // fully synchronized: switch source every minute
    let lastIndex = sources.findIndex(
      s => s === this.state.data.lastUsedAccount,
    );

    // if necessary, loop through back to first source
    if (lastIndex === -1 || lastIndex === sources.length-1) {
      return sources[0];
    }

    return sources[lastIndex+1];
  }

  /**
   * This method returns a **transactions query** that is compatible
   * with dHealth Network Node's REST gateway. It uses the runtime
   * arguments to determine a *query mode* of: "incoming", "outgoing"
   * or "both".
   * <br /><br />
   * 
   * @access protected
   * @param   {number}              pageNumber          The page number to be fetched (defaults to `1`). (optional)
   * @param   {TransactionType[]}   transactionTypes    The transaction types that must be included (defaults to any type). (optional)
   * @param   {boolean}             unfoldEmbedded      Whether embedded transactions must be unfold or not (default to `true`). (optional)
   * @param   {number}              pageSize            The page size (defaults to `100`). (optional)
   * @param   {Order}               order               The ordering strategy that is used for the query (defaults to `Order.Desc`). (optional)
   * @returns 
   */
  protected getTransactionQuery(
    pageNumber: number = 1,
    transactionTypes: TransactionType[] = [TransactionType.TRANSFER],
    unfoldEmbedded: boolean = true,
    pageSize: number = 100,
    order: Order = Order.Desc,
  ): any {
    // should hold one of: "incoming", "outgoing" or "both"
    const queryMode: string = this.argv[0];

    // returns a REST-compatible query
    const baseQuery: any = {
      embedded: unfoldEmbedded,
      order: order,
      pageNumber,
      pageSize,
    };

    if (transactionTypes.length) {
      baseQuery["type"] = transactionTypes;
    }

    if ("incoming" === queryMode) {
      baseQuery["recipientAddress"] = this.discoverySource;
    }

    if (["outgoing", "both"].includes(queryMode)) {
      baseQuery["address"] = this.discoverySource;
    }

    return baseQuery;
  }


  /**
   * 
   * @param transactionRepository 
   * @returns {Promise<Page<Transaction>>[]}  An array of *promises* for transaction pages.
   */
   protected getTransactionQueriesForPage(
    pageNumber: number,
    includeUnconfirmed: boolean = false,
    includePartial: boolean = false,
  ): Promise<Page<SdkTransaction>>[] {
    // prepares output
    const promises = [];

    // initialize a connection to the node
    // and prepare a transaction query (to REST gateway)
    const repository = this.networkService.getTransactionRepository();
    const baseQuery = this.getTransactionQuery(pageNumber);

    // add **confirmed** transaction query (by default)
    // these are transactions that are *included in a block*.
    promises.push(repository.search({ ...baseQuery,
      group: TransactionGroup.Confirmed,
    }).toPromise());

    // we permit to include **unconfirmed** transactions
    // note that unconfirmed transaction are always "recent".
    if (true === includeUnconfirmed) {
      promises.push(repository.search({ ...baseQuery,
        pageNumber: 1,
        group: TransactionGroup.Unconfirmed,
      }).toPromise())
    }

    // we permit to include **partial** transactions (aggregate bonded)
    // note that partial transaction are always "recent".
    if (true === includePartial) {
      promises.push(repository.search({ ...baseQuery,
        pageNumber: 1,
        group: TransactionGroup.Partial,
      }).toPromise())
    }

    return promises;
  }
  /**
   * Helper method to extract the signer public key of a `Transaction`
   * instance.
   *
   * @param {Transaction} transaction 
   * @returns {string}
   */
  protected extractSignerPublicKey(transaction: SdkTransaction): string {
    return transaction.signer.publicKey;
  }

  /**
   * Helper method to extract the signer address of a `Transaction`
   * instance.
   *
   * @param {Transaction} transaction 
   * @returns {string}
   */
  protected extractSignerAddress(transaction: SdkTransaction): string {
    return transaction.signer.address.plain()
  }

  /**
   * Helper method to extract the transaction hash of a `Transaction`
   * instance. This is necessary because aggregate transactions store
   * their hash in a separate field.
   *
   * @param {Transaction} transaction 
   * @returns {string}
   */
  protected extractTransactionHash(transaction: SdkTransaction): string {
    return transaction.transactionInfo.hash
      ? (transaction.transactionInfo as TransactionInfo).hash
      : (transaction.transactionInfo as AggregateTransactionInfo).aggregateHash
  }

  /**
   * Helper method to extract the transaction 
   *
   * @param {Transaction} transaction 
   * @returns {string}
   */
  protected extractTransactionType(transaction: SdkTransaction): string {
    return getTransactionType(transaction.type);
  }

  /**
   * 
   * @param transaction 
   */
  protected extractTransactionSignature(transaction: SdkTransaction): string {
    return transaction.signature;
  }

  /**
   * 
   * @param transaction 
   */
  protected extractTransactionBody(transaction: SdkTransaction): string {
    // serializes transaction to get hexadecimal payload
    const payload: string = transaction.serialize();

    // following transaction header applies here:
    // size | r1 | sig | pub | r2 | ver | net | type
    //   4b | 4b | 64b | 32b | 4b |  1b |  1b |   2b
    // --> we are dropping 112 bytes as the header
    // and we return only the remaining body after
    return payload.substring(112);
  }
}
