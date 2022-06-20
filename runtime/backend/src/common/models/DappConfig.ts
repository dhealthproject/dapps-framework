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

/**
 * @interface DappConfig
 * @description This interface defines the required configuration of dApps
 * that use this software runtime. Notable fields in the configuration of
 * a custom dApp include its {@link dappPublicKey} and {@link scopes} which
 * are used to determine which modules are enabled and running for a dApp.
 * <br /><br />
 * This interface is mainly used **internally** to restrict the configuration
 * values provided to some modules or services and methods.
 *
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
   * The default network node to connect to for gathering
   * information on the blockchain network. If the default
   * node does not respond, the software will use {@link apiNodes}
   * instead.
   *
   * @access public
   * @var {string|undefined}
   */
  defaultNode?: string;
}
