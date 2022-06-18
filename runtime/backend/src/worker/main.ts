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
import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./WorkerModule";

// internal dependencies
import { dappConfig, networkConfig } from "../../config";
import { DappConfig } from "../common/models/DappConfig";

/**
 * Function to bootstrap the scheduler of the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // create an instance of the scheduler with imported configs
  NestFactory.createApplicationContext(
    WorkerModule.register({ ...dappConfig, ...networkConfig } as DappConfig),
  );
}

// bootstrap the scheduler
bootstrap();
