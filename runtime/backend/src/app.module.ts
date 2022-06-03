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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Imports } from './common/infrastructures';
import { ConfigDTO } from './common/models';

/**
 * @class AppModule
 * @description The main module definition for the app.
 *
 * @since v0.1.0
 */
@Module({})
export class AppModule {
  /**
   * {@link Logger} instance for this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new Logger(AppModule.name);

  /**
   * The main method to take config input, initialize and return an instance of the module.
   * All dependency imports are performed dynamically based on input values.
   *
   * @static
   * @param   {ConfigDTO}     configs   imported config
   * @returns {DynamicModule} instance of this module
   */
  static register(configs: ConfigDTO): DynamicModule {
    // print activation information of all scopes.
    AppModule.logger.debug(
      `Enabled scopes: ${JSON.stringify(configs.scopes, null, 2)}`,
    );
    // get imports dynamically based on configs values.
    const imports = Imports.getImports(configs);
    return {
      module: AppModule,
      imports,
      controllers: [AppController],
      providers: [AppService],
    } as DynamicModule;
  }
}
