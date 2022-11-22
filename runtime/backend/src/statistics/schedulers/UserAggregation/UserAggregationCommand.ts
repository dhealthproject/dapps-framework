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
import { LogModule } from "../../../common/modules/LogModule";
import { StateModule } from "../../../common/modules/StateModule";
import { QueryModule } from "../../../common/modules/QueryModule";

// statistics scope
import { Statistics, StatisticsSchema } from "../../models/StatisticsSchema";
import { StatisticsModule } from "../../modules/StatisticsModule";
import { UserAggregation } from "./UserAggregation";

// processor scope
import {
  Activity,
  ActivitySchema,
} from "../../../processor/models/ActivitySchema";

/**
 * @class UserAggregationCommand
 * @description The main definition for the User Aggregation module.
 *
 * @since v0.5.0
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StateModule,
    QueryModule,
    StatisticsModule,
    LogModule,
    MongooseModule.forFeature([
      { name: Statistics.name, schema: StatisticsSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  providers: [UserAggregation],
  exports: [UserAggregation],
})
export class UserAggregationCommand {}
