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
import { EventEmitter2 } from "@nestjs/event-emitter";

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
  // create an instance of the scheduler with imported configs
  const app = await NestFactory.createApplicationContext(
    WorkerModule.register({
      ...dappConfigLoader(),
    } as DappConfig),
    { logger: new LogService("SCHEDULERS") },
  );

  // create a logger instance
  const logger = new LogService("SCHEDULERS", app.get(EventEmitter2));
  app.useLogger(logger);
}

// bootstrap the scheduler
bootstrap();
