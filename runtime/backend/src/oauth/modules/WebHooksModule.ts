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
import { AuthModule } from "../../common/modules/AuthModule";
import { LogModule } from "../../common/modules/LogModule";
import {
  AccountIntegration,
  AccountIntegrationSchema,
} from "../../common/models/AccountIntegrationSchema";

// users scope
import { ActivitiesModule } from "../../users/modules/ActivitiesModule";
import { Activity, ActivitySchema } from "../../users/models/ActivitySchema";

// oauth scope
import { AppConfiguration } from "../../AppConfiguration";
import { WebHooksController } from "../routes/WebHooksController";
import { WebHooksService } from "../services/WebHooksService";
import { OAuthService } from "../services";
import { EventHandlerStrategyFactory } from "../drivers/EventHandlerStrategyFactory";
import { EventHandlerModule } from "./EventHandlerModule";

/**
 * @label OAUTH
 * @class WebHooksModule
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
      }, // requirement from OAuthService
    ]),
    AuthModule, // requirement from WebHooksService
    ActivitiesModule, // requirement from WebHooksService
    QueryModule, // requirement from WebHooksService
    LogModule, // requirement from WebHooksService
    EventHandlerModule, // requirement from WebHooksService
  ],
  controllers: [WebHooksController],
  providers: [WebHooksService, OAuthService],
})
export class WebHooksModule {}
