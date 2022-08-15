/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 *
 * @todo Add relevant type documentation
 */
export type NodeConnectionPayload = {
  url: string,
  port?: number | string,
};

/**
 *
 * @todo Add relevant type documentation
 */
export type NetworkParameters = {
  namespaceName: string,
  mosaicId: string,
  namespaceId: string,
  divisibility: number,
  networkIdentifier: number,
  epochAdjustment: number,
  generationHash: string,
};

/**
 * @interface NetworkConfig
 * @description This interface defines the required configuration of dApps
 * network connections.
 *
 * @todo Add relevant property documentation for {@link defaultNode}
 * @todo Add relevant property documentation for {@link apiNodes}
 * @todo Add relevant property documentation for {@link network}
 * @since v0.2.0
 */
export interface NetworkConfig {
  /**
   *
   *
   * @access public
   * @var {string}
   */
  defaultNode: string;

  /**
   *
   *
   * @access public
   * @var {NodeConnectionPayload}
   */
  apiNodes: NodeConnectionPayload[],

  /**
   *
   *
   * @access public
   * @var {NetworkParameters}
   */
  network: NetworkParameters;
}
