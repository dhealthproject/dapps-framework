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
import {
  AccountSession,
  AccountSessionSchema,
} from "../models/AccountSessionSchema";
import { AccountSessionsService } from "../services/AccountSessionsService";

/**
 * @label COMMON
 * @class AccountSessionsModule
 * @description The main definition for the AccountSessions module.
 *
 * @since v0.3.2
 */
@Module({
  providers: [AccountSessionsService],
  imports: [
    MongooseModule.forFeature([
      { name: AccountSession.name, schema: AccountSessionSchema },
    ]),
    QueryModule,
  ],
  exports: [AccountSessionsService],
})
export class AccountSessionsModule {}
