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
import { ConfigModule } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';

// internal dependencies
import { ConfigDTO } from '../models';
import { ModuleImports } from './module-imports';
import { ScopeImports } from './scope-imports';

/**
 * @class Imports
 * @description Class that contains methods to get scope/module imports dynamically.
 *
 * @since v0.1.0
 */
export class Imports {
  /**
   * Instance of {@link ConfigDTO} that will be used to initialize {@link ConfigModule}.
   *
   * @static
   * @var {@link ConfigDTO}
   */
  static configDTO: ConfigDTO;

  /**
   * Method to get scope/module imports dynamically.
   *
   * @static
   * @param   {ConfigDTO}  configs
   * @param   {boolean}  scheduler
   * @returns {DynamicModule[]}
   */
  static getImports(
    configs: ConfigDTO,
    scheduler?: boolean,
  ): Array<DynamicModule> {
    Imports.configDTO = configs;
    const imports = [
      ConfigModule.forRoot({
        load: [Imports.getConfigFunction],
        isGlobal: true,
      }),
    ];
    // If for scopes
    if (!scheduler) {
      const scopes = configs.scopes;
      for (const scope in scopes) {
        if (scopes[scope] && ScopeImports[scope])
          imports.push(ScopeImports[scope]);
      }
      // If for schedulers
    } else {
      imports.push(ModuleImports.MongooseModule);
      const modules = configs.schedulerModules;
      for (const module in modules) {
        if (modules[module] && ModuleImports[module])
          imports.push(ModuleImports[module]);
      }
    }
    return imports;
  }

  /**
   * Method to return stored instance of {@link ConfigDTO}.
   *
   * @static
   * @returns {ConfigDTO}
   */
  static getConfigFunction = (): ConfigDTO => {
    return Imports.configDTO;
  };
}
