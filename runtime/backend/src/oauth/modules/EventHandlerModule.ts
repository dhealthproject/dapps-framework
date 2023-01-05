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
// common scope
import { QueryModule } from "../../common/modules/QueryModule";

// users scope
import { Activity, ActivitySchema } from "../../users/models/ActivitySchema";
import { ActivitiesModule } from "../../users/modules/ActivitiesModule";

// oauth scope
import { AppConfiguration } from "../../AppConfiguration";
import { EventHandlerStrategyFactory } from "../drivers/EventHandlerStrategyFactory";
import { StravaEventHandlerStrategy } from "../drivers/strava/StravaEventHandlerStrategy";

/**
 * @label OAUTH
 * @class EventHandlerModule
 * @description The main definition for the Event Handler module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Activity.name,
        schema: ActivitySchema,
      },
    ]),
    AppConfiguration.getEventEmitterModule(),
    ActivitiesModule,
    QueryModule,
  ],
  providers: [EventHandlerStrategyFactory, StravaEventHandlerStrategy],
  exports: [EventHandlerStrategyFactory],
})
export class EventHandlerModule {}
