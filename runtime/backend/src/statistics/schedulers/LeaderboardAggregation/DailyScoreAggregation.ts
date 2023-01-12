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
import { ConfigService } from "@nestjs/config";
import moment from "moment";

// internal dependencies
// common scope
import { LogService } from "../../../common/services/LogService";
import { NetworkService } from "../../../common/services/NetworkService";
import { QueryService } from "../../../common/services/QueryService";
import { StateService } from "../../../common/services/StateService";

// discovery scope
import {
  Asset,
  AssetDocument,
  AssetModel,
} from "../../../discovery/models/AssetSchema";

// users scope
import { Activity, ActivityModel } from "../../../users/models/ActivitySchema";

// statistics scope
import { LeaderboardAggregation } from "./LeaderboardAggregation";
import {
  Statistics,
  StatisticsModel,
} from "../../../statistics/models/StatisticsSchema";

/**
 * @class DailyScoreAggregation
 * @description The implementation for the daily score aggregation
 * scheduler. Contains source code for the execution logic of a
 * command with name: `Statistics:LeaderboardAggregation`.
 *
 * @since v0.3.2
 */
@Injectable()
export class DailyScoreAggregation extends LeaderboardAggregation {
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
    @InjectModel(Statistics.name) protected readonly model: StatisticsModel,
    @InjectModel(Asset.name) protected assetModel: AssetModel,
    @InjectModel(Activity.name) protected activityModel: ActivityModel,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly stateService: StateService,
    protected readonly queriesService: QueryService<AssetDocument, AssetModel>,
    protected readonly networkService: NetworkService,
    protected readonly configService: ConfigService,
    protected readonly logService: LogService,
  ) {
    super(
      model,
      assetModel,
      activityModel,
      schedulerRegistry,
      stateService,
      queriesService,
      networkService,
      configService,
      logService,
    );
    this.periodFormat = "D";
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
   * This cron method runs **every 1 hour (24 times per day)**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @returns {Promise<void>}
   */
  @Cron("0 0 */1 * * *", { name: `statistics/LeaderboardAggregation/D` })
  public async runAsScheduler(): Promise<void> {
    this.runScheduler();
  }

  /**
   * Method to create query dates that span across the
   * daily time range.
   * - Start date will be at today's 00:00 AM UTC time.
   * - End date will be at tomorrow's 00:00 AM UTC time.
   *
   * @access protected
   * @param {Date} dateNow The current {@link Date} instance that is passed from {@link LeaderboardAggregation}.
   * @returns {{ startDate: Date, endDate: Date }} The result object, consists of the start date and end date instances.
   */
  protected createQueryDates(dateNow: Date): {
    startDate: Date;
    endDate: Date;
  } {
    // today at 00:00:00:000
    const startDate = new Date(
      Date.UTC(
        dateNow.getUTCFullYear(),
        dateNow.getUTCMonth(),
        dateNow.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    // tomorrow at 00:00:00:000
    const endDate = new Date(
      Date.UTC(
        dateNow.getUTCFullYear(),
        dateNow.getUTCMonth(),
        dateNow.getUTCDate() + 1,
        0,
        0,
        0,
        0,
      ),
    );

    return { startDate, endDate };
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
    return moment(dateNow).format("YYYYMMDD");
  }

  /**
   * Method to generate the *previous* period string representation given a
   * data. The result string is in format: `{year}{month}{day}`.
   *
   * @access protected
   * @param {Date} dateNow The current {@link Date} instance that is passed from {@link LeaderboardAggregation}.
   * @returns {string} The period string representation of `dateNow - 1day` search range.
   */
  protected getPrevPeriod(dateNow: Date): string {
    return moment(dateNow).subtract(1, "day").format("YYYYMMDD");
  }
}
