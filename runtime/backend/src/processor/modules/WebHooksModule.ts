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
import { EventEmitterModule } from "@nestjs/event-emitter";

// internal dependencies
import { QueryModule } from "../../common/modules/QueryModule";
import { AuthModule } from "../../common/modules/AuthModule";
import {
  AccountIntegration,
  AccountIntegrationSchema,
} from "../../common/models/AccountIntegrationSchema";
import { WebHooksController } from "../routes/WebHooksController";
import { ActivitiesModule } from "./ActivitiesModule";
import { WebHooksService } from "../services/WebHooksService";
import { Activity, ActivitySchema } from "../models/ActivitySchema";
import { LogModule } from "../../common/modules";

/**
 * @label PROCESSOR
 * @class OperationsModule
 * @description The main definition for the Web Hooks module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AccountIntegration.name,
        schema: AccountIntegrationSchema,
      }, // requirement from OAuthModule
      {
        name: Activity.name,
        schema: ActivitySchema,
      }, // requirement from ActivitiesModule
    ]),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: ".",
      maxListeners: 5,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }), // requirement from WebHooksService
    AuthModule, // requirement from WebHooksService
    ActivitiesModule, // requirement from WebHooksService
    QueryModule, // requirement from WebHooksService
    LogModule, // requirement from WebHooksService
  ],
  controllers: [WebHooksController],
  providers: [WebHooksService],
})
export class WebHooksModule {}
