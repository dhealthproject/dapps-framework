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
import { AuthModule } from "../../common/modules/AuthModule";
import { QueryModule } from "../../common/modules/QueryModule";
import { StateModule } from "../../common/modules/StateModule";
import { Payout, PayoutSchema } from "../models/PayoutSchema";
import { PayoutsController } from "../routes/PayoutsController";
import { SignerService } from "../services/SignerService";
import { PayoutsService } from "../services/PayoutsService";

/**
 * @label PAYOUT
 * @class PayoutsModule
 * @description The main definition for the Activities module.
 *
 * @since v0.4.0
 */
@Module({
  controllers: [PayoutsController],
  providers: [SignerService, PayoutsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Payout.name,
        schema: PayoutSchema,
      },
    ]), // requirement from PayoutsService
    AuthModule, // requirement from PayoutsController
    QueryModule, // requirement from PayoutsService
    StateModule, // requirement from PreparePayouts
  ],
  exports: [SignerService, PayoutsService],
})
export class PayoutsModule {}
