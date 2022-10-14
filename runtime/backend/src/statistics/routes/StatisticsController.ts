/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../common/traits";
import { StatisticsService } from "../services/StatisticsService";
import { StatsDTO } from "../models/StatsDTO";

@UseGuards(AuthGuard)
@Controller("statistics")
export class StatisticsController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {StatisticsService} statisticsService
   */
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get(":address")
  async getQuickStats(@Param("address") address: string): Promise<StatsDTO> {
    return await this.statisticsService.getStats(address);
  }
}
