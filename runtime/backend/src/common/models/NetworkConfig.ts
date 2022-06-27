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
 */
export type NodeParameters = {
  url: string,
  port: number,
};

/**
 * 
 */
export type NetworkParameters = {
  namespaceName: string,
  mosaicId: string,
  namespaceId: string,
  divisibility: string,
  networkIdentifier: number,
  epochAdjustment: number,
  generationHash: string,
};

/**
 * @interface NetworkConfig
 * @description This interface defines the required configuration of dApps
 * network connections.
 *
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
   * @var {NodeParameters}
   */
  apiNodes: NodeParameters[],

  /**
   * 
   *
   * @access public
   * @var {NetworkParameters}
   */
  network: NetworkParameters;
}
