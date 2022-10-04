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
import { LeaderboardsModule } from "./modules/LeaderboardsModule";

/**
 * @label StatisticsModule
 * @class StatisticsModule
 * @description The statistics scope's main module.
 */
@Module({
  imports: [LeaderboardsModule],
})
export class StatisticsModule {}
