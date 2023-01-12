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
import { Account, AccountSchema } from "../../../common/models/AccountSchema";

// discovery scope
import { Asset, AssetSchema } from "../../../discovery/models/AssetSchema";
import { AssetsModule } from "../../../discovery/modules/AssetsModule";

// users scope
import { ActivitiesModule } from "../../../users/modules/ActivitiesModule";

// payout scope
import { PayoutsModule } from "../../modules/PayoutsModule";
import { BroadcastBoosterPayouts } from "./BroadcastBoosterPayouts";
import { PrepareBoost5Payouts } from "./PrepareBoost5Payouts";
import { PrepareBoost10Payouts } from "./PrepareBoost10Payouts";
import { PrepareBoost15Payouts } from "./PrepareBoost15Payouts";

/**
 * @class BoosterPayoutsCommand
 * @description The main definition for the booster payouts module.
 *
 * @since v0.6.0
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StateModule,
    NetworkModule,
    QueryModule,
    PayoutsModule,
    ActivitiesModule,
    AssetsModule,
    LogModule,
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Asset.name, schema: AssetSchema },
    ]),
  ],
  providers: [
    BroadcastBoosterPayouts,
    PrepareBoost5Payouts,
    PrepareBoost10Payouts,
    PrepareBoost15Payouts,
  ],
  exports: [
    BroadcastBoosterPayouts,
    PrepareBoost5Payouts,
    PrepareBoost10Payouts,
    PrepareBoost15Payouts,
  ],
})
export class BoosterPayoutsCommand {}
