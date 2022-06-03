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
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as childProcess from 'child_process';

// internal dependencies
import { AppModule } from './app.module';
import { dappConfig, networkConfig } from '../config';
import * as packageJson from '../package.json';

/**
 * Main function to bootstrap the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // create app instance
  const app = await NestFactory.create(
    AppModule.register({ ...dappConfig, ...networkConfig }),
  );

  // add secutity
  app.enableCors();
  app.use(helmet());

  // init OpenAPI documentation with information from package.json
  const docConfig = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addTag(`${packageJson.name} v${packageJson.version}`)
    .addServer('http://localhost:7903', 'Your running instance')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('specs', app, document);

  // start the scheduler if exists in scopes
  if (dappConfig.scopes.SchedulerModule) startScheduler();

  // start the app
  await app.listen(7903);
}

/**
 * Function to run the scheduler (with cronjobs) on a child process.
 *
 * @returns {void}
 */
function startScheduler(): void {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;

  // start a new process with the Scheduler module
  const process = childProcess.fork(__dirname + '/scheduler/main');

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    console.log(err);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error('exit code ' + code);
    console.log(err);
  });
}

// bootstrap the app
bootstrap();
