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
import { Post, Body, Controller } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiExtraModels } from "@nestjs/swagger";

// internal dependencies
import { HooksService } from "../services/HooksService";
import { ActivityDTO } from "../models/ActivityDTO";
/**
 * @class HooksController
 * @description Class that contains hook endpoints
 *
 * example of usage: const hooksController: HooksController = new HooksController();
 *
 * @since v0.2.0
 */

@ApiTags("Activities")
@Controller()
export class HooksController {
  constructor(private readonly hooksService: HooksService) {}
  @Post("activities")
  @ApiOperation({
    summary: "Create or update activities",
    description:
      "Create or update activities, called by strava after activity completed",
  })
  @ApiExtraModels(ActivityDTO)
  /**
   * Creates or updates new activity
   * in database, updates statistics
   *
   * @param data
   *
   */
  protected async createOrUpdate<T extends ActivityDTO>(@Body() data: T) {
    return await this.hooksService.createOrUpdateActivities(data);
  }
}
