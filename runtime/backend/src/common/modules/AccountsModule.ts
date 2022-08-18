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
import { AccountsService } from "../services/AccountsService";
import { Account, AccountSchema } from "../models/AccountSchema";

/**
 * @label COMMON
 * @class AccountsModule
 * @description The main definition for the Accounts module.
 *
 * @since v0.1.0
 */
@Module({
  providers: [AccountsService],
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    QueryModule,
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
