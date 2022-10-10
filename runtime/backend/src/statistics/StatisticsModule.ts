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

// internal dependencies
import { AccountsModule } from "../common/modules/AccountsModule";
import { LeaderboardsModule } from "./modules/LeaderboardsModule";

/**
 * @label STATISTICS
 * @class StatisticsModule
 * @description The statistics scope's main module. This module
 * is loaded by the software when `"statistics"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link LeaderboardsModule:STATISTICS} | `statistics` | `/statistics/leaderboards` | Module with schedulers, collections and routes around **leaderboards**. |
 * <br /><br />
 * Note also that in {@link Schedulers:COMMON}, we map the following **schedulers**
 * to this module:
 * - A {@link DailyScoreAggregation:STATISTICS} *scheduler* that produces *daily* leaderboards in the background every 3 hours.
 * - A {@link WeeklyScoreAggregation:STATISTICS} *scheduler* that produces *daily* leaderboards in the background every 3 days.
 * - A {@link MonthlyScoreAggregation:STATISTICS} *scheduler* that produces *daily* leaderboards in the background every 3 days.
 *
 * @since v0.3.2
 */
@Module({
  imports: [AccountsModule, LeaderboardsModule],
})
export class StatisticsModule {}
