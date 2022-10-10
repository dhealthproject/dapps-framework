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
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import { QueryService } from "../../../common/services/QueryService";
import {
  Asset,
  AssetDocument,
  AssetModel,
} from "../../../discovery/models/AssetSchema";
import { NetworkService } from "../../../common/services/NetworkService";
import {
  Statistics,
  StatisticsModel,
} from "../../../statistics/models/StatisticsSchema";
import { LeaderboardAggregation } from "./LeaderboardAggregation";
import {
  Activity,
  ActivityDocument,
} from "../../../processor/models/ActivitySchema";

/**
 * @class MonthlyScoreAggregation
 * @description The implementation for the weekly score aggregation
 * scheduler. Contains source code for the execution logic of a
 * command with name: `Statistics:LeaderboardAggregation`.
 *
 * @since v0.3.2
 */
@Injectable()
export class WeeklyScoreAggregation extends LeaderboardAggregation {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {SchedulerRegistry}   schedulerRegistry
   * @param {StateService}        stateService
   * @param {queriesService}      queriesService
   * @param {NetworkService}      networkService
   * @param {ConfigService}       configService
   */
  constructor(
    @InjectModel(Statistics.name) protected readonly model: StatisticsModel,
    @InjectModel(Asset.name) protected assetModel: AssetDocument,
    @InjectModel(Activity.name) protected activityModel: ActivityDocument,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly stateService: StateService,
    protected readonly queriesService: QueryService<AssetDocument, AssetModel>,
    protected readonly networkService: NetworkService,
    protected readonly configService: ConfigService,
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
    );
    this.periodFormat = "W";
    this.addCronJob("0 0 0 */3 * *"); // every 3 days (3 times per week)
  }

  /**
   * Method to create query dates that span across the
   * weekly time range.
   * - Start date will be at the first day of this month, 00:00 AM UTC time.
   * - End date will be at the first day of next month, 00:00 AM UTC time.
   *
   * @access protected
   * @param {Date} dateNow The current {@link Date} instance that is passed from {@link LeaderboardAggregation}.
   * @returns {{ startDate: Date, endDate: Date }} The result object, consists of the start date and end date instances.
   */
  protected createQueryDates(dateNow: Date): {
    startDate: Date;
    endDate: Date;
  } {
    const dayOfWeek = dateNow.getUTCDay();
    const startDate = new Date(
      Date.UTC(
        dateNow.getUTCFullYear(),
        dateNow.getUTCMonth(),
        dateNow.getUTCDate() - dayOfWeek + 1,
      ),
    );
    const endDate = new Date(
      Date.UTC(
        dateNow.getUTCFullYear(),
        dateNow.getUTCMonth(),
        dateNow.getUTCDate() + (8 - dayOfWeek),
      ),
    );
    return { startDate, endDate };
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
}
