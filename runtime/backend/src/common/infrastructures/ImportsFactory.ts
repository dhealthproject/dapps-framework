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
import { ConfigDTO, CronJob, Scope } from '../models';
import { SharedImports } from './SharedImports';
import { ScopeImports } from './ScopeImports';

/**
 * @class ImportsFactory
 * @description Singleton class that serves as a helper to aggregate
 * and dynamically configure nest module imports. A differentiation is
 * done around **scoped**- and **scheduler** imports. In fact, the
 * configuration of the dApp may **enable** (opt-in) specific *scopes*
 * and *schedulers*.
 * <br /><br />
 * 
 *
 * @since v0.1.0
 */
export class ImportsFactory {
  /**
   * The singleton instance. This instance is created once
   * per process and will be re-used afterwards.
   *
   * @access protected
   * @static
   * @var {ImportsFactory}
   */
  protected static $_INSTANCE: ImportsFactory = null;

  /**
   * The imports that are *always* returned. This includes currently
   * only the `ConfigModule` that is available with nest. The module
   * is automatically initialized with the {@link ConfigDTO} object.
   * <br /><br />
   * Base imports consist in imports that are used with both types of
   * processes: scoped modules and scheduler modules.
   *
   * @access private
   * @var {DynamicModule[]}
   */
  private baseImports: DynamicModule[] = [];

  /**
   * Constructs an imports factory around a {@link ConfigDTO} configuration
   * object. The resulting *imports* differ depending on the `scopes` field
   * in the configuration as well as the `scheduler` field, for cronjobs.
   * <br /><br />
   * Note that this constructor is private to *prevent* the instanciation of
   * multiple instances of this class. Use the {@link ImportsFactory.create} method
   * to create the instance once.
   *
   * @access protected
   * @param {ConfigDTO}   configDTO   An instance of {@link ConfigDTO} that will be used to initialize {@link ConfigModule}.
   */
  protected constructor(private readonly configDTO: ConfigDTO) {
    // configure the base imports with a `ConfigDTO`
    this.baseImports = [
      ConfigModule.forRoot({
        load: [(): ConfigDTO => this.configDTO],
        isGlobal: true,
      }),
    ];
  }

  /**
   * Creates an imports factory around a {@link ConfigDTO} configuration
   * object. This class is intended to be used with the *singleton* pattern
   * and thereby authorizes the creation of only one class instance per 
   * running process.
   *
   * @access public
   * @static
   * @param {ConfigDTO}   configDTO   An instance of {@link ConfigDTO} that will be used to initialize {@link ConfigModule}.
   * @returns {ImportsFactory}  The singleton instance of the class configured around a {@link ConfigDTO}.
   */
  static create(configDTO: ConfigDTO): ImportsFactory {
    // JiT creation
    if (ImportsFactory.$_INSTANCE === null) {
      ImportsFactory.$_INSTANCE = new ImportsFactory(configDTO);
    }

    // returns always the instance
    return ImportsFactory.$_INSTANCE;
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
   * Note that this method returns only {@link ScopeImports}
   * modules.
   *
   * @static
   * @returns {DynamicModule[]}   A list of dynamic modules that are *enabled*.
   */
  public getScopedImports(): DynamicModule[] {
    // reads *enabled* scopes (opt-in)
    const scopes: Scope[] = this.configDTO.scopes;

    // concatenates `ScopeImports` that are *enabled* (opt-in)
    // through the dApp configuration's `scopes` field.
    return this.baseImports.concat(
      scopes
        .filter(s => s in ScopeImports)
        .map(s => ScopeImports[s] )
    );
  }

  /**
   * Returns an array of nest `DynamicModule` that are enabled
   * (opt-in) through the dApp configuration with the field
   * named `schedulers` (config/dapp.json). These modules refer
   * to **cronjobs** (or "schedulers") that run in a *separate*
   * (parallel) background process.
   * <br /><br />
   * i.e. if you *enable* the `accountsDiscovery` cronjob by setting
   * `"schedulers": ["accountsDiscovery"]` in your config/dapp.json,
   * this method will return the {@link AccountsDiscoveryModule}.
   * <br /><br />
   * Note that this method returns only {@link SharedImports}
   * modules.
   *
   * @static
   * @returns {DynamicModule[]}   A list of dynamic modules that are *enabled*.
   */
  public getSchedulerImports(): DynamicModule[] {
    // reads *enabled* schedulers (opt-in)
    const schedulers: CronJob[] = this.configDTO.schedulers;

    // concatenates `SharedImports` that are *enabled* (opt-in)
    // through the dApp configuration's `schedulers` field.
    return this.baseImports.concat(
      SharedImports.mongoose,
      schedulers
        .filter(s => s in SharedImports)
        .map(s => SharedImports[s] )
    );
  }
}
