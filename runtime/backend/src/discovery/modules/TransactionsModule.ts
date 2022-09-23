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
import { TransactionsService } from "../services/TransactionsService";
import { TransactionsController } from "../routes/TransactionsController";
import {
  Transaction,
  TransactionSchema,
} from "../../common/models/TransactionSchema";

/**
 * @class TransactionsModule
 * @description The main definition for the Transactions module.
 *
 * @since v0.1.0
 */
@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
    QueryModule,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
