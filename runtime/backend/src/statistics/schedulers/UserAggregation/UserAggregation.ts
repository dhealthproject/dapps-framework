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
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { PipelineStage } from "mongoose";

// internal dependencies
import {
  StatisticsCommand,
  StatisticsCommandOptions,
} from "../StatisticsCommand";
import { StateService } from "../../../common/services/StateService";
import { UserAggregationStateData } from "../../models/UserAggregationStateData";
import { QueryService } from "@/classes";
import { ActivityModel } from "@/classes";
import { ActivityDocument } from "../../../processor/models/ActivitySchema";
import { StatisticsModel } from "../../models/StatisticsSchema";

@Injectable()
export class UserAggregation extends StatisticsCommand {
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
    // protected readonly model: StatisticsModel,
    // protected readonly assetModel: AssetDocument,
    protected readonly activityModel: ActivityDocument,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly model: StatisticsModel,
    protected readonly stateService: StateService,
    protected readonly queriesService: QueryService<
      ActivityDocument,
      ActivityModel
    >, // protected readonly networkService: NetworkService, // protected readonly configService: ConfigService,
  ) {
    super(stateService);
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
  protected periodFormat: string;

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
  @Cron("*/5 * * * * *", { name: "statistics:cronjobs:user-aggregation" })
  public async runAsScheduler(): Promise<void> {
    // setup debug logger
    this.logger = new Logger(
      `${this.scope}/${this.command}`, // includes /(D|M|W)
    );

    // display starting moment information in debug mode
    this.debugLog(`Starting user aggregation type: ${this.TYPE}`);

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
    // get query range timestamps
    const dateNow = new Date();
    const { startDate, endDate } = this.createQueryDates(dateNow);

    const aggregateQuery = this.createAggregationQuery(startDate, endDate);

    const queryModel = this.activityModel;

    // query activities of today
    const results = await this.queriesService.aggregate(
      aggregateQuery,
      queryModel,
    );

    // debug information about upcoming database operations
    if (options.debug && !options.quiet && results.length > 0) {
      this.debugLog(`Found ${results.length} activity subjects`);
    }
    // also display debug message when no operations are executed
    else if (options.debug && !options.quiet && !results.length) {
      this.debugLog(`No activity subjects found`);
    }

    // for each asset in result
    const period = this.generatePeriod(dateNow);
    let position = 1;
    for (const result of results) {
      // create a new leaderboard object
      const userEntry = {
        type: this.TYPE,
        periodFormat: this.periodFormat,
        period,
        address: result._id, // L392
        position,
        amount: result.activityAssets.amount,
        sport: result.activityData.sport,
        practicedMinutes: result.activityData.elapsedTime,
      };
      position++;
      // find one and create new (if not exists) or update (if exists)
      await this.model.createOrUpdate(
        {
          type: this.TYPE,
          period: period,
          address: userEntry.address,
        },
        userEntry,
        { upsert: true },
      );
    }
  }

  /**
   * Method to generate period string representation of this week's search range.
   * The result string is in format: `"{year}{month}-{week-of-month}"`.
   *
   * @access protected
   * @param {Date} dateNow The current {@link Date} instance that is provided in {@link LeaderboardAggregation}.
   * @returns {string} The period string representation of today's search range.
   */
  protected generatePeriod(dateNow: Date): string {
    const d = dateNow.getUTCDate();
    const testDate = new Date(
      dateNow.getUTCFullYear(),
      dateNow.getUTCMonth(),
      dateNow.getUTCDate(),
    );
    testDate.setDate(d - ((testDate.getUTCDay() + 6) % 7)); // adjust date to previous Monday
    const week = Math.ceil(testDate.getUTCDate() / 7); // return week number of the month
    let month = dateNow.getUTCMonth() + 1;
    let year = dateNow.getUTCFullYear();
    const weekFromPreviousMonth = week >= 3 && d <= 7;
    if (weekFromPreviousMonth) {
      month = month -= 1;
      if (month === 0) {
        month = 12;
        year = dateNow.getUTCFullYear() - 1;
      }
    }
    // format: `{year}{month}-{week-of-month}`
    return `${year}${("0" + month).slice(-2)}-${("0" + week).slice(-2)}`;
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
  protected createQueryDates(dateNow: Date): {
    startDate: Date;
    endDate: Date;
  } {
    const startDate = new Date(
      Date.UTC(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), 1),
    );
    const endDate = new Date(
      Date.UTC(dateNow.getUTCFullYear(), dateNow.getUTCMonth() + 1, 1),
    );
    return { startDate, endDate };
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
    const scoreFields = ["activityAssets", "activityData"];
    const group: Record<string, any> = {
      _id: "$userAddress",
    };
    // this.queryService.createOrUpdate()
    scoreFields.forEach((field) => {
      group[field] = { $sum: `$${field}` };
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
    ];
  }
}
