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

export interface Activity {
  id: number;
  name: string;
  distance: number;
  elapsed_time: number;
  moving_time: number;
  total_elevation_gain: number;
  kilojoules: number;
  calories: number;
  start_date: string;
}

/**
 * @class ActivitiesController
 * @description Controller part of discovery scoped,
 * used for an interaction with activities
 *
 * @since v0.2.0
 */
@Controller()
export class ActivitiesController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {ActivitiesService} ActivitiesService
   */
  constructor(private readonly activiesService: ActivitiesService) {}

  /**
   *
   * Endpoint for getting list of activities,
   * can be full
   * paginated
   * sorted ASC, DESC
   *
   * @param headersObj
   * @param query
   * @returns
   */
  @Get("/activities")
  async getActivities(
    @Headers() headersObj: any,
    @Query() query: any,
  ): Promise<Activity[]> {
    return await this.activiesService.getActivies(headersObj, query);
  }
}
