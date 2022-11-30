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
import { Cron } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";

// statistics scope
import {
  StatisticsCommand,
  StatisticsCommandOptions,
} from "../StatisticsCommand";
// common scope
import { LogService } from "../../../common/services/LogService";
import { QueryService } from "../../../common/services/QueryService";

// statistics scope
import { StatisticsService } from "../../services/StatisticsService";
import { StateService } from "../../../common/services/StateService";

// processor scope
import {
  Activity,
  ActivityDocument,
  ActivityModel,
} from "../../../processor/models/ActivitySchema";
import {
  StatisticsDocument,
  StatisticsQuery,
} from "../../models/StatisticsSchema";
import { PipelineStage } from "mongoose";

@Injectable()
export class UserTopActivities extends StatisticsCommand {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {logService}          LogService
   * @param {ActivityModel}       activityModel
   * @param {StateService}        stateService
   * @param {QueryService}        queryService
   */
  constructor(
    protected readonly logService: LogService,
    protected readonly stateService: StateService,
    protected readonly statisticsService: StatisticsService,
    @InjectModel(Activity.name)
    protected readonly activityModel: ActivityDocument,
    protected readonly queryService: QueryService<
      ActivityDocument,
      ActivityModel
    >,
  ) {
    super(logService, stateService);
    this.lastExecutedAt = new Date().valueOf();
  }

  /**
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

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
    return `UserTopActivitiesAggregation`;
  }

  public async aggregate(options?: StatisticsCommandOptions): Promise<void> {
    const aggregationQuery = await this.createAggregationQuery();

    // query statistics aggregation
    const results = await this.queryService.aggregate(
      aggregationQuery,
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

    for (const result of results) {
      const address = result._id; // L278 set userAddress as _id

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
            topActivities: result.sport,
          },
        },
      );
    }
  }

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
  // "0 */10 * * * *"
  @Cron("0 */10 * * * *", {
    name: "statistics:cronjobs:user-top-activities",
  })
  public async runAsScheduler(): Promise<void> {
    // setup debug logger
    this.logger.setContext(`${this.scope}/${this.command}`);

    // display starting moment information *also* in debug mode
    this.debugLog(`Starting user aggregation type: ${this.periodFormat}`);

    // executes the actual command logic (this will call aggregate())
    await this.run([this.TYPE], {
      debug: true,
      quiet: false,
    });
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
    return `UserTopActivities`;
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
   * Method to create aggregation query to calculate top activities.
   *
   * @access private
   */
  private async createAggregationQuery(): Promise<PipelineStage[]> {
    return [{ $group: { _id: "$activityData.sport", count: { $sum: 1 } } }];
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
}
