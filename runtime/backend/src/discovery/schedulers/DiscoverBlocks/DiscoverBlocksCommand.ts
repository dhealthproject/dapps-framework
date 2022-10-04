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
import { ScheduleModule } from "@nestjs/schedule";

// internal dependencies
import { StateModule } from "../../../common/modules/StateModule";
import { Block, BlockSchema } from "../../../discovery/models/BlockSchema";

// private implementation
import { DiscoverBlocks } from "./DiscoverBlocks";
import { NetworkModule } from "../../../common/modules/NetworkModule";
import { BlocksModule } from "../../../discovery/modules/BlocksModule";

/**
 * @class DiscoverBlocksCommand
 * @description The main definition for the Blocks Discovery module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StateModule,
    NetworkModule,
    BlocksModule,
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
  ],
  providers: [DiscoverBlocks],
  exports: [DiscoverBlocks],
})
export class DiscoverBlocksCommand {}
