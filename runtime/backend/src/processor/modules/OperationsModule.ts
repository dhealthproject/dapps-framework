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
import { OperationsService } from "../services/OperationsService";
import { OperationsController } from "../routes/OperationsController";
import { Operation, OperationSchema } from "../models/OperationSchema";

/**
 * @class OperationsModule
 * @description The main definition for the Accounts module.
 *
 * @since v0.1.0
 */
@Module({
  controllers: [OperationsController],
  providers: [OperationsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Operation.name,
        schema: OperationSchema,
      },
    ]),
    QueryModule,
  ],
  exports: [OperationsService],
})
export class OperationsModule {}
