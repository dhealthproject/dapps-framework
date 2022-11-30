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

// internal dependencies
// common scope
import { NetworkModule } from "../../../common/modules/NetworkModule";
import { StateModule } from "../../../common/modules/StateModule";
import { QueryModule } from "../../../common/modules/QueryModule";
import { LogModule } from "../../../common/modules/LogModule";

// users scope
import { Activity, ActivitySchema } from "../../../users/models/ActivitySchema";
import { ActivitiesModule } from "../../../users/modules/ActivitiesModule";

// payout scope
import { PayoutsModule } from "../../modules/PayoutsModule";
import { PrepareActivityPayouts } from "./PrepareActivityPayouts";
import { BroadcastActivityPayouts } from "./BroadcastActivityPayouts";

/**
 * @class ActivityPayoutsCommand
 * @description The main definition for the activity payouts module.
 *
 * @since v0.4.0
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StateModule,
    NetworkModule,
    QueryModule,
    PayoutsModule,
    ActivitiesModule,
    LogModule,
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  providers: [PrepareActivityPayouts, BroadcastActivityPayouts],
  exports: [PrepareActivityPayouts, BroadcastActivityPayouts],
})
export class ActivityPayoutsCommand {}
