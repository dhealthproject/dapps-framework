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
import { AuthModule } from "../common/modules/AuthModule";
import {
  AccountIntegration,
  AccountIntegrationSchema,
} from "../common/models/AccountIntegrationSchema";
import { QueryModule } from "../common/modules/QueryModule";

// oauth scope
import { OAuthController } from "./routes";
import { OAuthService } from "./services";
import { WebHooksModule } from "./modules";

/**
 * @label SCOPES
 * @class OAuthModule
 * @description The oauth scope's main module. This module
 * is loaded by the software when `"oauth"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * #### Modules
 *
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link WebHooksModule} | N/A | `/webhook/:provider` | Module with schedulers, collections and routes around **Web Hooks**. |
 * <br /><br />
 * #### Events
 *
 * This scoped module currently features the following events:
 * | Class | Name | Link | Description |
 * | --- | --- | --- | --- |
 * | `OnActivityCreated` | `oauth.activity.created` | {@link OnActivityCreated} | Event that is *emitted* in {@link WebHooksService.eventHandler} when an activity is created in database. |
 * | `OnActivityDownloaded` | `oauth.activity.downloaded` | {@link OnActivityDownloaded} | Event that is *emitted* in {@link WebHooksService.onActivityCreated} when an activity is successfully downloaded from the data provider. |
 * <br /><br />
 * #### Listeners
 *
 * This scoped module currently features the following listeners:
 * | Class | Event | Link | Description |
 * | --- | --- | --- | --- |
 * | `WebHooksService.onActivityCreated` | `oauth.activity.created` | {@link WebHooksService.onActivityCreated} | Event listener that *instructs* the runtime backend to run an *activity download* command. |
 *
 * @since v0.5.3
 */
@Module({
  imports: [
    QueryModule,
    AuthModule,
    WebHooksModule,
    MongooseModule.forFeature([
      { name: AccountIntegration.name, schema: AccountIntegrationSchema },
    ]),
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
