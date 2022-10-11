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
import { ConfigService } from "@nestjs/config";
import { NetworkService } from "../../../common/services/NetworkService";
import { StateDocument, StateQuery } from "../../../common/models/StateSchema";
import { BlocksService } from "../../../discovery/services/BlocksService";

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
   * @param {ConfigService}   configService
   * @param {StateService}   stateService
   * @param {NetworkService}  networkService
   * @param {BlocksService}  blocksService
   */
  constructor(
    @InjectModel(Block.name) protected readonly model: BlockModel,
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly blocksService: BlocksService,
  ) {
    // required super call
    super(stateService);

    // sets default state data
    this.lastPageNumber = 1;
    this.lastExecutedAt = new Date().valueOf();
    this.totalNumberOfBlocks = 0;
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

  public async discover(options?: DiscoveryCommandOptions): Promise<void> {
    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog("Starting blocks discovery");
    }

    // get the latest blocks page number
    if (
      !!this.state &&
      !!this.state.data &&
      "lastPageNumber" in this.state.data
    ) {
      this.lastPageNumber = this.state.data.lastPageNumber;
    }

    // check for the total number of blocks
    const blocksState = await this.stateService.findOne(
      new StateQuery({
        name: "discovery:DiscoverBlocks",
      } as StateDocument),
    );

    this.totalNumberOfBlocks =
      !!blocksState && "totalNumberOfBlocks" in blocksState.data
        ? blocksState.data.totalNumberOfBlocks
        : 0;

    // if we reached the end of blocks, we want
    // to continue *only* with recent blocks in
    // the next runs of blocks discovery
    if (
      this.totalNumberOfBlocks > 0 &&
      this.lastPageNumber * this.usePageSize > this.totalNumberOfBlocks
    ) {
      this.lastPageNumber =
        Math.floor(this.totalNumberOfBlocks / this.usePageSize) + 1;
    }

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Last blocks discovery ended with page: "${this.lastPageNumber}"`,
      );
    }

    // get the block repository from network service
    const blockRepository = this.networkService.blockRepository;

    let nSkipped = 0;

    // (1) each round queries a page of 100 blocks *from the blockchain*
    // and save relevant information that are of said blocks
    for (
      let i = this.lastPageNumber, max = this.lastPageNumber + 5;
      i < max;
      i++
    ) {
      // fetches blocks *from the database* (mongo)
      const blocks: Page<BlockInfo> = await blockRepository
        .search({
          orderBy: BlockOrderBy.Height,
          order: Order.Asc,
          pageNumber: this.lastPageNumber,
          pageSize: this.usePageSize,
        })
        .toPromise();

      // if data is empty, break out of loop
      // otherwise increase last page number
      if (blocks.data.length < 1) {
        break;
      } else {
        this.lastPageNumber++;
      }

      for (const blockEntry of blocks.data) {
        // retrieve existence information
        const documentExists: boolean = await this.blocksService.exists(
          new BlockQuery({
            height: blockEntry.height.compact(),
          } as BlockDocument),
        );

        // skip update for known assets
        if (true === documentExists) {
          nSkipped++;
          continue;
        }

        // store the discovered asset in `assets`
        await this.model.create({
          height: blockEntry.height.compact(),
          harvester: blockEntry.signer.address.plain(),
          timestamp: blockEntry.timestamp,
          countTransactions: blockEntry.totalTransactionsCount,
        });

        // Update total number of blocks discovered
        this.totalNumberOfBlocks++;
      }
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
}
