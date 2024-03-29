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
import { SchedulerRegistry } from "@nestjs/schedule";
import { PipelineStage } from "mongoose";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";

// internal dependencies
// common scope
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { QueryService } from "../../../common/services/QueryService";
import { LogService } from "../../../common/services/LogService";

// discovery scope
import {
  Asset,
  AssetDocument,
  AssetModel,
} from "../../../discovery/models/AssetSchema";

// users scope
import { Activity, ActivityModel } from "../../../users/models/ActivitySchema";

// statistics scope
import { Statistics, StatisticsModel } from "../../models/StatisticsSchema";
import {
  StatisticsCommand,
  StatisticsCommandOptions,
} from "../StatisticsCommand";
import {
  LeaderboardConfig,
  ScoreSchedulerConfig,
} from "../../../common/models/StatisticsConfig";
import { LeaderboardAggregationStateData } from "../../models/LeaderboardAggregationStateData";

/**
 * @class LeaderboardAggregation
 * @description The abstract implementation for the score aggregation
 * scheduler. Contains source code for the execution logic of a
 * command with name: `statistics:LeaderboardAggregation/(D|M|W)`.
 *
 * @since v0.3.2
 */
@Injectable()
export abstract class LeaderboardAggregation extends StatisticsCommand {
  /**
   * The type of statistics to be saved to the database.
   * Should be defaulted to `"leaderboard"`.
   *
   * @access private
   * @readonly
   * @var {string}
   */
  private readonly TYPE: string = "leaderboard";

  /**
   * The period format i.e. `"D"`, `"W"` or `"M"`.
   * This field will be overriden by sub-classes during initialization.
   *
   * @access protected
   * @var {string}
   */
  protected periodFormat: string;

  /**
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param   {StatisticsModel}     model
   * @param   {AssetModel}          assetModel
   * @param   {ActivityModel}       activityModel
   * @param   {SchedulerRegistry}   schedulerRegistry
   * @param   {StateService}        stateService
   * @param   {QueryService}        queriesService
   * @param   {NetworkService}      networkService
   * @param   {ConfigService}       configService
   */
  constructor(
    @InjectModel(Statistics.name)
    protected readonly model: StatisticsModel,
    @InjectModel(Asset.name)
    protected readonly assetModel: AssetModel,
    @InjectModel(Activity.name)
    protected readonly activityModel: ActivityModel,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly stateService: StateService,
    protected readonly queriesService: QueryService<AssetDocument, AssetModel>,
    protected readonly networkService: NetworkService,
    protected readonly configService: ConfigService,
    protected readonly logService: LogService,
  ) {
    super(logService, stateService);
    this.lastExecutedAt = new Date().valueOf();
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   * <br /><br />
   * This property is required through the extension of
   * {@link StatisticsCommand}.
   *
   * @see StatisticsCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `LeaderboardAggregation/${this.periodFormat}`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   * <br /><br />
   * This property is required through the extension of
   * {@link StatisticsCommand}.
   *
   * @see StatisticsCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `LeaderboardAggregation/(D|W|M)`;
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
  protected getStateData(): LeaderboardAggregationStateData {
    return {
      lastExecutedAt: this.lastExecutedAt,
    } as LeaderboardAggregationStateData;
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `statistics` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--collection` option.
   * <br /><br />
   * This method must be implemented in sub-classes with a proper
   * cron expression value.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @returns {void}
   */
  public abstract runAsScheduler(): void;

  /**
   * This method is the **second entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `statistics` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--collection` option.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @returns {Promise<void>}
   */
  public async runScheduler(): Promise<void> {
    // prepares execution logger
    this.logger.setModule(`${this.scope}/${this.command}`);

    // display starting moment information *also* in debug mode
    this.debugLog(
      `Starting leaderboard aggregation type: ${this.periodFormat}`,
    );

    // executes the actual command logic (this will call aggregate())
    await this.run([this.periodFormat], {
      debug: false,
    });
  }

  /**
   * This method implements the statistics logic for this command
   * that will aggregate relevant *subjects*. Subjects in this command
   * are provided in config as **collection** and ** fields** that are
   * included in transfer transactions on dHealth Network.
   * <br /><br />
   * As of the time of writing, this scheduler currently supports the
   * following collections:
   * - `assets`: The asset that an account has received as rewards.
   * <br /><br />
   * As of the time of writing, this scheduler currently supports the
   * following fields:
   * - `amount`: The amount of an asset that an account received as rewards,
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {ProcessOperationsCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async aggregate(options?: StatisticsCommandOptions): Promise<void> {
    // keep track of last execution
    this.lastExecutedAt = new Date().valueOf();

    // get the latest blocks page number
    let lastTimeExecutedAt;
    if (
      !!this.state &&
      !!this.state.data &&
      "lastExecutedAt" in this.state.data
    ) {
      lastTimeExecutedAt = this.state.data.lastExecutedAt;
    }

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Last leaderboard aggregation executed at: "${lastTimeExecutedAt}"`,
      );
    }

    // get query range timestamps
    const dateNow = new Date();
    const { startDate, endDate } = this.createQueryDates(dateNow);

    // create aggregation query to get all `assets` in the time range
    const aggregateQuery = this.createAggregationQuery(startDate, endDate);

    // Get model dynamically from config
    const queryModel =
      this.config.collection === "assets"
        ? this.assetModel
        : this.activityModel;

    // query leaderboard of today
    const results = await this.queriesService.aggregate(
      aggregateQuery,
      queryModel,
    );

    // debug information about upcoming database operations
    if (options.debug && !options.quiet && results.length > 0) {
      this.debugLog(`Found ${results.length} leaderboard subjects`);
    }
    // also display debug message when no operations are executed
    else if (options.debug && !options.quiet && !results.length) {
      this.debugLog(`No leaderboard subjects found`);
    }

    // for each asset in result
    const period = this.getNextPeriod(dateNow);
    let position = 1;
    for (const result of results) {
      // create a new leaderboard object
      const leaderboardEntry = {
        type: this.TYPE,
        periodFormat: this.periodFormat,
        period,
        address: result._id, // L392
        position,
        amount: result.amount,
      };
      position++;
      // find one and create new (if not exists) or update (if exists)
      await this.model.findOneAndUpdate(
        {
          type: this.TYPE,
          period: period,
          address: leaderboardEntry.address,
        },
        leaderboardEntry,
        { upsert: true },
      );
    }
  }

  /**
   * An abstract method to determine the range of time to perform
   * aggregation search for relevant statistics.
   * This method **has** to be overidden by sub-classes.
   *
   * @access protected
   * @abstract
   * @param {Date} dateNow
   * @returns {startDate: Date, endDate: Date}
   */
  protected abstract createQueryDates(dateNow: Date): {
    startDate: Date;
    endDate: Date;
  };

  /**
   * Abstract method to generate period string for a date instance.
   * Sub-classes **have** to override this method to return the correct
   * period string.
   *
   * @access protected
   * @abstract
   * @param {Date} date
   * @returns {string}
   */
  protected abstract getNextPeriod(date: Date): string;

  /**
   * Abstract method to generate the *previous* period string for a date
   * instance.
   *
   * @access protected
   * @abstract
   * @param {Date} date
   * @returns {string}
   */
  protected abstract getPrevPeriod(date: Date): string;

  /**
   * Method to get the score scheduler config values for this
   * leaderboard aggregation's period format.
   *
   * @access protected
   * @returns {ScoreSchedulerConfig}
   */
  protected get config(): ScoreSchedulerConfig {
    // read from `statistics` configuration resource
    const leaderboardConfig = this.configService.get<LeaderboardConfig>(
      "statistics.leaderboards",
    );

    // discover leaderboard config keys
    const keys: string[] = Object.keys(leaderboardConfig);

    // find the correct leaderboard config
    const schedulerConfig: string = keys.find(
      (c: string) => leaderboardConfig[c].type === this.periodFormat,
    );

    // disallow using unspecified leaderboards
    if (undefined === schedulerConfig) {
      throw new Error(
        `Configuration for aggregation of type ` +
          `${this.periodFormat} is missing.`,
      );
    }

    // returns an individual leaders config
    return leaderboardConfig[schedulerConfig];
  }

  /**
   * Method to create aggregation query to calculate statistics information
   * based on config's `collection` and `fields` values.
   *
   * @access private
   * @param startDate
   * @param endDate
   * @returns {PipelineStage[]}
   */
  private createAggregationQuery(
    startDate: Date,
    endDate: Date,
  ): PipelineStage[] {
    // @todo the fields configuration may need different aggregation
    // @todo practices as for example now we aggregate a column in a
    // @todo multi-object array and therefor require a sub-sum routine
    const fields = this.config.fields;
    return [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
          "activityData.isManual": {
            $eq: false,
          },
        },
      },
      {
        $group: {
          _id: "$address",
          amount: {
            $sum: {
              $sum: `$${fields[0]}`,
            },
          },
        },
      },
      { $sort: { amount: -1 } },
    ];
  }
}
