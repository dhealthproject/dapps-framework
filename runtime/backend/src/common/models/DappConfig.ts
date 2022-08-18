/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import type { Scope } from "./Scope";
import { DatabaseConfig } from "./DatabaseConfig";
import { DiscoveryConfig } from "./DiscoveryConfig";

/**
 * @label COMMON
 * @interface DappConfig
 * @description The dApp configuration object. This configuration
 * object is used to determine general settings of this dApp runtime
 * including its' name, its main public key or scopes that are enabled
 * for the dApp in the backend runtime.
 * <br /><br />
 * This interface is mainly used **internally** to restrict the configuration
 * values provided to some modules or services and methods.
 *
 * @todo Allow for updated discovery sources configuration (must be backwards compatible).
 * @link DappConfig:CONFIG
 * @since v0.1.0
 */
export interface DappConfig {
  /**
   * A public name for the dApp. This name is used across module
   * implementations to describe the currently configured dApp.
   *
   * @access public
   * @var {string}
   */
  dappName: string;

  /**
   * A public key that identifies the dApp's main account. This
   * account *may* be used in scoped modules. It is recommended
   * that a dApp's public key refers to an account that is *not*
   * used in modules for doing payouts, etc.
   *
   * @access public
   * @var {string}
   */
  dappPublicKey: string;

  /**
   * An array of {@link Scope} that represents the enabled
   * scopes for the runtime. Each scope may execute several
   * modules, services and schedulers.
   * <br /><br />
   * A scope typically also defines **routes** and **DTOs** that
   * are published when the scope in enabled (opt-in).
   *
   * @access public
   * @var {Scope[]}
   */
  scopes: Scope[];

  /**
   * A database configuration object as defined in {@link DatabaseConfig}.
   * <br /><br />
   * Note that modifying the content of this configuration field
   * *changes* the database connection and may thereby affect the
   * data loaded by the backend runtime.
   *
   * @access public
   * @var {DatabaseConfig}
   */
  database: DatabaseConfig;

  /**
   * A configuration object related to the discovery module as defined
   * {@link DiscoveryConfig}.
   * <br /><br />
   * Note that modifying the content of this configuration field
   * *may slow down* the *synchronization process* of the backend
   * runtime.
   *
   * @access public
   * @var {DiscoveryConfig}
   */
  discovery?: DiscoveryConfig;
}
