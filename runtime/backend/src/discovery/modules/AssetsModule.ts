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
import { AssetsService } from "../services/AssetsService";
import { AssetsController } from "../routes/AssetsController";
import { Asset, AssetSchema } from "../models/AssetSchema";

/**
 * @label DISCOVERY
 * @class AssetsModule
 * @description The main definition for the Assets module.
 *
 * @since v0.1.0
 */
@Module({
  controllers: [AssetsController],
  providers: [AssetsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Asset.name,
        schema: AssetSchema,
      },
    ]),
    AuthModule,
    QueryModule,
  ],
  exports: [AssetsService],
})
export class AssetsModule {}
