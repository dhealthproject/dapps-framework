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
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";

// internal dependencies
// common scope
import { StateModule } from "../../../common/modules/StateModule";
import { QueryModule } from "../../../common/modules/QueryModule";
import { NetworkModule } from "../../../common/modules/NetworkModule";

// statistics scope
import { Statistics, StatisticsSchema } from "../../models/StatisticsSchema";
import { DailyScoreAggregation } from "./DailyScoreAggregation";
import { WeeklyScoreAggregation } from "./WeeklyScoreAggegation";
import { MonthlyScoreAggregation } from "./MonthlyScoreAggregation";

// discovery scope
import { Asset, AssetSchema } from "../../../discovery/models/AssetSchema";

// processor scope
import {
  Activity,
  ActivitySchema,
} from "../../../processor/models/ActivitySchema";

/**
 * @class LeaderboardAggregationCommand
 * @description The main definition for the Leaderboard Aggregation module.
 *
 * @since v0.2.0
 */
@Module({
  imports: [
    StateModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Statistics.name, schema: StatisticsSchema },
      { name: Asset.name, schema: AssetSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    QueryModule,
    NetworkModule,
  ],
  providers: [
    DailyScoreAggregation,
    WeeklyScoreAggregation,
    MonthlyScoreAggregation,
  ],
})
export class LeaderboardsAggregationCommand {}
