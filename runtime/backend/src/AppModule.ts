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
import { AuthModule } from "./common/modules/AuthModule";
import { AccountsModule } from "./common/modules/AccountsModule";
import { ChallengesModule } from "./common/modules/ChallengesModule";
import { AppController } from "./AppController";
import { AppService } from "./AppService";
import { ScopeFactory } from "./common/ScopeFactory";
import { DappConfig } from "./common/models/DappConfig";
import { LogService } from "./common/services/LogService";

// configuration resources
import dappConfigLoader from "../config/dapp";

/**
 * @class AppModule
 * @description The main module definition for the app. This module injects
 * dependencies that are required for the *common scope* and enables some
 * API endpoints as described below.
 * <br /><br />
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link AccountsModule:COMMON} | `accounts` | `/accounts` | Module with schedulers, collections and routes around **dApp accounts**. |
 * | {@link AuthModule:COMMON} | N/A | `/auth` | Module with schedulers, collections and routes around **dApp authentication**. |
 * | {@link ChallengesModule:COMMON} | `authchallenges` | `/auth/challenge` | Module with schedulers, collections and routes around **authentication challenges**. |
 *
 * @since v0.1.0
 */
@Module({
  imports: [AccountsModule, AuthModule, ChallengesModule],
})
export class AppModule {
  /**
   * {@link Logger} instance for this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new LogService(dappConfigLoader().dappName);

  /**
   * The main method to take config input, initialize and return an instance of the module.
   * All dependency imports are performed dynamically based on input values.
   *
   * @static
   * @param   {DappConfig}     configs   imported config
   * @returns {DynamicModule} instance of this module
   */
  static register(configs: DappConfig): DynamicModule {
    // print activation information of all scopes
    AppModule.logger.debug(
      `Enabled scopes: ${JSON.stringify(configs.scopes, undefined, 2)}`,
    );

    // get imports dynamically based on enabled scopes in the configuration
    const modules = ScopeFactory.create(configs).getModules();
    return {
      module: AppModule,
      imports: modules,
      controllers: [AppController],
      providers: [AppService],
    } as DynamicModule;
  }
}
