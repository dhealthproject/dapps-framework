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

// internal dependencies
import { HooksService } from "../services/HooksService";

export interface activityPayload {
  object_type: string;
  object_id: string;
  aspect_type: string;
  owner_id: string;
}

@Controller()
export class HooksController {
  constructor(private readonly hooksService: HooksService) {}
  @Post("activities")
  protected async createActivities<T extends activityPayload>(@Body() data: T) {
    return await this.hooksService.createUpdateActivities(data);
  }
}
