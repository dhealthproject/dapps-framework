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
import { DynamicModule, Logger, Module } from "@nestjs/common";

// internal dependencies
import { DappConfig } from "../common/models/DappConfig";
import { ScopeFactory } from "../common/ScopeFactory";
import { Schedulers } from "../common/Schedulers";

/**
 * @class WorkerModule
 * @description The module definition class for app's scheduler.
 * Each cronjobs will be imported based on input configuration values.
 *
 * @since v0.1.0
 */
@Module({})
export class WorkerModule {
  /**
   * {@link Logger} instance of this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new Logger(WorkerModule.name);

  /**
   * The main method to take config input, initialize and return an instance of the module.
   * All dependency imports are performed dynamically based on input values.
   *
   * @static
   * @param   {DappConfig}     configs   imported config
   * @returns {DynamicModule} instance of this module
   */
  static register(configs: DappConfig): DynamicModule {
    // filters out scopes that do not have schedulers registered
    // the `database` scope is ignored due to lack of schedulers
    const actualScopes = configs.scopes.filter(
      s => s !== "database" && s in Schedulers && Schedulers[s].length > 0
    );

    // print activation information of all scopes
    const scopesJSON = JSON.stringify(actualScopes, undefined, 2);
    WorkerModule.logger.debug(
      `Found schedulers to be registered in scopes: ${scopesJSON}`,
    );

    // get imports dynamically based on enabled scoped in the configuration
    const modules = ScopeFactory.create(configs).getSchedulers();
    return {
      module: WorkerModule,
      imports: modules,
    } as DynamicModule;
  }
}
