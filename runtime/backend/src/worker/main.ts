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

// internal dependencies
import { WorkerModule } from "./WorkerModule";
import { DappConfig } from "../common/models/DappConfig";

// configuration resources
import dappConfigLoader from "../../config/dapp";

/**
 * Function to bootstrap the scheduler of the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // create an instance of the scheduler with imported configs
  NestFactory.createApplicationContext(
    WorkerModule.register({
      ...dappConfigLoader(),
    } as DappConfig),
  );
}

// bootstrap the scheduler
bootstrap();
