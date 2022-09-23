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
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";

// internal dependencies
import { NetworkModule } from "../../../common/modules/NetworkModule";
import { StateModule } from "../../../common/modules/StateModule";
import { Account, AccountSchema } from "../../../common/models/AccountSchema";
import { AccountsModule } from "../../modules/AccountsModule";
import { TransactionsModule } from "../../modules/TransactionsModule";
import {
  Transaction,
  TransactionSchema,
} from "../../../common/models/TransactionSchema";

// private implementation
import { DiscoverAccounts } from "./DiscoverAccounts";

/**
 * @class DiscoverAccountsCommand
 * @description The main definition for the Accounts Discovery module.
 *
 * @since v0.1.0
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StateModule,
    NetworkModule,
    AccountsModule,
    TransactionsModule,
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [DiscoverAccounts],
  exports: [DiscoverAccounts],
})
export class DiscoverAccountsCommand {}
