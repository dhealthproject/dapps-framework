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
import { State, StateSchema } from "../models/StateSchema";
import { StateService } from "../services/StateService";

/**
 * @class StatesModule
 * @description The main definition for the State module.
 *
 * @since v0.1.0
 */
@Module({
  providers: [StateService],
  imports: [
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
  ],
  exports: [StateService],
})
export class StateModule {}
