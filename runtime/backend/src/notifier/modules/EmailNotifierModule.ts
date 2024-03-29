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
import { EmailNotifier } from "../services/EmailNotifier";
import { AppConfiguration } from "../../AppConfiguration";

/**
 * @label NOTIFIER
 * @class EmailNotifierModule
 * @description The main definition for the email notifier module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [AppConfiguration.getMailerModule()],
  providers: [EmailNotifier],
  exports: [EmailNotifier],
})
export class EmailNotifierModule {}
