/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";

import { UserTopActivities } from "./UserTopActivities";
import { LogModule } from "../../../common/modules/LogModule";
import { StateModule } from "../../../common/modules/StateModule";
import { StatisticsModule } from "../../modules/StatisticsModule";
import { QueryModule } from "../../../common/modules/QueryModule";

// processor scope
import {
  Activity,
  ActivitySchema,
} from "../../../processor/models/ActivitySchema";

// statistics scope
import { Statistics, StatisticsSchema } from "../../models/StatisticsSchema";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LogModule,
    StateModule,
    StatisticsModule,
    MongooseModule.forFeature([
      { name: Statistics.name, schema: StatisticsSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    QueryModule,
  ],
  providers: [UserTopActivities],
  exports: [UserTopActivities],
})
export default class {}
