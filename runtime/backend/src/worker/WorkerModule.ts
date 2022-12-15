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
import { DappConfig } from "../common/models/DappConfig";
import { ScopeFactory } from "../common/ScopeFactory";
import { Schedulers } from "../common/Schedulers";
import { LogService } from "../common/services/LogService";
import { AppConfiguration } from "../AppConfiguration";
import { AbstractAppModule } from "../common/modules/AbstractAppModule";

/**
 * @label SCOPES
 * @class WorkerModule
 * @description The module definition class for app's scheduler.
 * Each cronjobs will be imported based on input configuration values.
 *
 * @since v0.1.0
 */
@Module({})
export class WorkerModule extends AbstractAppModule {
  /**
   * {@link LogService} instance of this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new LogService(
    AppConfiguration.dappName + "/worker",
  );

  /**
   * The main method to take config input, initialize and return an instance of the module.
   * All dependency imports are performed dynamically based on input values.
   *
   * @static
   * @param   {DappConfig}     configs   imported config
   * @returns {AbstractAppModule} instance of this module
   */
  static register(configs: DappConfig): AbstractAppModule {
    // filters out scopes that do not have schedulers registered
    // the `database` scope is ignored due to lack of schedulers
    const actualScopes = configs.scopes.filter(
      (s) => s !== "database" && s in Schedulers && Schedulers[s].length > 0,
    );

    // print activation information of all scopes
    const scopesJSON = JSON.stringify(actualScopes, undefined, 2);
    WorkerModule.logger.log(
      `Found schedulers to be registered in scopes: ${scopesJSON}`,
    );

    // get imports dynamically based on enabled scoped in the configuration
    const modules = ScopeFactory.create(configs).getSchedulers();
    return {
      module: WorkerModule,
      imports: modules,
    } as AbstractAppModule;
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
