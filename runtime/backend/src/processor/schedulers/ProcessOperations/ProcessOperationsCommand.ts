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
// common scope
import { NetworkModule } from "../../../common/modules/NetworkModule";
import { StateModule } from "../../../common/modules/StateModule";
import { QueryModule } from "../../../common/modules/QueryModule";
import {
  Transaction,
  TransactionSchema,
} from "../../../common/models/TransactionSchema";

// processor scope
import { OperationsModule } from "../../modules/OperationsModule";
import { Operation, OperationSchema } from "../../models/OperationSchema";
import { ProcessOperations } from "./ProcessOperations";

/**
 * @class ProcessOperationsCommand
 * @description The main definition for the Transactions Discovery module.
 *
 * @since v0.2.0
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StateModule,
    NetworkModule,
    OperationsModule,
    QueryModule,
    MongooseModule.forFeature([
      { name: Operation.name, schema: OperationSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [ProcessOperations],
  exports: [ProcessOperations],
})
export class ProcessOperationsCommand {}
