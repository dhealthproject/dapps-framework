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
import { NotifierFactory } from "./concerns/NotifierFactory";
import { AlertNotifier } from "./listeners/AlertNotifier";

// internal dependencies
import { HelpersModule } from "../common/modules/HelpersModule";
import { EmailNotifierModule } from "./modules/EmailNotifierModule";

/**
 * @label NOTIFIER
 * @class NotifierModule
 * @description The notifier scope's main module. This module
 * is loaded by the software when `"notifier"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link EmailNotifierModule:NOTIFIER} | `notifier` | `/notifier/emailnotifier` | Module with schedulers, collections and routes around **notifier**. |
 * <br /><br />
 * Note also that in {@link Schedulers:COMMON}, we map the following **schedulers**
 * to this module:
 * - A {@link ReportNotifier:NOTIFIER} *scheduler* that sends reports in the background every day/week/month depends on reports configuration.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    HelpersModule,
    EmailNotifierModule,
  ],
  providers: [AlertNotifier, NotifierFactory],
  exports: [AlertNotifier, NotifierFactory],
})
export class NotifierModule {}
