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
import { InjectModel } from "@nestjs/mongoose";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { PipelineStage } from "mongoose";

// internal dependencies
// common scope
import { LogService } from "../../../common/services/LogService";
import { QueryService } from "../../../common/services/QueryService";
import { StateService } from "../../../common/services/StateService";

// users scope
import {
  Activity,
  ActivityDocument,
  ActivityModel,
} from "../../../users/models/ActivitySchema";

// statistics scope
import {
  StatisticsCommand,
  StatisticsCommandOptions,
} from "../StatisticsCommand";
import {
  Statistics,
  StatisticsDocument,
  StatisticsModel,
  StatisticsQuery,
} from "../../models/StatisticsSchema";
import { UserAggregationStateData } from "../../models/UserAggregationStateData";
import { StatisticsService } from "../../services/StatisticsService";

/**
 * @class UserAggregation
 * @description The implementation for user statistics aggregation
 * scheduler. Contains source code for the execution logic of a
 * command with name: `Statistics:UserAggregation`.
 *
 * @todo current aggregation does not use dates to filter *relevant* data
 * @todo the implementation should make use of *previous* aggregation too
 * @since v0.5.0
 */
@Injectable()
export class UserAggregation extends StatisticsCommand {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {StatisticsModel}     model
   * @param {ActivityModel}       activityModel
   * @param {SchedulerRegistry}   schedulerRegistry
   * @param {StateService}        stateService
   * @param {QueryService}        queryService
   */
  constructor(
    @InjectModel(Statistics.name)
    protected readonly model: StatisticsModel,
    @InjectModel(Activity.name)
    protected readonly activityModel: ActivityDocument,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly stateService: StateService,
    protected readonly queryService: QueryService<
      ActivityDocument,
      ActivityModel
    >,
    protected readonly statisticsService: StatisticsService,
    protected readonly logService: LogService,
  ) {
    super(logService, stateService);
    this.lastExecutedAt = new Date().valueOf();
  }
  /**
   * The type of statistics to be saved to the database.
   * Should be defaulted to `"user"`.
   *
   * @access private
   * @readonly
   * @var {string}
   */
  private readonly TYPE: string = "user";

  /**
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

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
  protected getStateData(): UserAggregationStateData {
    return {
      lastExecutedAt: this.lastExecutedAt,
    } as UserAggregationStateData;
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
    return `UserAggregation`;
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
    return `UserAggregation`;
  }

  /**
   * The period format i.e. `"D"`, `"W"` or `"M"`.
   * This field will be overriden by sub-classes during initialization.
   *
   * @access protected
   * @var {string}
   */
  protected periodFormat = "D";

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `processor` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--collection` option.
   * <br /><br />
   * This scheduler is registered to run **every ten minutes**.
   * <br /><br />
   * Note that a *manual* execution is also triggered such that
   * this aggregation runs directly upon nestjs registration of
   * the scheduler.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("0 */10 * * * *", { name: "statistics:cronjobs:user-aggregation" })
  public async runAsScheduler(): Promise<void> {
    // setup debug logger
    this.logger.setModule(`${this.scope}/${this.command}`);

    // display starting moment information *also* in debug mode
    this.debugLog(`Starting user aggregation type: ${this.periodFormat}`);

    // executes the actual command logic (this will call aggregate())
    await this.run([this.TYPE], {
      debug: true,
      quiet: false,
    });
  }

  /**
   * This method implements the statistics logic for this command
   * that will aggregate relevant users.
   *
   * @access public
   * @async
   * @param   {ProcessOperationsCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async aggregate(options?: StatisticsCommandOptions): Promise<void> {
    // keep track of last execution
    this.lastExecutedAt = new Date().valueOf();

    // get the latest execution details
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
        `Last user aggregation executed at: "${lastTimeExecutedAt}"`,
      );
    }

    // prepare aggregation operations
    const aggregateQuery = this.createAggregationQuery();

    // query statistics aggregation
    const results = await this.queryService.aggregate(
      aggregateQuery,
      this.activityModel,
    );

    // debug information about upcoming database operations
    if (options.debug && !options.quiet && results.length > 0) {
      this.debugLog(`Found ${results.length} aggregation subjects`);
    }
    // also display debug message when no operations are executed
    else if (options.debug && !options.quiet && !results.length) {
      this.debugLog(`No aggregation subjects found`);
    }

    // period is in daily format
    const periodFormat = this.periodFormat;
    const period = this.getNextPeriod(new Date());

    // for each aggregation document, we now create a statistics
    // document and attach the data in its `data` field
    for (const result of results) {
      // create a new user statistics document
      const address = result._id; // see createAggregationQuery

      // if we already have a statistics document for this period
      // we must fetch it from database to get all field values
      const document = await this.statisticsService.findOne(
        new StatisticsQuery({
          address,
          period,
          periodFormat,
          type: this.TYPE,
        } as StatisticsDocument),
      );

      // find one and create new (if not exists) or update (if exists)
      await this.statisticsService.createOrUpdate(
        new StatisticsQuery({
          address,
          period,
          type: this.TYPE,
        } as StatisticsDocument),
        {
          periodFormat,
          amount: result.totalAssetsAmount,
          data: {
            totalEarned: result.totalAssetsAmount,
            totalPracticedMinutes: Math.ceil(result.totalSecondsPracticed / 60),
            // merge with previous entry if available (topActivities)
            ...(document ? document.data : {}),
          },
        },
      );
    }
  }

  /**
   * Method to generate period string representation of today's search range.
   * The result string is in format: `{year}{month}{day}`.
   *
   * @access protected
   * @param {Date} dateNow The current {@link Date} instance that is passed from {@link LeaderboardAggregation}.
   * @returns {string} The period string representation of today's search range.
   */
  protected getNextPeriod(dateNow: Date): string {
    // format: `{year}{month}{day}`
    return (
      `${dateNow.getUTCFullYear()}` +
      `${("0" + (dateNow.getUTCMonth() + 1)).slice(-2)}` +
      `${("0" + dateNow.getUTCDate()).slice(-2)}`
    );
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
  private createAggregationQuery(): PipelineStage[] {
    return [
      {
        $match: { address: { $exists: true } },
      },
      {
        $group: {
          _id: "$address",
          totalAssetsAmount: {
            // array of array
            $sum: { $sum: "$activityAssets.amount" },
          },
          totalSecondsPracticed: {
            $sum: "$activityData.elapsedTime",
          },
        },
      },
      {
        // sort by amount DESC
        $sort: {
          amount: -1,
        },
      },
    ];
  }
}
