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
import { SecurityConfig } from "./common/models/SecurityConfig";

// configuration resources
import dappConfigLoader from "../config/dapp";
import securityConfigLoader from "../config/security";

/**
 * Main function to bootstrap the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // read configuration
  const dappConfig: DappConfig = dappConfigLoader();
  const securityConfig: SecurityConfig = securityConfigLoader();

  // create app instance
  const app = await NestFactory.create(
    AppModule.register({
      ...dappConfig,
    } as DappConfig),
  );

  // create a logger instance
  const logger = new Logger(dappConfig.dappName);
  logger.debug(`Starting ${packageJson.name} at v${packageJson.version}`);

  // enable CORS only when desired
  const allowedOrigins = securityConfig.cors.origin;

  // origin may be one of:
  // - an array of URLs
  // - one specific URL
  // - a boolean `true`
  if (allowedOrigins !== false && allowedOrigins !== "*") {
    app.enableCors({
      credentials: true,
      origin: allowedOrigins,
    });
  }
  // wildcard CORS does not *require* credentials
  else if (allowedOrigins === "*") {
    app.enableCors({ origin: "*" });
  }

  // enable throttle and *secured* cookie parser
  app.use(helmet());
  app.use(cookieParser(securityConfig.auth.secret));

  // configures the request listener (HTTP server)
  const appPort = dappConfig.backendApp.port;
  const appUrl: string = dappConfig.backendApp.url;
  const appName = `${dappConfig.dappName} API`;

  // init OpenAPI documentation with information from package.json
  const docConfig = new DocumentBuilder()
    .setTitle(dappConfig.dappName)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addTag(`${packageJson.name} v${packageJson.version}`)
    .addServer(`${appUrl}`, appName)
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup("api", app, document);

  // start the worker
  logger.debug(`Starting the worker process...`);
  startWorkerProcess();

  // start the app
  logger.debug(`Now listening for requests on port ${appPort}`);
  await app.listen(appPort);
  logger.debug(`Accepting requests on: ${await app.getUrl()}`);
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
