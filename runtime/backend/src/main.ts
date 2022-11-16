/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// This file is used as the entry-point for the `nestjs` backend runtime
// and *does not* export any classes or interfaces and types.

// external dependencies
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import childProcess from "child_process";
import cookieParser from "cookie-parser";

// internal dependencies
import { AppModule } from "./AppModule";
import * as packageJson from "../package.json";
import { DappConfig } from "./common/models/DappConfig";
import { SecurityConfig } from "./common/models/SecurityConfig";
import { LogService } from "./common/services/LogService";

// configuration resources
import dappConfigLoader from "../config/dapp";
import securityConfigLoader from "../config/security";

/**
 * This method implements the *entry-point* of a dApp backend runtime and
 * initializes the configuration for worker processes (schedulers) as well
 * as for dynamic scopes that export routes, services and other application
 * modules that are registered dynamically.
 * <br /><br />
 * This method also configures a *Swagger* instance such that this backend
 * runtime includes documentation about routes and DTOs automatically.
 *
 * @async
 * @returns {Promise<void>}
 * @throws {ConfigurationError}   Given errors in/invalid configuration files, will throw {@link ConfigurationError}.
 */
async function bootstrap(): Promise<void> {
  // read configuration
  const dappConfig: DappConfig = dappConfigLoader();
  const securityConfig: SecurityConfig = securityConfigLoader();

  // verify configuration integrity
  // CAUTION: this will fail with a `ConfigurationError`
  AppModule.checkConfiguration();

  // create a logger instance
  const logger = new LogService(dappConfig.dappName);

  // create app instance
  const app = await NestFactory.create(
    AppModule.register({
      ...dappConfig,
    } as DappConfig),
    { logger },
  );

  // log about the app starting *also* in debug mode
  logger.debug(`Starting ${packageJson.name} at v${packageJson.version}`);

  // configures the request listener (HTTP server)
  const appPort = dappConfig.backendApp.port;
  const appUrl: string = dappConfig.backendApp.url;
  const appName = `${dappConfig.dappName} API`;

  // init OpenAPI documentation with information from package.json
  const docConfig = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addTag(`${packageJson.name} v${packageJson.version}`)
    .addServer(`${appUrl}`, appName)
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup("api", app, document);

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
