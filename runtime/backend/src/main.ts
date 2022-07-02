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
import { Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import childProcess from "child_process";
import cookieParser from "cookie-parser";

// internal dependencies
import { AppModule } from "./AppModule";
import * as packageJson from "../package.json";
import { DappConfig } from "./common/models/DappConfig";

// configuration resources
import dappConfigLoader from "../config/dapp";

/**
 * Main function to bootstrap the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // create app instance
  const app = await NestFactory.create(
    AppModule.register({
      ...(dappConfigLoader()),
    } as DappConfig),
  );

  // create a logger instance
  const logger = new Logger(dappConfigLoader().dappName);
  logger.debug(`Starting ${packageJson.name} at v${packageJson.version}`);

  // add secutity
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser(process.env.AUTH_TOKEN_SECRET));

  // init OpenAPI documentation with information from package.json
  const docConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addTag(`${packageJson.name} v${packageJson.version}`)
    .addServer("http://localhost:7903", "Your running instance")
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup("specs", app, document);

  // start the worker
  logger.debug(`Now starting the worker process...`);
  startWorkerProcess();

  // configures the request listener (HTTP server)
  const appPort: string = process.env.NODE_ENV === "production"
    ? process.env.PROD_APP_PORT
    : process.env.DEV_APP_PORT;

  // start the app
  logger.debug(`Now listening for requests on port ${appPort}`);
  await app.listen(appPort);
}

/**
 * Function to run the scheduler (with cronjobs) on a child process.
 *
 * @returns {void}
 */
function startWorkerProcess(): void {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;

  // start a new process with the Scheduler module
  const process = childProcess.fork(`${__dirname}/worker/main`);

  // listen for errors as they may prevent the exit event from firing
  process.on("error", function (err) {
    if (invoked) return;
    invoked = true;
    console.log(err);
  });

  // execute the callback once the process has finished running
  process.on("exit", function (code) {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error(`exit code ${code}`);
    console.log(err);
  });
}

// bootstrap the app
bootstrap();
