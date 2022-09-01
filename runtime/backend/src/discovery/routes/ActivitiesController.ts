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
import { Controller, Get, Headers, Query } from "@nestjs/common";

// internal dependencies
import { ActivitiesService } from "../services/ActivitiesService";

@Controller()
export class ActivitiesController {
  constructor(private readonly activiesService: ActivitiesService) {}

  @Get("/activities")
  async getActivities(
    @Headers() headersObj: any,
    @Query() query: any,
  ): Promise<any[]> {
    return await this.activiesService.getActivies(headersObj, query);
  }
}
