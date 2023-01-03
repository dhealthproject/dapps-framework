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
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";

// common scope
import { LogModule } from "../../../common/modules/LogModule";
import { StateModule } from "../../../common/modules/StateModule";
import { QueryModule } from "../../../common/modules/QueryModule";

// users scope
import { Activity, ActivitySchema } from "../../../users/models/ActivitySchema";

// statistics scope
import { Statistics, StatisticsSchema } from "../../models/StatisticsSchema";
import { StatisticsImplementationModule } from "../../modules/StatisticsImplementationModule";
import { UserTopActivities } from "./UserTopActivities";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LogModule,
    StateModule,
    StatisticsImplementationModule,
    MongooseModule.forFeature([
      { name: Statistics.name, schema: StatisticsSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    QueryModule,
  ],
  providers: [UserTopActivities],
  exports: [UserTopActivities],
})
export class UserTopActivitiesCommand {}
