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
import { Command, CommandRunner, Option } from "nest-commander";
import { ConfigService } from "@nestjs/config";
import {
  AggregateTransactionInfo,
  Transaction as SdkTransaction,
  TransactionGroup,
  TransactionInfo,
  TransactionType,
  Order,
} from "@dhealth/sdk";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { StateData } from "../../../common/models/StateData";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import { TransactionsService } from "../../../discovery/services/TransactionsService";
import { getTransactionType } from "../../../discovery/models/TransactionTypes";
import {
  Transaction,
  TransactionDocument,
  TransactionQuery,
} from "../../models/TransactionSchema";

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
@Command({
  name: "discovery:transactions",
  arguments: "<mode>",
  options: { isDefault: false },
  argsDescription: {
    "mode": "One of: 'incoming', 'outgoing' or 'both' (defaults to 'incoming')"
  }
})
export class DiscoverTransactions
  extends DiscoveryCommand
  implements CommandRunner
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
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {ConfigService}   configService
   * @param {StateService}   stateService
   * @param {NetworkService}  networkService
   * @param {TransactionsService}  transactionsService
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly transactionsService: TransactionsService,
  ) {
    // required super call
    super(stateService);
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
  protected getStateData(): StateData {
    return {} as StateData
  }

  /**
   * This helper method serves as a *parser* for the `-t`
   * or `--include-types` option of this command.
   *
   * @param     {string}  transactionTypes     The transactionTypes as passed in the terminal.
   * @returns   {TransactionType[]|undefined}   An array of transaction types or undefined.
   */
  @Option({
    flags: '-t, --include-types',
    description: 'Defines which transaction types are relevant to the discovery, e.g. "transfer"'
  })
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
  @Option({
    flags: '-u, --include-unconfirmed',
    description: 'Defines whether the discovery should include unconfirmed transactions'
  })
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
  @Option({
    flags: '-p, --include-partial',
    description: 'Defines whether the discovery should include partial transactions (aggregate bonded)'
  })
  protected parsePartialFlag(partialOption: string): boolean {
    return !!partialOption;
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
      this.debugLog(`Starting discovery with "${this.command}"`);
    }

    // initialize a connection to the node
    // and prepare a transaction query (to REST gateway)
    const nodeRequests = this.networkService.getTransactionRepository();

    // pageNumber=1 fetches "recent" due to DESC ordering
    const nodeTxQuery = this.getTransactionQuery(1, options.includeTypes);

    // by default we query only **confirmed** transactions
    // these are transactions that are *included in a block*.
    const transactionPromises = [
      nodeRequests.search({
        ...nodeTxQuery,
        group: TransactionGroup.Confirmed,
      }).toPromise(),
    ];

    // we permit to include **unconfirmed** transactions
    // with the option `--include-unconfirmed`.
    if (undefined !== options.includeUnconfirmed) {
      transactionPromises.push(nodeRequests.search({
        ...nodeTxQuery,
        group: TransactionGroup.Unconfirmed,
      }).toPromise())
    }

    // we permit to include **partial** transactions (aggregate bonded)
    // with the option `--include-partial`.
    if (undefined !== options.includePartial) {
      transactionPromises.push(nodeRequests.search({
        ...nodeTxQuery,
        group: TransactionGroup.Partial,
      }).toPromise())
    }

    // executes the promises
    const transactionPages = await Promise.all(transactionPromises);

    // keeps only the transaction part and drops pagination
    this.transactions = transactionPages.reduce(
      (prev, cur, arr) => prev.concat(cur.data),
      []
    );

    // each transaction that is read from the network is cached
    // in our `transactions` collection using the *signer address*
    // and the *transaction hash* as primary keys.
    const documents: TransactionDocument[] = [];
    for (let i = 0, max = this.transactions.length; i < max; i++) {
      // uses a mongoose query to find transaction
      const model = await this.findOrCreateTransaction(this.transactions[i])
      documents.push(model as TransactionDocument);
    }

    // updates documents in database collection `transactions`
    this.transactionsService.updateBatch(documents);
  }

  /**
   * 
   * @param transaction 
   * @returns 
   */
  protected async findOrCreateTransaction(
    transaction: SdkTransaction,
  ): Promise<Transaction> {
    // reads complex transaction details
    const signerAddress: string = this.extractSignerAddress(transaction);
    const transactionHash: string = this.extractTransactionHash(transaction);
    
    // queries the database to find transaction by signerAddress and hash
    const databaseQuery = new TransactionQuery({
      signerAddress,
      transactionHash,
    } as TransactionDocument);

    let document: Transaction;
    if (! (document = await this.transactionsService.findOne(databaseQuery))) {
      document = new Transaction();
      document.signerAddress = signerAddress;
      document.transactionHash = transactionHash;
      document.transactionType = this.extractTransactionType(transaction);
      document.signature = transaction.signature;
      document.encodedBody = this.extractTransactionBody(transaction);
      document.discoveredAt = new Date();
    }

    return document;
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
