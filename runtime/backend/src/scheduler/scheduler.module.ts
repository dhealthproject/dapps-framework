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
import { DynamicModule, Logger, Module } from '@nestjs/common';

// internal dependencies
import { ConfigDTO } from 'src/common/models';
import { Imports } from 'src/common/infrastructures';

/**
 * @class SchedulerModule
 * @description The module definition class for app's scheduler.
 * Each cronjobs will be imported based on input configuration values.
 *
 * @since v0.1.0
 */
@Module({})
export class SchedulerModule {
  /**
   * {@link Logger} instance of this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new Logger(SchedulerModule.name);

  /**
   * The main method to take config input, initialize and return an instance of the module.
   * All dependency imports are performed dynamically based on input values.
   *
   * @static
   * @param   {ConfigDTO}     configs   imported config
   * @returns {DynamicModule} instance of this module
   */
  static register(configs: ConfigDTO): DynamicModule {
    // print activation information of all cron modules.
    SchedulerModule.logger.debug(
      `Enabled cronjobs: ${JSON.stringify(configs.schedulerModules, null, 2)}`,
    );
    // get imports dynamically based on configs values.
    const imports = Imports.getImports(configs, true);
    return {
      module: SchedulerModule,
      imports,
    } as DynamicModule;
  }
}
