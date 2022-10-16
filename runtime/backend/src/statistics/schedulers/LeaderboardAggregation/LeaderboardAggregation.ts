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
import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { PipelineStage } from "mongoose";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import {
  StatisticsCommand,
  StatisticsCommandOptions,
} from "../StatisticsCommand";
import { QueryService } from "../../../common/services/QueryService";
import {
  AssetDocument,
  AssetModel,
} from "../../../discovery/models/AssetSchema";
import { NetworkService } from "../../../common/services/NetworkService";
import { StatisticsModel } from "../../models/StatisticsSchema";
import {
  LeaderboardConfig,
  ScoreSchedulerConfig,
} from "../../../common/models/StatisticsConfig";
import { ActivityDocument } from "../../../processor/models/ActivitySchema";
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
   * @param { SchedulerRegistry } schedulerRegistry
   * @param { StateService } stateService
   * @param { QueryService } queriesService
   * @param { NetworkService } networkService
   * @param { ConfigService } configService
   */
  constructor(
    protected readonly model: StatisticsModel,
    protected readonly assetModel: AssetDocument,
    protected readonly activityModel: ActivityDocument,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly stateService: StateService,
    protected readonly queriesService: QueryService<AssetDocument, AssetModel>,
    protected readonly networkService: NetworkService,
    protected readonly configService: ConfigService,
  ) {
    super(stateService);
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
   * Method to create and run a cronjob automatically. Subclasses will
   * be **required** to call this method in their constructor with the
   * desired cron expression.
   *
   * @access protected
   * @param   {string} cronExpression
   * @returns {void}
   */
  protected addCronJob(cronExpression: string): void {
    // initialize a dynamic cronjob
    const job = new CronJob(
      cronExpression, // cronTime
      this.runAsScheduler.bind(this), // onTick
      undefined, // empty onComplete
      false, // "startNow" (done with L183)
      undefined, // timeZone
      undefined, // empty resolves to default context
      true, // "runOnInit"
    );

    // also register in nestjs schedulers
    this.schedulerRegistry.addCronJob(
      `statistics:cronjobs:leaderboards:${this.periodFormat}`,
      job,
    );

    // also, always *schedule* when initialized
    job.start();
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `processor` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--collection` option.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  public async runAsScheduler(): Promise<void> {
    // setup debug logger
    this.logger = new Logger(
      `${this.scope}/${this.command}`, // includes /(D|M|W)
    );

    // display starting moment information in debug mode
    this.debugLog(
      `Starting leaderboard aggregation type: ${this.periodFormat}`,
    );

    // executes the actual command logic (this will call aggregate())
    await this.run([this.periodFormat], {
      debug: true,
      quiet: false,
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

    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Starting leaderboard aggregation type: ${this.periodFormat}`,
      );
    }

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
    const period = this.generatePeriod(dateNow);
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
  protected abstract generatePeriod(date: Date): string;

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
    const scoreFields = this.config.fields;
    const group: Record<string, any> = {
      _id: "$userAddress",
    };
    const sort: Record<string, any> = {};
    scoreFields.forEach((field) => {
      group[field] = { $sum: `$${field}` };
      sort[`${field}`] = -1;
    });
    return [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: group,
      },
      { $sort: sort },
    ];
  }
}
