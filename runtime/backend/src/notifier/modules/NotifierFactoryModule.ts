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
import { EmailNotifierModule } from "./EmailNotifierModule";
import { NotifierFactory } from "../concerns/NotifierFactory";

/**
 * @label NOTIFIER
 * @class NotifierFactoryModule
 * @description The main definition for the Alerts module.
 *
 * @since v0.5.0
 */
@Module({
  imports: [
    EmailNotifierModule, // requirement from NotifierFactory
  ],
  providers: [NotifierFactory],
  exports: [NotifierFactory],
})
export class NotifierFactoryModule {}
