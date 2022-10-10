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
import { Block, BlockSchema } from "../models/BlockSchema";
import { BlocksService } from "../services/BlocksService";

/**
 * @label DISCOVERY
 * @class BlocksModule
 * @description The main definition for the Blocks module.
 *
 * @since v0.3.2
 */
@Module({
  providers: [BlocksService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Block.name,
        schema: BlockSchema,
      },
    ]),
    AuthModule,
    QueryModule,
  ],
  exports: [BlocksService],
})
export class BlocksModule {}
