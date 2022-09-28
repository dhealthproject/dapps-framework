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
import { MongooseModule } from "@nestjs/mongoose";

// internal dependencies
import { AuthModule } from "../../common/modules/AuthModule";
import { QueryModule } from "../../common/modules/QueryModule";
import { Activity, ActivitySchema } from "../models/ActivitySchema";
import { ActivitiesController } from "../routes/ActivitiesController";
import { ActivitiesService } from "../services/ActivitiesService";

/**
 * @label PROCESSOR
 * @class ActivitiesModule
 * @description The main definition for the Activities module.
 *
 * @since v0.3.2
 */
@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Activity.name,
        schema: ActivitySchema,
      },
    ]),
    QueryModule,
    AuthModule,
  ],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
