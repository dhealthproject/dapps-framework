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
  AggregateTransactionInfo,
  Order,
  Page,
  Transaction as SdkTransaction,
  TransactionGroup,
  TransactionInfo,
  TransactionType,
  TransferTransaction,
  UInt64,
} from "@dhealth/sdk";
import { ObjectLiteral } from "@dhealth/contracts";

// internal dependencies
import { StateDocument, StateQuery } from "../../../common/models/StateSchema";
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import { AssetsService } from "../../../discovery/services/AssetsService";
import { TransactionsService } from "../../../discovery/services/TransactionsService";
import { TransactionTypes } from "../../../discovery/models/TransactionTypes";
import {
  Transaction,
  TransactionDocument,
  TransactionModel,
  TransactionQuery,
} from "../../../common/models/TransactionSchema";
import { TransactionDiscoveryStateData } from "../../models/TransactionDiscoveryStateData";
import { LogService } from "../../../common/services/LogService";

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
export interface DiscoverTransactionsCommandOptions
  extends DiscoveryCommandOptions {
  /**
   * Defines which *transaction types* must be considered relevant
   * during runtime. If this array is left empty, *any* transaction
   * type that involves the dApp's main account will be considered
   * a relevant subject.
   *
   * @access public
   * @var {TransactionType[]}
   */
  includeTypes?: TransactionType[];

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
  includePartial?: boolean;
}

/**
 * @class DiscoverTransactions
 * @description The implementation for the transaction discovery
 * scheduler. Contains source code for the execution logic of a
 * command with name: `discovery:DiscoverTransactions`.
 *
 * @since v0.2.0
 */
@Injectable()
export class DiscoverTransactions extends DiscoveryCommand {
  /**
   * Memory store for the *fees asset configuration* object. This
   * object defines which assets are *discoverable* on dHealth Network
   * and used to pay for *transaction fees*.
   * <br /><br />
   * This asset configuration is referred to as the **base asset**
   * used in a specific dApp. The reason for this is that transactions
   * on the underlying dHealth Network are always paid with one and the
   * same asset.
   *
   * @access protected
   * @var {DiscoverableAssetsMap}
   */
  //protected baseAsset: AssetParameters;

  /**
   * Memory store for the *earn asset configuration* object. This
   * object defines which assets are *discoverable* on dHealth Network
   * and used to *tokenize a particular operation*.
   * <br /><br />
   * This asset configuration is referred to as the **earn asset**
   * used in a specific dApp. The reason for this is that individual
   * dApps may want their end-users to earn a custom asset, or not.
   *
   * @access protected
   * @var {DiscoverableAssetsMap}
   */
  //protected earnAsset: AssetParameters;

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
   * Memory store for the total number of transactions. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private totalNumberOfTransactions: number;

  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {LogService}      logger
   * @param {ConfigService}   configService
   * @param {StateService}   stateService
   * @param {NetworkService}  networkService
   * @param {TransactionsService}  transactionsService
   */
  constructor(
    @InjectModel(Transaction.name) protected readonly model: TransactionModel,
    protected readonly logger: LogService,
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly transactionsService: TransactionsService,
    protected readonly logService: LogService,
  ) {
    // required super call
    super(logService, stateService);

    // sets default state data
    this.lastPageNumber = 1;
    this.totalNumberOfTransactions = 0;

    // setup assets discovery
    //this.baseAsset = this.configService.get<AssetParameters>("assets.base");
    //this.earnAsset = this.configService.get<AssetParameters>("assets.earn");
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   * <br /><br />
   * This property is required through the extension of
   * {@link DiscoveryCommand}.
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
   * <br /><br />
   * This property is required through the extension of
   * {@link DiscoveryCommand}.
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return (
      `${this.command} incoming|outgoing|both [` +
      `--source "SOURCE-ADDRESS-OR-PUBKEY"` +
      `--includeTypes "transfer"` +
      `--includeUnconfirmed` +
      `--includePartial` +
      `]`
    );
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
      totalNumberOfTransactions: this.totalNumberOfTransactions,
    } as TransactionDiscoveryStateData;
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
    if (transactionTypes.toLowerCase().indexOf("transfer") >= 0) {
      return [TransactionType.TRANSFER];
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
   * This scheduler is registered to run **every 1 minute**.
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
      return;
    }

    // iterate through all configured discovery sources and
    // fetch transactions. Transactions will first be read
    // for accounts that are *not yet synchronized*.
    const source: string = await this.getNextSource(sources);
    this.lastUsedAccount = source;

    // executes the actual command logic (this will call discover())
    // additionally, updates state.data.lastUsedAccount
    await this.run(["both"], {
      source,
      debug: process.env.NODE_ENV === "development",
    } as DiscoveryCommandOptions);
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
      this.debugLog(
        `Starting transactions discovery for source "${options.source}"`,
      );
    }

    // reads the latest global execution state
    if (!!this.state && "totalNumberOfTransactions" in this.state.data) {
      this.totalNumberOfTransactions =
        this.state.data.totalNumberOfTransactions ?? 0;
    }

    // account for transactions created before this run
    if (0 === this.totalNumberOfTransactions) {
      this.totalNumberOfTransactions = await this.transactionsService.count(
        new TransactionQuery({} as TransactionDocument),
      );
    }

    // per-source synchronization: "discovery:DiscoverTransactions:%SOURCE%"
    const stateIdentifier = `${this.stateIdentifier}:${options.source}`;
    const stateQuerySrc = new StateQuery({
      name: stateIdentifier,
    } as StateDocument);

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
      this.debugLog(
        `Last discovery for "${stateIdentifier}" ended with page: "${this.lastPageNumber}"`,
      );
    }

    // setup timing
    const discoveredAt = new Date().valueOf();

    // note that these may be undefined
    const { includeUnconfirmed, includePartial } = options;

    // (1) each round queries 1 page of transactions from REST gateway
    // and fetches a maximum of 5 transaction pages following the last
    let hashes: string[] = [];
    let isSynchronized: boolean;
    for (
      let i = this.lastPageNumber, max = this.lastPageNumber + 5;
      i < max;
      i++, this.lastPageNumber++
    ) {
      // prepare the transaction queries
      const promises = this.getTransactionQueriesForPage(
        i,
        includeUnconfirmed,
        includePartial,
      );

      // executes the promises and fetches sync-state
      // uses the network service to execute transaction queries
      // as to avoid request failures due to node connection issues
      const transactionPages = await this.networkService.delegatePromises(
        promises,
      );

      // determines the current source's synchronization state
      isSynchronized = transactionPages.reduce(
        (prev, cur) => prev && cur.isLastPage,
        true,
      );

      // keeps only the transaction part and drops pagination
      const transactions = transactionPages.reduce(
        (prev, cur) => prev.concat(cur.data),
        [],
      );

      // reads transaction hashes
      hashes = hashes
        .concat(
          transactions.map((t: SdkTransaction) =>
            this.extractTransactionHash(t),
          ),
        )
        .filter((v, i, s) => s.indexOf(v) === i); // unique

      // store transactions in memory during runtime
      this.transactions = this.transactions.concat(transactions);

      // break if this source is now considered synchronized
      if (true === isSynchronized) {
        break;
      }
    }

    // debug information about upcoming database operations
    if (options.debug && !options.quiet && hashes.length > 0) {
      this.debugLog(`(${stateIdentifier}) Found ${hashes.length} transactions`);
    }
    // also display debug message when no operations are executed
    else if (options.debug && !options.quiet && !hashes.length) {
      this.debugLog(`(${stateIdentifier}) No transactions found`);
    }

    // (3) prepares and populates individual `transactions` documents
    //let documents: Transaction[] = [];
    let nSkipped = 0;
    let nCreated = 0;
    for (let i = 0, max = hashes.length; i < max; i++) {
      // retrieve full transaction details
      const transaction = this.transactions.find(
        (t) => hashes[i] === this.extractTransactionHash(t),
      );

      // retrieve existence information
      const documentExists: boolean = await this.transactionsService.exists(
        new TransactionQuery({
          transactionHash: hashes[i],
        } as TransactionDocument),
      );

      // skip update for known transactions
      if (true === documentExists) {
        nSkipped++;
        continue;
      }

      // determine the transaction mode
      const recipient: string = this.extractRecipientAddress(transaction);
      const sourceAddr: string = this.discoverySource.plain();
      const transactionMode: string =
        recipient === sourceAddr ? "incoming" : "outgoing";

      // create a `transactions` document
      await this.model.create({
        transactionHash: hashes[i],
        transactionMode,
        sourceAddress: sourceAddr,
        recipientAddress: recipient,
        signerAddress: this.extractSignerAddress(transaction),
        signerPublicKey: this.extractSignerPublicKey(transaction),
        transactionType: this.extractTransactionType(transaction),
        transactionMessage: this.extractTransactionMessage(transaction),
        transactionAssets: this.extractAssets(transaction),
        signature: this.extractTransactionSignature(transaction),
        encodedBody: this.extractTransactionBody(transaction),
        creationBlock: this.extractTransactionBlock(transaction),
        discoveredAt: discoveredAt,
      });

      nCreated++;
    }

    // updates total counter
    this.totalNumberOfTransactions += nCreated;

    // display debug information about total number of transactions
    this.debugLog(
      `Total number of transactions: "${this.totalNumberOfTransactions}"`,
    );

    if (options.debug && !options.quiet) {
      this.debugLog(
        `(${stateIdentifier}) Skipped ${nSkipped} transaction(s) that already exist`,
      );
    }

    // (4) update per-source state `lastPageNumber`
    await this.stateService.updateOne(
      stateQuerySrc, // /!\ per-source
      {
        lastPageNumber: this.lastPageNumber,
        sync: isSynchronized,
      },
    );

    // no-return (void)
  }

  /**
   * This method returns a **transactions query** that is compatible
   * with dHealth Network Node's REST gateway. It uses the runtime
   * arguments to determine a *query mode* of: "incoming", "outgoing"
   * or "both".
   *
   * @access protected
   * @param   {number}              pageNumber          The page number to be fetched (defaults to `1`). (optional)
   * @param   {TransactionType[]}   transactionTypes    The transaction types that must be included (defaults to any type). (optional)
   * @param   {boolean}             unfoldEmbedded      Whether embedded transactions must be unfold or not (default to `true`). (optional)
   * @param   {number}              pageSize            The page size (defaults to `100`). (optional)
   * @param   {Order}               order               The ordering strategy that is used for the query (defaults to `Order.Asc`). (optional)
   * @returns
   */
  protected getTransactionQuery(
    pageNumber = 1,
    transactionTypes: TransactionType[] = [TransactionType.TRANSFER],
    unfoldEmbedded = true,
    pageSize = 100,
    order: Order = Order.Asc,
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
   * This method creates one or more *transaction page queries*
   * that are executed using the `@dhealth/sdk` transactions
   * repository.
   * <br /><br />
   * Note that the unconfirmed- and partial- transaction pools
   * do not use multiple pages and thereby always return *recent*
   * transactions.
   *
   * @param transactionRepository
   * @returns {Promise<Page<Transaction>>[]}  An array of *promises* for transaction pages.
   */
  protected getTransactionQueriesForPage(
    pageNumber: number,
    includeUnconfirmed = false,
    includePartial = false,
  ): Promise<Page<SdkTransaction>>[] {
    // prepares output
    const promises = [];

    // initialize a connection to the node
    // and prepare a transaction query (to REST gateway)
    const repository = this.networkService.transactionRepository;
    const baseQuery = this.getTransactionQuery(
      pageNumber,
      [TransactionType.TRANSFER],
      false, // excludes embedded
    );

    // add **confirmed** transaction query (by default)
    // these are transactions that are *included in a block*.
    promises.push(
      repository
        .search({ ...baseQuery, group: TransactionGroup.Confirmed })
        .toPromise(),
    );

    // we permit to include **unconfirmed** transactions
    // note that unconfirmed transaction are always "recent".
    if (true === includeUnconfirmed) {
      promises.push(
        repository
          .search({
            ...baseQuery,
            pageNumber: 1,
            group: TransactionGroup.Unconfirmed,
          })
          .toPromise(),
      );
    }

    // we permit to include **partial** transactions (aggregate bonded)
    // note that partial transaction are always "recent".
    if (true === includePartial) {
      promises.push(
        repository
          .search({
            ...baseQuery,
            pageNumber: 1,
            group: TransactionGroup.Partial,
          })
          .toPromise(),
      );
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
    return transaction.signer.address.plain();
  }

  /**
   * Helper method to extract the recipient address of a `Transaction`
   * instance.
   *
   * @param {Transaction} transaction
   * @returns {string}
   */
  protected extractRecipientAddress(transaction: SdkTransaction): string {
    const transfer = transaction as TransferTransaction;
    return transfer.recipientAddress.plain();
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
      : (transaction.transactionInfo as AggregateTransactionInfo).aggregateHash;
  }

  /**
   * Helper method to extract the transaction type as defined by the
   * dApps Framework.
   * <br /><br />
   * Note that in the first draft of the framework, the only transaction
   * type that is effectively used is `"transfer"` because all operations
   * are executed using *transfer transactions*.
   *
   * @param {Transaction} transaction
   * @returns {string}
   */
  protected extractTransactionType(transaction: SdkTransaction): string {
    return TransactionTypes.getTransactionType(transaction.type);
  }

  /**
   * Helper method to extract the signature of a `Transaction` instance.
   *
   * @param {Transaction} transaction
   * @returns {string}
   */
  protected extractTransactionSignature(transaction: SdkTransaction): string {
    return transaction.signature;
  }

  /**
   * Helper method to extract the body of a `Transaction` instance. Note
   * that the binary payload of the transaction is **reduced** in that the
   * transaction header (56 bytes) is dropped.
   * <br /><br />
   * The transaction header can always be re-created using the other fields
   * present in the {@link Transaction} document.
   *
   * @param {Transaction} transaction
   * @returns {string}
   */
  protected extractTransactionBody(transaction: SdkTransaction): string {
    // serializes transaction to get hexadecimal payload
    const payload: string = transaction.serialize();

    // This will permit to save 128 bytes of space for each
    // contract operation.
    // Note that this implementation requires also
    // a *transaction parser* that re-build transactions
    // following transaction header applies here:
    // size | r1 | sig | pub | r2 | ver | net | type | fee | dl
    //   4b | 4b | 64b | 32b | 4b |  1b |  1b |   2b |  8b | 8b
    // --> we are dropping 128 bytes (256 hex characters) as the header
    // and we return only the remaining body after
    return payload.substring(256);
  }

  /**
   * Helper method to extract the confirmation block number of a
   * `Transaction` instance. This is necessary to track the time
   * at which a transaction was first included in a block, and
   * thereby *confirmed on the dHealth Network*.
   *
   * @param {Transaction} transaction
   * @returns {number}
   */
  protected extractTransactionBlock(transaction: SdkTransaction): number {
    return transaction.transactionInfo.height.compact();
  }

  /**
   * Helper method to extract the message payload of a `Transaction`
   * instance.
   *
   * @param {Transaction} transaction
   * @returns {string}
   */
  protected extractTransactionMessage(transaction: SdkTransaction): string {
    // shortcuts
    const transfer = transaction as TransferTransaction;
    const message = transfer.message;

    // only if message is present and filled
    if (undefined !== message && undefined !== message.payload) {
      return message.payload.length > 0 ? message.payload : null;
    }

    // db field transactionMessage is nullable
    return null;
  }

  /**
   * Helper method to extract the assets attached in a `Transaction`
   * instance.
   *
   * @param {Transaction} transaction
   * @returns {string}
   */
  protected extractAssets(transaction: SdkTransaction): ObjectLiteral[] {
    // @todo should check for possible "namespace id" and replace
    const transfer = transaction as TransferTransaction;
    return transfer.mosaics
      .filter((m) => !m.amount.equals(UInt64.fromUint(0)))
      .map(
        (m) =>
          ({
            mosaicId: AssetsService.formatMosaicId(m.id.toHex()),
            amount: m.amount.compact(),
          } as ObjectLiteral),
      );
  }
}
