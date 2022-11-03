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
import { ConfigModule } from "@nestjs/config";
import { DynamicModule } from "@nestjs/common";

// internal dependencies
import type { Scope } from "./models/Scope";
import { DappConfig } from "./models/DappConfig";
import { Scopes } from "./Scopes";
import { Schedulers } from "./Schedulers";

// configuration resources
import dappConfigLoader from "../../config/dapp";
import networkConfigLoader from "../../config/network";
import securityConfigLoader from "../../config/security";
import processorConfigLoader from "../../config/processor";
import oauthConfigLoader from "../../config/oauth";
import assetsConfigLoader from "../../config/assets";
import statisticsConfigLoader from "../../config/statistics";
import monitoringConfigLoader from "../../config/monitoring";
import transportConfigLoader from "../../config/transport";

/**
 * @label COMMON
 * @class ScopeFactory
 * @description Singleton class that serves as a helper to aggregate
 * and dynamically configure nest module imports. A differentiation is
 * done around **scoped**- and **scheduler** imports. In fact, the
 * configuration of the dApp may **enable** (opt-in) specific *scopes*
 * and *schedulers*.
 * <br /><br />
 *
 * @since v0.1.0
 */
export class ScopeFactory {
  /**
   * The singleton instance. This instance is created once
   * per process and will be re-used afterwards.
   *
   * @access protected
   * @static
   * @var {ScopeFactory}
   */
  protected static $_INSTANCE: ScopeFactory = null;

  /**
   * The imports that are *always* returned. This includes currently
   * only the `ConfigModule` that is available with nest. The module
   * is automatically initialized with the {@link DappConfig} object.
   * <br /><br />
   * Base imports consist in imports that are used with both types of
   * processes: scoped modules and scheduler modules.
   *
   * @access private
   * @var {DynamicModule[]}
   */
  private baseImports: DynamicModule[] = [];

  /**
   * Constructs an imports factory around a {@link DappConfig} configuration
   * object. The resulting *imports* differ depending on the `scopes` field
   * in the configuration as well as the `scheduler` field, for cronjobs.
   * <br /><br />
   * Note that this constructor is private to *prevent* the instanciation of
   * multiple instances of this class. Use the {@link ScopeFactory.create} method
   * to create the instance once.
   *
   * @access protected
   * @param {DappConfig}   dappConfig   An instance of {@link DappConfig} that will be used to initialize {@link ConfigModule}.
   */
  protected constructor(private readonly dappConfig: DappConfig) {
    // configure the base imports with a `DappConfig`
    this.baseImports = [
      ConfigModule.forRoot({
        load: [
          dappConfigLoader,
          networkConfigLoader,
          securityConfigLoader,
          processorConfigLoader,
          oauthConfigLoader,
          assetsConfigLoader,
          statisticsConfigLoader,
          monitoringConfigLoader,
          transportConfigLoader,
        ],
        isGlobal: true,
        envFilePath: [".env", ".env-sample"],
      }),
    ];
  }

  /**
   * Creates an imports factory around a {@link DappConfig} configuration
   * object. This class is intended to be used with the *singleton* pattern
   * and thereby authorizes the creation of only one class instance per
   * running process.
   *
   * @access public
   * @static
   * @param {DappConfig}   DappConfig   An instance of {@link DappConfig} that will be used to initialize {@link ConfigModule}.
   * @returns {ScopeFactory}  The singleton instance of the class configured around a {@link DappConfig}.
   */
  static create(dappConfig: DappConfig): ScopeFactory {
    // JiT creation
    if (ScopeFactory.$_INSTANCE === null) {
      ScopeFactory.$_INSTANCE = new ScopeFactory(dappConfig);
    }

    // returns always the instance
    return ScopeFactory.$_INSTANCE;
  }

  /**
   * Returns an array of nest `DynamicModule` that are enabled
   * (opt-in) through the dApp configuration with the field
   * named `scopes` (config/dapp.json).
   * <br /><br />
   * i.e. if you *enable* the `discovery` scope by setting
   * `"scopes": ["discovery"]` in your config/dapp.json, this
   * method will return the {@link DiscoveryModule}.
   * <br /><br />
   * Note that this method returns only {@link Scopes}
   * modules.
   *
   * @static
   * @returns {DynamicModule[]}   A list of dynamic modules that are *enabled* as modules.
   */
  public getModules(): DynamicModule[] {
    // reads *enabled* scopes (opt-in)
    const scopes: Scope[] = this.dappConfig.scopes;

    // concatenates `Scopes` that are *enabled* (opt-in)
    // through the dApp configuration's `scopes` field.
    // Note: does **not** modify {@link baseImports}.
    return this.baseImports.concat(
      scopes.filter((s) => s in Scopes).map((s) => Scopes[s]),
    );
  }

  /**
   * Returns an array of nest `DynamicModule` that are enabled
   * (opt-in) through the dApp configuration with the field
   * named `scopes` (config/dapp.json). This method returns all
   * **cronjobs** (schedulers / commands) that must be registered
   * for a given scope.
   * <br /><br />
   * i.e. if you *enable* the `discovery` scope by setting
   * `"scopes": ["discovery"]` in your config/dapp.json, this
   * method will register the {@link AccountsModule} and the
   * {@link DiscoverAccountsCommand}.
   * <br /><br />
   * Note that this method returns only {@link Schedulers}
   * modules.
   *
   * @static
   * @returns {DynamicModule[]}   A list of dynamic modules that are *enabled* as schedulers.
   */
  public getSchedulers(): DynamicModule[] {
    // reads *enabled* scopes (opt-in)
    const scopes: Scope[] = this.dappConfig.scopes;

    // in **cronjobs** the database is always added
    // in addition to the configuration module.
    // Note: does **not** modify {@link baseImports}.
    const requiredImports = this.baseImports.concat(Schedulers["database"]);

    // reads *all* enabled schedulers, note here that
    // each scope may define an *array* of schedulers
    const schedulerImports = scopes
      .filter((s) => s !== "database" && s in Schedulers)
      .map((s) => Schedulers[s]);

    // concatenates `Schedulers` that are *enabled* (opt-in)
    // through the dApp configuration's `scopes` field.
    return requiredImports.concat(
      schedulerImports.reduce((prev, cur) => prev.concat([...cur]), []),
    );
  }
}
