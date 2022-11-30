/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label CONFIG
 * @module DappConfig
 * @description The dApp configuration object. This configuration
 * object is used to determine general settings of this dApp runtime
 * including its' name, its main public key or scopes that are enabled
 * for the dApp in the backend runtime. This includes, as listed below:
 * <br /><br />
 * - Which **scopes** must be enabled in the backend. This permits
 *   to enable scopes as listed in {@link Scope:COMMON}, e.g. you
 *   can disable the `discovery` scope if you don't need to track
 *   transactions on dHealth Network.
 * - How to connect to the main database of this dApp. This field
 *   can be used to configure and secure the access to the mongo
 *   database that is used as a caching system for the dApp.
 * - General information about a dApp, such as its friendly name,
 *   the public key that can be used to verify transactions signed
 *   by the dApp, and other general dApp information.
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the database connection and may thereby
 * affect the data loaded by the backend runtime.
 *
 * @since v0.3.0
 */
export default () => ({
  /**
   * A public name for the dApp. This name is used across module
   * implementations to describe the currently configured dApp.
   *
   * @example `"ELEVATE"`
   * @var {string}
   */
  dappName: "ELEVATE",

  /**
   * A public key that identifies the dApp's main account. This
   * account *may* be used in scoped modules. It is recommended
   * that a dApp's public key refers to an account that is *not*
   * used in modules for doing payouts.
   * <br /><br />
   * The example public key added below maps to an account with
   * the address: `"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"`
   *
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
   * @var {string}
   */
  dappPublicKey: process.env.MAIN_PUBLIC_KEY,

  /**
   * An array of {@link Scope:COMMON} that represents the enabled
   * scopes for the runtime. Each scope may execute several
   * modules, services and schedulers.
   * <br /><br />
   * A scope typically also defines **routes** and **DTOs** that
   * are published when the scope in enabled (opt-in).
   *
   * @example `["database", "discovery"]`
   * @var {Scope[]}
   */
  scopes: [
    "database",
    "discovery",
    "payout",
    "processor",
    "notifier",
    "statistics",
    "oauth",
  ],

  /**
   * A database configuration object as defined in {@link DatabaseConfig}.
   * <br /><br />
   * Note that modifying the content of this configuration field
   * *changes* the database connection and may thereby affect the
   * data loaded by the backend runtime.
   *
   * @example `{ host: "a.b.c", port: 1234, name: "dbname", user: "root"}`
   * @var {DatabaseConfig}
   */
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
  },

  /**
   * A *Front-end App* configuration object. This property is mainly
   * used to configure the access to the backend or restrict requests
   * that are issued to it.
   *
   * @example `{ url: "http://a.b.c:1234", host: "a.b.c", port: 1234, https: false}`
   * @access public
   * @var {AppConnectionPayload}
   */
  frontendApp: {
    url: process.env.FRONTEND_URL,
    host: process.env.FRONTEND_DOMAIN,
    port: process.env.FRONTEND_PORT,
    https: process.env.FRONTEND_USE_HTTPS === "true"
  },

  /**
   * A *Backend-end App* configuration object. This property is mainly
   * used to configure the generation OpenAPI specification.
   *
   * @example `{ url: "http://a.b.c:1234", host: "a.b.c", port: 1234, https: false}`
   * @access public
   * @var {AppConnectionPayload}
   */
  backendApp: {
    url: process.env.BACKEND_URL,
    host: process.env.BACKEND_DOMAIN,
    port: process.env.BACKEND_PORT,
    https: process.env.BACKEND_USE_HTTPS === "true"
  },

  /**
   * A configuration object related to the discovery module as defined
   * {@link DiscoveryConfig}.
   * <br /><br />
   * Note that modifying the content of this configuration field
   * *may slow down* the *synchronization process* of the backend
   * runtime.
   *
   * @see DiscoveryConfig
   * @var {DiscoveryConfig}
   */
  discovery: {
    /**
     * An array of discovery sources as defined in {@link DiscoveryConfig}.
     * <br /><br />
     * Note that modifying the content of this configuration field
     * *may slow down* the *synchronization process* of the backend
     * runtime.
     *
     * @access public
     * @var {DiscoveryConfig}
     */
    sources: [
      process.env.MAIN_ADDRESS,
      process.env.PAYOUT_CONTRACT_ADDRESS,
      process.env.SECURITY_AUTH_REGISTRIES_ADDRESS_1,
    ],
  }
});
