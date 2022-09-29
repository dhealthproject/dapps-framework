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
import { QueryModule } from "../../common/modules/QueryModule";
import { OAuthService } from "../../common/services/OAuthService";
import {
  AccountIntegration,
  AccountIntegrationSchema,
} from "../../common/models/AccountIntegrationSchema";
import { WebHooksController } from "../routes/WebHooksController";
import { WebHooksService } from "../services/WebHooksService";
import { Activity, ActivitySchema } from "../models/ActivitySchema";

/**
 * @label PROCESSOR
 * @class OperationsModule
 * @description The main definition for the Web Hooks module.
 *
 * @since v0.3.2
 */
@Module({
  controllers: [WebHooksController],
  providers: [WebHooksService, OAuthService],
  imports: [
    MongooseModule.forFeature([
      {
        name: AccountIntegration.name,
        schema: AccountIntegrationSchema,
      }, // requirement from OAuthService
      {
        name: Activity.name,
        schema: ActivitySchema,
      }, // requirement from WebHooksService
    ]),
    QueryModule,
  ],
})
export class WebHooksModule {}
