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
import { NetworkModule } from "../../../common/modules/NetworkModule";
import { QueryModule } from "../../../common/modules/QueryModule";
import { StateModule } from "../../../common/modules/StateModule";
import { TransactionsModule } from "../../modules/TransactionsModule";
import { Transaction, TransactionSchema } from "../../models/TransactionSchema";

// private implementation
import { DiscoverTransactions } from "./DiscoverTransactions";

/**
 * @class DiscoverTransactionsCommand
 * @description The main definition for the Transactions Discovery module.
 *
 * @since v0.2.0
 */
@Module({
  imports: [
    QueryModule,
    StateModule,
    NetworkModule,
    TransactionsModule,
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  providers: [DiscoverTransactions],
  exports: [DiscoverTransactions],
})
export class DiscoverTransactionsCommand {}
