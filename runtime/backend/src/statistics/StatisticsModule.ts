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
// statistics scope
import { StatisticsModule as ModuleImpl } from "./modules/StatisticsModule";

/**
 * @label STATISTICS
 * @class StatisticsModule
 * @description The statistics scope's main module. This module
 * is loaded by the software when `"statistics"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * #### Modules
 *
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link StatisticsModule:STATISTICS} | `statistics` | `/statistics/leaderboards` | Module with schedulers, collections and routes around **leaderboards**. |
 * <br /><br />
 * #### Events
 *
 * This scoped module does not currently fire/trigger any events.
 *
 * <br /><br />
 * #### Notes
 *
 * Note also that in {@link Schedulers:COMMON}, we map the following **schedulers**
 * to this module:
 * - A {@link DailyScoreAggregation:STATISTICS} *scheduler* that produces *daily* leaderboards in the background every 3 hours.
 * - A {@link WeeklyScoreAggregation:STATISTICS} *scheduler* that produces *daily* leaderboards in the background every 3 days.
 * - A {@link MonthlyScoreAggregation:STATISTICS} *scheduler* that produces *daily* leaderboards in the background every 3 days.
 * - A {@link UserAggregation:STATISTICS} *scheduler* that produces *daily* user aggregation in the background every minute.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    // imports routes and DTOs
    ModuleImpl,
  ],
})
export class StatisticsModule {}
