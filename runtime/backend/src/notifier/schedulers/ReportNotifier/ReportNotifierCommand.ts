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
import { ScheduleModule } from "@nestjs/schedule";

// internal dependencies
// common scope
import { StateModule } from "../../../common/modules/StateModule";
import { QueryModule } from "../../../common/modules/QueryModule";
import { NetworkModule } from "../../../common/modules/NetworkModule";
import { LogModule } from "../../../common/modules/LogModule";
import { Log, LogSchema } from "../../../common/models/LogSchema";
import { HelpersModule } from "../../../common/modules/HelpersModule";

// notifier scope
import { ReportNotifier } from "./ReportNotifier";
import { NotifierFactory } from "../../concerns/NotifierFactory";
import { EmailNotifierModule } from "../../modules/EmailNotifierModule";
import { AlertNotifier } from "../../listeners/AlertNotifier";

/**
 * @class ReportNotifierCommand
 * @description The main definition for the Report Notifier Command module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    StateModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    LogModule,
    QueryModule,
    NetworkModule,
    EmailNotifierModule,
    HelpersModule,
  ],
  providers: [NotifierFactory, ReportNotifier, AlertNotifier],
  exports: [ReportNotifier, AlertNotifier],
})
export class ReportNotifierCommand {}
