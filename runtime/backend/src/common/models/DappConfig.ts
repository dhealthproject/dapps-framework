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
 * @type AppConnectionPayload
 * @description This type consists of an URL, a host, a port and a
 * flag to enable/disable HTTPS. This type is used to establish a
 * connection to *the frontend* or *the backend* **apps** from the
 * outside of the hosting network ("public internet").
 * <br /><br />
 * @example Using the `AppConnectionPayload` type to configure apps
 * ```ts
 * const myFrontend = {
 *   url: "http://elevate.dhealth.cloud:8080",
 *   host: "elevate.dhealth.cloud",
 *   port: 8080,
 *   https: false
 * } as AppConnectionPayload;
 * ```
 *
 * @link DappConfig:COMMON
 * @since v0.3.0
 */
export type AppConnectionPayload = {
  url: string;
  host: string;
  port: string | number;
  https: boolean;
};

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
   * @example `"ELEVATE"`
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
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
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
   * @example `["database", "discovery"]`
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
   * @example `{ host: "a.b.c", port: 1234, name: "dbname", user: "root"}`
   * @access public
   * @var {DatabaseConfig}
   */
  database: DatabaseConfig;

  /**
   * A *Front-end App* configuration object. This property is mainly
   * used to configure the access to the backend or restrict requests
   * that are issued to it.
   *
   * @example `{ url: "http://a.b.c:1234", host: "a.b.c", port: 1234, https: false}`
   * @access public
   * @var {AppConnectionPayload}
   */
  frontendApp: AppConnectionPayload;

  /**
   * A *Backend-end App* configuration object. This property is mainly
   * used to configure the generation OpenAPI specification.
   *
   * @example `{ url: "http://a.b.c:1234", host: "a.b.c", port: 1234, https: false}`
   * @access public
   * @var {AppConnectionPayload}
   */
  backendApp: AppConnectionPayload;

  /**
   * A configuration object related to the discovery module as defined
   * {@link DiscoveryConfig}.
   * <br /><br />
   * Note that modifying the content of this configuration field
   * *may slow down* the *synchronization process* of the backend
   * runtime.
   *
   * @see DiscoveryConfig
   * @access public
   * @var {DiscoveryConfig}
   */
  discovery?: DiscoveryConfig;
}
