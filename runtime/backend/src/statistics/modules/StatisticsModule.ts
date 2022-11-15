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
import { AccountsModule } from "../../common/modules/AccountsModule";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

// internal dependencies
import { AuthModule } from "../../common/modules/AuthModule";
import { QueryModule } from "../../common/modules/QueryModule";
import { StateModule } from "../../common/modules/StateModule";
import { Statistics, StatisticsSchema } from "../models/StatisticsSchema";
import { LeaderboardsController } from "../routes/LeaderboardsController";
import { UsersController } from "../routes/UsersController";
import { StatisticsService } from "../services/StatisticsService";

/**
 * @label STATISTICS
 * @class LeaderboardsModule
 * @description The main definition for the Leaderboards module.
 *
 * @since v0.5.0
 */
@Module({
  controllers: [UsersController, LeaderboardsController],
  providers: [StatisticsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Statistics.name,
        schema: StatisticsSchema,
      },
    ]),
    QueryModule, // requirement from StatisticsService
    AuthModule, // requirement from UsersController
    AccountsModule, // requirement from AuthModule
    StateModule, // requirement from schedulers
  ],
  exports: [StatisticsService],
})
export class StatisticsModule {}
