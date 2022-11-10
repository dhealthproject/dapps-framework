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
import { PublicAccount, NetworkType, Address } from "@dhealth/sdk";

// internal dependencies
import { QueryParameters } from "../../../common/concerns/Queryable";
import { StateService } from "../../../common/services/StateService";
import { StateDocument, StateQuery } from "../../../common/models/StateSchema";
import { NetworkService } from "../../../common/services/NetworkService";
import {
  TransactionDocument,
  TransactionQuery,
} from "../../../common/models/TransactionSchema";
import { TransactionsService } from "../../../discovery/services/TransactionsService";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import {
  Asset,
  AssetDocument,
  AssetModel,
  AssetQuery,
} from "../../../discovery/models/AssetSchema";
import { AssetDTO } from "../../../discovery/models/AssetDTO";
import { AssetsService } from "../../../discovery/services/AssetsService";
import { AssetDiscoveryStateData } from "../../models/AssetDiscoveryStateData";

/**
 * @class DiscoverAssets
 * @description The implementation for the assets discovery
 * scheduler. Contains source code for the execution logic of a
 * command with name: `discovery:DiscoverAssets`.
 *
 * @todo This discovery should use a specific **discovery**
 * @todo config field instead of dappPublicKey
 * @todo (similar to getNextSource in DiscoverTransactions)
 * @since v0.3.2
 */
@Injectable()
export class DiscoverAssets extends DiscoveryCommand {
  /**
   * Memory store of assets that have been discovered as mosaics
   * of transfer transactions issued from the dApp's main account.
   *
   * @access protected
   * @var {AssetDTO[]}
   */
  protected discoveredAssets: AssetDTO[] = [];

  /**
   * Memory store for the last page number being read. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastPageNumber: number;

  /**
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

  /**
   * Configuration field for the page size to be read. This is used
   * to determine how many transactions are queried per page from
   * the database.
   *
   * @access private
   * @var {number}
   */
  private usePageSize = 100;

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
   * @param {AssetModel}   model
   * @param {ConfigService}   configService
   * @param {StateService}   statesService
   * @param {NetworkService}  networkService
   * @param {AssetsService} assetsService
   * @param {TransactionsService} transactionsService
   */
  constructor(
    @InjectModel(Asset.name) protected readonly model: AssetModel,
    protected readonly configService: ConfigService,
    protected readonly statesService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly assetsService: AssetsService,
    protected readonly transactionsService: TransactionsService,
  ) {
    // required super call
    super(statesService);

    // sets default state data
    this.lastPageNumber = 1;
    this.lastExecutedAt = new Date().valueOf();
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "name"
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
    return `DiscoverAssets`;
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
    return `${this.command} [` + `--source "SOURCE-ADDRESS-OR-PUBKEY"` + `]`;
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
  protected getStateData(): AssetDiscoveryStateData {
    return {
      lastPageNumber: this.lastPageNumber,
      lastExecutedAt: this.lastExecutedAt,
    } as AssetDiscoveryStateData;
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
   * This scheduler is registered to run **every 2 minutes**.
   *
   * @todo This discovery should use a specific **discovery** config field instead of dappPublicKey
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("0 */2 * * * *", { name: "discovery:cronjobs:assets" })
  public async runAsScheduler(): Promise<void> {
    // CAUTION:
    // assets discovery cronjob always read the dApp's main account
    const sources = this.configService.get<string[]>("discovery.sources");
    const dappPubKey = this.configService.get<string>("dappPublicKey");
    const networkType = this.configService.get<NetworkType>(
      "network.networkIdentifier",
    );

    const source = await this.getNextSource(sources);
    this.lastUsedAccount = source;

    // creates the discovery source public account
    const publicAcct = PublicAccount.createFromPublicKey(
      dappPubKey,
      networkType,
    );

    // keep track of last execution
    this.lastExecutedAt = new Date().valueOf();

    // executes the actual command logic (this will call discover())
    await super.run([], {
      source,
      debug: true,
    } as DiscoveryCommandOptions);
  }

  /**
   * This method implements the discovery logic for this command
   * that will find relevant *subjects*. Subjects in this command
   * are **assets** that are attached to a transfer transaction
   * and sent to an end-user from the dApp's main account.
   * <br /><br />
   * Discovery is done in 2 steps as described below:
   * - Step 1: Reads a batch of 2000 transactions and discover assets
   * - Step 2: Find or create a corresponding document in `assets`
   *
   * @access public
   * @async
   * @param   {DiscoveryCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async discover(options?: DiscoveryCommandOptions): Promise<void> {
    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog(`Starting assets discovery for source "${options.source}"`);
    }

    // get the latest transactions page number
    if (
      !!this.state &&
      !!this.state.data &&
      "lastPageNumber" in this.state.data
    ) {
      this.lastPageNumber = this.state.data.lastPageNumber ?? 1;
    }

    // check for the total number of transactions
    const transactionsState = await this.stateService.findOne(
      new StateQuery({
        name: "discovery:DiscoverTransactions",
      } as StateDocument),
    );

    const countTransactions =
      !!transactionsState &&
      "totalNumberOfTransactions" in transactionsState.data
        ? transactionsState.data.totalNumberOfTransactions
        : 0;

    // if we reached the end of transactions, we want
    // to continue *only* with recent transactions in
    // the next runs of assets discovery
    if (
      countTransactions > 0 &&
      this.lastPageNumber * this.usePageSize > countTransactions
    ) {
      this.lastPageNumber =
        Math.floor(countTransactions / this.usePageSize) ?? 1;
    }

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Last assets discovery ended with page: "${this.lastPageNumber}"`,
      );
    }

    // (1) each round queries a page of 100 transactions *from the database*
    // and discovers assets that are attached in said transactions
    for (
      let i = this.lastPageNumber, max = this.lastPageNumber + 20;
      i < max;
      i++, this.lastPageNumber++
    ) {
      // fetches transactions *from the database* (mongo)
      const transactions = await this.transactionsService.find(
        new TransactionQuery(
          {} as TransactionDocument, // queries *any* transaction
          {
            pageNumber: i, // in batches of 100 per page
            pageSize: this.usePageSize,
            sort: "createdAt",
            order: "asc",
          } as QueryParameters,
        ),
      );

      // if we don't get anything, stop querying transactions for now
      if (!transactions.data.length) {
        break;
      }

      // proceeds to extracting assets from transactions
      this.discoveredAssets = this.discoveredAssets
        .concat(
          transactions.data
            .map((t: TransactionDocument) =>
              t.transactionAssets.map(
                (a) =>
                  ({
                    assetId: AssetsService.formatMosaicId(a.mosaicId),
                    amount: a.amount,
                    transactionHash: t.transactionHash,
                    userAddress:
                      t.transactionMode === "outgoing"
                        ? t.recipientAddress
                        : t.signerAddress,
                    creationBlock: t.creationBlock,
                  } as AssetDTO),
              ),
            )
            .reduce((p, c) => c, []),
        )
        // and now make this array unique
        .filter(
          (v, i, a) =>
            i === a.findIndex((f) => v.transactionHash === f.transactionHash),
        );

      // stop and restart at same page if the page was not full
      if (transactions.data.length < this.usePageSize) {
        break;
      }
    }

    if (options.debug && !options.quiet) {
      this.debugLog(
        `Found ${this.discoveredAssets.length} new asset entries from transactions`,
      );
    }

    // bail out if no assets could be discovered
    if (!this.discoveredAssets.length) {
      // a per-command state update is *not* necessary here because
      // the `BaseCommand` class' `run` method automatically updates
      // the per-command state with updated values *after* executing
      // this discovery method.

      return; // (void)
    }

    // (2) each round creates or finds 1 `assets` document
    let nSkipped = 0;
    for (let i = 0, max = this.discoveredAssets.length; i < max; i++) {
      const assetEntry: AssetDTO = this.discoveredAssets[i];

      // retrieve existence information
      const documentExists: boolean = await this.assetsService.exists(
        new AssetQuery({
          transactionHash: assetEntry.transactionHash,
          userAddress: assetEntry.userAddress,
          mosaicId: assetEntry.assetId,
        } as AssetDocument),
      );

      // skip update for known assets
      if (true === documentExists) {
        nSkipped++;
        continue;
      }

      // store the discovered asset in `assets`
      await this.model.create({
        transactionHash: assetEntry.transactionHash,
        userAddress: assetEntry.userAddress,
        mosaicId: assetEntry.assetId,
        amount: assetEntry.amount,
        creationBlock: assetEntry.creationBlock,
      });
    }

    if (options.debug && !options.quiet) {
      this.debugLog(`Skipped ${nSkipped} asset entries that already exist`);
    }

    // a per-command state update is *not* necessary here because
    // the `BaseCommand` class' `run` method automatically updates
    // the per-command state with updated values *after* executing
    // this discovery method.

    // no-return (void)
  }

  /**
   * This method will find the *next relevant discovery source*
   * by iterating through the passed {@link sources} and checking
   * individual synchronization state.
   * <br /><br />
   * Accounts that are fully synchronized require *less* requests
   * for recent transactions. Note that a *per-source* state is
   * persisted as well, to keep track of the last page number as
   * well as to keep track of when the runtime reads the latest
   * available page of transactions for said discovery source.
   *
   * @param   {string[]}    sources   The discovery sources public keys and/or addresses.
   * @returns {Promise<string>}       The discovery source *address*.
   */
  protected async getNextSource(sources: string[]): Promise<string> {
    // iterate through all configured discovery sources and
    // fetch transactions. Transactions will first be read
    // for accounts that are *not yet synchronized*.
    let address: Address,
      cursor = 0;
    do {
      address = this.parseSource(sources[cursor++]);

      // fetch **per-source** synchronization state once
      // Caution: do not confuse with `this.state`, this one
      // is internal and synchronizes **per each source**.
      const state = await this.stateService.findOne(
        new StateQuery({
          name: `${this.stateIdentifier}:${address.plain()}`, // "discovery:DiscoverTransactions:%SOURCE%"
        } as StateDocument),
      );

      // if current source is synchronized, move to next
      if (!!state && "sync" in state.data && true === state.data.sync) {
        continue;
      }

      // if no sync state is available, use **current source**
      return address.plain();
    } while (cursor < sources.length);

    // use first with no sync configuration
    if (!this.state || !("lastUsedAccount" in this.state.data)) {
      return sources[0];
    }

    // fully synchronized: switch source every minute
    const lastIndex = sources.findIndex(
      (s) => s === this.state.data.lastUsedAccount,
    );

    // if necessary, loop through back to first source
    if (lastIndex === -1 || lastIndex === sources.length - 1) {
      return sources[0];
    }

    return sources[lastIndex + 1];
  }
}
