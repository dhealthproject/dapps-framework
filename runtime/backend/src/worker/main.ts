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
import { LogService } from "../common/services/LogService";

// configuration resources
import dappConfigLoader from "../../config/dapp";

/**
 * Function to bootstrap the scheduler of the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // read configuration
  const dappConfig: DappConfig = dappConfigLoader();

  // create a logger instance
  const logger = new LogService(dappConfig.dappName + "/worker");

  // create an instance of the scheduler with imported configs
  await NestFactory.createApplicationContext(
    WorkerModule.register({
      ...dappConfig,
    } as DappConfig),
    { logger },
  );
}

// bootstrap the scheduler
bootstrap();
