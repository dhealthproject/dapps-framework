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

/**
 * @class HelpersModule
 * @description The main definition for the Network module.
 *
 * @since v0.1.0
 */
@Module({
  providers: [DappHelper],
  exports: [DappHelper],
})
export class HelpersModule {}
