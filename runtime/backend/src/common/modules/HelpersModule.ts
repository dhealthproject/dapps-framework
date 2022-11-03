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

// internal dependencies
import { DappHelper } from "../concerns/DappHelper";
import { NetworkModule } from "./NetworkModule";

/**
 * @class HelpersModule
 * @description The main definition for the Helpers module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [NetworkModule],
  providers: [DappHelper],
  exports: [DappHelper],
})
export class HelpersModule {}
