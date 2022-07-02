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
import { Commands } from "../common/Commands";

/**
 * @class CLIModule
 * @description The module definition class for app's CLI.
 *
 * @since v0.1.0
 */
@Module({})
export class CLIModule {
  /**
   * {@link Logger} instance of this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new Logger(CLIModule.name);

  /**
   * The main method to take config input, initialize and return an instance of the module.
   * All dependency imports are performed dynamically based on input values.
   *
   * @static
   * @param   {DappConfig}     configs   imported config
   * @returns {DynamicModule} instance of this module
   */
  static register(configs: DappConfig): DynamicModule {
    // filters out scopes that do not have commands registered
    // the `database` scope is ignored due to lack of commands (for now)
    const actualScopes = configs.scopes.filter(
      s => s !== "database" && s in Commands && Commands[s].length > 0
    );

    // print activation information of all scopes
    const scopesJSON = JSON.stringify(actualScopes, undefined, 2);
    CLIModule.logger.debug(
      `Found commands to be registered in scopes: ${scopesJSON}`,
    );

    // get imports dynamically based on enabled scoped in the configuration
    const modules = ScopeFactory.create(configs).getCommands();
    return {
      module: CLIModule,
      imports: modules,
    } as DynamicModule;
  }
}
