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
import {
  Transaction,
  TransactionSchema,
} from "../../../common/models/TransactionSchema";
import { Asset, AssetSchema } from "../../models/AssetSchema";
import { AssetsModule } from "../../modules/AssetsModule";
import { TransactionsModule } from "../../modules/TransactionsModule";

// private implementation
import { DiscoverAssets } from "./DiscoverAssets";

/**
 * @class DiscoverAssetsCommand
 * @description The main definition for the Assets Discovery module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StateModule,
    NetworkModule,
    AssetsModule,
    TransactionsModule,
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [DiscoverAssets],
  exports: [DiscoverAssets],
})
export class DiscoverAssetsCommand {}
