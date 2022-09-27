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
import { WebHooksController } from "../routes/WebHooksController";
import { WebHooksService } from "../services/WebHooksService";

/**
 * @label PROCESSOR
 * @class OperationsModule
 * @description The main definition for the Web Hooks module.
 *
 * @since v0.3.2
 */
@Module({
  providers: [WebHooksService],
  controllers: [WebHooksController],
})
export class WebHooksModule {}
