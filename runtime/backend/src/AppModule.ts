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

// configuration resources
import dappConfigLoader from "../config/dapp";

/**
 * @class AppModule
 * @description The main module definition for the app.
 * <br /><br />
 * By default, the app automatically injects modules
 * such as {@link AuthModule:COMMON}, {@link AccountsModule:COMMON}
 * and {@link ChallengesModule:COMMON} as these are
 * necessary to handle common dApp use cases such as
 * for example log-in operations.
 *
 * @since v0.1.0
 */
@Module({
  imports: [AuthModule, AccountsModule, ChallengesModule],
})
export class AppModule {
  /**
   * {@link Logger} instance for this class.
   *
   * @access private
   * @static
   * @readonly
   */
  private static readonly logger = new Logger(dappConfigLoader().dappName);

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
