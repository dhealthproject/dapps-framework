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
import { Statistics, StatisticsSchema } from "../models/StatisticsSchema";
import { LeaderboardsController } from "../routes/LeaderboardsController";
import { LeaderboardsService } from "../services/LeaderboardsService";

/**
 * @label STATISTICS
 * @class LeaderboardsModule
 * @description The main definition for the Leaderboards module.
 *
 * @since v0.3.2
 */
@Module({
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Statistics.name,
        schema: StatisticsSchema,
      },
    ]),
    QueryModule,
    AuthModule,
    AccountsModule,
  ],
  exports: [LeaderboardsService],
})
export class LeaderboardsModule {}
