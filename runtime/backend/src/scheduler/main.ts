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
import { SchedulerModule } from './scheduler.module';

// internal dependencies
import { dappConfig, networkConfig } from '../../config';
import { ConfigDTO } from 'src/common/models';

/**
 * Function to bootstrap the scheduler of the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // create an instance of the scheduler with imported configs
  NestFactory.createApplicationContext(
    SchedulerModule.register({ ...dappConfig, ...networkConfig } as ConfigDTO),
  );
}

// bootstrap the scheduler
bootstrap();
