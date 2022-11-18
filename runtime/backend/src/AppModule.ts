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
import { DynamicModule, Module } from "@nestjs/common";

// internal dependencies
import { AuthModule } from "./common/modules/AuthModule";
import { AccountsModule } from "./common/modules/AccountsModule";
import { ChallengesModule } from "./common/modules/ChallengesModule";
import { AppController } from "./AppController";
import { AppService } from "./AppService";
import { ScopeFactory } from "./common/ScopeFactory";
import { DappConfig } from "./common/models/DappConfig";
import { AppConfiguration } from "./AppConfiguration";
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
   * {@link LogService} instance for this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new LogService(dappConfigLoader().dappName);

  /**
   * This method initializes application modules around a {@link DappConfig}
   * configuration object. We use {@link DynamicModule} from nest to register
   * modules in the main (root) application module.
   * <br /><br />
   * Note that the `AppModule` itself injects some modules as well including
   * {@link AccountsModule:DISCOVERY}, {@link AuthModule:COMMON} and {@link ChallengesModule:COMMON}
   * which are necessary to the good functioning of the backend runtime.
   * <br /><br />
   * All other dependency injections are performed dynamically based on the
   * configuration object.
   *
   * @access public
   * @static
   * @param   {DappConfig}     configs   imported config
   * @returns {DynamicModule} instance of this module
   */
  public static register(configs: DappConfig): DynamicModule {
    // print activation information of all scopes
    AppModule.logger.log(
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

  /**
   * This method validates the dApp configuration object. It uses
   * the {@link AppConfiguration} class to perform validations of
   * all configuration fields that are used in this runtime.
   * <br /><br />
   * Note that this method will create an instance of the external
   * {@link MongooseModule} to perform a validation of connectivity
   * with the database.
   *
   * @access public
   * @static
   * @returns {void}    Returns blank given correct configuration.
   * @throws {ConfigurationError}   Given any error in configuration of the dApp.
   */
  public static checkConfiguration(): void {
    // interprets/initializes configuration
    const config = new AppConfiguration();

    // (1) verify the instance configuration fields
    AppConfiguration.checkMandatoryFields(config);

    // (2) verify the instance database connectivity
    AppConfiguration.checkDatabaseConnection(config);

    // (3) verify the instance network connectivity
    AppConfiguration.checkNetworkConnection(config);

    // (4) verify the instance assets configuration
    AppConfiguration.checkMandatoryAssets(config);

    // (5) verify the instance security configuration
    AppConfiguration.checkSecuritySettings(config);

    // (6) verify the instance scoped configurations
    AppConfiguration.checkApplicationScopes(config);
  }
}
