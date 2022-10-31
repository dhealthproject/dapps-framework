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
import { LogService } from "../services/LogService";

/**
 * @class LogModule
 * @description The main definition for the Log module.
 *
 * @since v0.3.2
 */
@Module({
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
