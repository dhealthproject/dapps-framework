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
import { QueryModule } from "../modules/QueryModule";
import { Log, LogSchema } from "../models/LogSchema";
import { LogService } from "../services/LogService";

/**
 * @class LogModule
 * @description The main definition for the Log module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Log.name,
        schema: LogSchema,
      }, // requirement from LogModule
    ]),
    QueryModule, // requirement from LogService
  ],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
