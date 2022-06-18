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
import { StatefulModule } from "../../common/concerns/StatefulModule";
import { StateQuery } from "../../common/models/StateSchema";

/**
 * @class DiscoveryService
 * @description This class defines the abstraction layer used in
 * *any* discovery service. Note that discovery services are always
 * stateful modules due to the extension of {@link StatefulModule}.
 * <br /><br />
 * The protected `logger` property may be used to log information
 * to the configured logger instance and the protected `state`
 * property must be used to persist the state of the module.
 *
 * @abstract
 * @since v0.1.0
 */
export abstract class DiscoveryService extends StatefulModule {
  /**
   * The discovery source. In most cases this will be the host
   * dapp's main account public key.
   *
   * @access protected
   * @var {string}
   */
  protected discoverySource: string;

  /**
   * Getter for the discovery state identifier, e.g.
   * "discovery.accounts", "discovery.transactions",
   * "payout.outputs" etc.
   * <br /><br />
   * This method must be implemented by extended classes
   * to create the correct state query for this discovery
   * service.
   *
   * @see StatefulModule
   * @abstract
   * @access protected
   * @var {string}
   */
  public abstract get identifier(): string;

  /**
   * This method must be implemented by extending classes and
   * should discover relevant subjects for this module.
   *
   * @abstract
   * @access public
   * @async
   * @returns {Promise<DiscoveryService>}
   */
  public abstract discover(): Promise<DiscoveryService>;
}
