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

// internal dependencies
import { AppConfiguration } from "../../AppConfiguration";
import { EmailNotifierModule } from "./EmailNotifierModule";
import { NotifierFactoryModule } from "./NotifierFactoryModule";
import { AlertNotifier } from "../listeners/AlertNotifier";
import { StateModule } from "../../common/modules/StateModule";

/**
 * @label NOTIFIER
 * @class AlertsModule
 * @description The main definition for the Alerts module.
 *
 * @since v0.5.0
 */
@Module({
  imports: [
    AppConfiguration.getEventEmitterModule(), // requirement from AlertNotifier
    StateModule, // requirement from AlertNotifier
    NotifierFactoryModule, // requirement from AlertNotifier
    EmailNotifierModule, // requirement from NotifierFactory
  ],
  providers: [AlertNotifier],
})
export class AlertsModule {}
