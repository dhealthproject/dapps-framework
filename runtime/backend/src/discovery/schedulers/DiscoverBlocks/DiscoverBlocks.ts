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
import { BlockInfo, BlockOrderBy, Order, Page } from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import {
  Block,
  BlockDocument,
  BlockModel,
  BlockQuery,
} from "../../../discovery/models/BlockSchema";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import { BlockDiscoveryStateData } from "../../models/BlockDiscoveryStateData";
import { NetworkService } from "../../../common/services/NetworkService";
import { StateDocument, StateQuery } from "../../../common/models/StateSchema";
import { BlocksService } from "../../../discovery/services/BlocksService";
import { LogService } from "../../../common/services/LogService";
import { TransactionsService } from "../../../discovery/services/TransactionsService";
import {
  TransactionDocument,
  TransactionQuery,
} from "../../../common/models/TransactionSchema";
import { DappHelper } from "../../../common/concerns/DappHelper";

/**
 * @class DiscoverBlocks
 * @description The implementation for the block discovery
 * scheduler. Contains source code for the execution logic of a
 * command with name: `discovery:DiscoverBlocks`.
 *
 * @since v0.3.2
 */
@Injectable()
export class DiscoverBlocks extends DiscoveryCommand {
  /**
   * Memory store for *all* blocks processed in one run of this
   * command.
   *
   * @access protected
   * @var {SdkTransaction[]}
   */
  protected blocks: BlockInfo[] = [];

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
   * Memory store for the total number of blocks. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private totalNumberOfBlocks: number;

  /**
   * Memory store for the last processed range of blocks. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastRange: number;

  /**
   * Configuration field for the page size to be read. This is used
   * to determine how many blocks are queried per page from
   * the database.
   *
   * @access private
   * @var {number}
   */
  private usePageSize = 100;

  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {LogService}   logger
   * @param {ConfigService}   configService
   * @param {StateService}   stateService
   * @param {NetworkService}  networkService
   * @param {BlocksService}  blocksService
   * @param {LogService}  logService
   * @param {TransactionsService}  transactionsService
   * @param {DappHelper}  dappHelper
   */
  constructor(
    @InjectModel(Block.name) protected readonly model: BlockModel,
    protected readonly logger: LogService,
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly blocksService: BlocksService,
    protected readonly logService: LogService,
    protected readonly transactionsService: TransactionsService,
    protected readonly dappHelper: DappHelper,
  ) {
    // required super call
    super(logService, stateService);
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
    return `DiscoverBlocks`;
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
    return `${this.command}`;
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
  protected getStateData(): BlockDiscoveryStateData {
    return {
      totalNumberOfBlocks: this.totalNumberOfBlocks,
      lastRange: this.lastRange,
      lastPageNumber: this.lastPageNumber,
      lastExecutedAt: this.lastExecutedAt,
    } as BlockDiscoveryStateData;
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `discovery` scope is enabled.
   * <br /><br />
   * <br /><br />
   * This scheduler is registered to run **every 2 minute**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("0 */2 * * * *", { name: "discovery:cronjobs:blocks" })
  public async runAsScheduler(): Promise<void> {
    // keep track of last execution
    this.lastExecutedAt = new Date().valueOf();

    // executes the actual command logic (this will call discover())
    await super.run([], {
      debug: true,
    } as DiscoveryCommandOptions);
  }

  /**
   * This method implements the discovery logic for this command
   * that will find relevant *subjects*. Subjects in this command
   * are **blocks** of which are included in transactions.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {DiscoveryCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async discover(options?: DiscoveryCommandOptions): Promise<void> {
    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog("Starting blocks discovery");
    }

    // synchronize this run's state with the persisted state
    // create new with default values if not existed
    await this.synchronizeStateData();

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Last blocks discovery ended with page: "${this.lastPageNumber}"`,
      );
    }

    // get the block repository from network service
    const blockRepository = this.networkService.blockRepository;

    // number of skipped blocks
    let nSkipped = 0;

    // in case of last run queried last page, we want to query again to check
    // if there's new item added. In case of normal run, we also want to query
    // again to get block heights and ranges from the transactions
    const transactions = await this.transactionsService.find(
      new TransactionQuery({} as TransactionDocument, {
        pageNumber: this.lastPageNumber,
        pageSize: this.usePageSize,
        sort: "creationBlock",
        order: "asc",
      }),
    );
    let currentBlockHeights = transactions.data.map(
      (transaction: TransactionDocument) => transaction.creationBlock,
    );
    let currentRanges = this.createRanges(currentBlockHeights);

    // if the last run result was not the last page, and we processed all of them,
    // we continue discovering blocks with the next page of transactions.
    if (
      currentRanges.length === 0 ||
      (currentRanges.indexOf(this.lastRange) === currentRanges.length - 1 &&
        !transactions.isLastPage())
    ) {
      // query the next page of transactions
      const transactions = await this.transactionsService.find(
        new TransactionQuery({} as TransactionDocument, {
          pageNumber: ++this.lastPageNumber,
          pageSize: this.usePageSize,
          sort: "creationBlock",
          order: "asc",
        }),
      );

      // set currentBlockHeights
      currentBlockHeights = transactions.data.map(
        (transaction: TransactionDocument) => transaction.creationBlock,
      );
      // current ranges to process
      currentRanges = this.createRanges(currentBlockHeights);
    }

    // processes 5 ranges from the current ranges. For each range, send a request
    // to the network node to get information of the blocks within the range
    const blockDocuments: BlockDocument[] = [];
    const pageBlockPromises: Promise<Page<BlockInfo>>[] = [];
    let rangeIndex = currentRanges.includes(this.lastRange)
      ? currentRanges.indexOf(this.lastRange) + 1
      : 0;
    const maxRangeIndex = rangeIndex + 5;
    // processes 5 ranges inside the range list and makes sure the range index
    // is not larger than the range list's length
    for (
      rangeIndex;
      rangeIndex < maxRangeIndex && rangeIndex < currentRanges.length;
      rangeIndex++
    ) {
      // send request to network node
      const pageBlocks: Promise<Page<BlockInfo>> = blockRepository
        .search({
          orderBy: BlockOrderBy.Height,
          offset: currentRanges[rangeIndex].toString(),
          pageSize: 100,
          order: Order.Desc,
          pageNumber: 1,
        })
        .toPromise();
      pageBlockPromises.push(pageBlocks);
    }
    const pageBlocks = (await Promise.all(pageBlockPromises))
      .map((pageBlock: Page<BlockInfo>) => pageBlock.data)
      .flat();
    // processes each block information of the result
    for (const blockInfo of pageBlocks) {
      const blockInfoHeight = blockInfo.height.compact();
      // if the result block is included in current block height list
      // extracted from transactions
      if (currentBlockHeights.includes(blockInfoHeight)) {
        // check if block has already existed in the database
        const blockExists = await this.blocksService.exists(
          new BlockQuery({ height: blockInfoHeight } as BlockDocument),
        );
        // if block exists, continue to the next item
        if (blockExists) {
          nSkipped++;
          continue;
        }
        // if block hasn't existed yet, create a block document from
        // the result blockinfo and add to the batch.
        const blockDocument = new Block(
          blockInfo.height.compact(),
          blockInfo.signer.address.plain(),
          this.dappHelper.getNetworkTimestampFromUInt64(blockInfo.timestamp),
          blockInfo.totalTransactionsCount,
        );
        blockDocuments.push(blockDocument as BlockDocument);
      }
    }
    // set the range back 1 index of the rangeIndex (due to the for loop
    // ending at last index + 1).
    this.lastRange = currentRanges[rangeIndex - 1];
    // save the batch to database if not empty
    if (blockDocuments.length > 0) {
      await this.blocksService.createOrUpdateBatch(blockDocuments);
      this.totalNumberOfBlocks += blockDocuments.length;
      blockDocuments;
    }

    // Display number of skipped block entries
    if (options.debug && !options.quiet) {
      this.debugLog(`Skipped ${nSkipped} block entries that already exist`);
    }

    // a per-command state update is *not* necessary here because
    // the `BaseCommand` class' `run` method automatically updates
    // the per-command state with updated values *after* executing
    // this discovery method.

    // no-return (void)
  }

  /**
   * Synchronize on-memory state of this scheduler with the database persited
   * state.
   * <br /><br />
   * If persisted state doesn't existed, update memory with default
   * values so they can be used to construct a new state which will be saved
   * to the database.
   *
   * @access private
   * @async
   * @returns {Promise<void>}
   */
  private async synchronizeStateData(): Promise<void> {
    // get current block state from db
    const blockState = await this.stateService.findOne(
      new StateQuery({
        name: "discovery:DiscoverBlocks",
      } as StateDocument),
    );
    const { lastPageNumber, lastExecutedAt, totalNumberOfBlocks, lastRange } =
      blockState?.data
        ? // gets state data from db
          blockState.data
        : // sets default state data if persisted state doesn't existed
          {
            lastPageNumber: 1,
            lastExecutedAt: new Date().valueOf(),
            totalNumberOfBlocks: 0,
            lastRange: 0,
          };
    // set in-memory state values for this scheduler
    this.lastPageNumber = lastPageNumber;
    this.lastExecutedAt = lastExecutedAt;
    this.totalNumberOfBlocks = totalNumberOfBlocks;
    this.lastRange = lastRange;
  }

  /**
   * Method to calculate and return the ranges (each range has a size of 100)
   * of the block heights that need to be queried.
   * Each range is a number indicating the last block height of the range.
   * <br /><br />
   * e.g. range has value 100 means the range will be 0-100.
   *
   * @access private
   * @param {number[]} blockHeights The list of block heights to calculate ranges from.
   * @returns {number[]}
   */
  private createRanges(blockHeights: number[]): number[] {
    const ranges: number[] = [];
    blockHeights.forEach((blockHeight: number) => {
      if (ranges.length === 0 || ranges[ranges.length - 1] < blockHeight) {
        ranges.push(blockHeight + 100);
      }
    });
    return ranges;
  }
}
