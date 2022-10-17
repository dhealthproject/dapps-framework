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
 * @label COMMON
 * @type DefaultNodePayload
 * @description This type consists of an URL anda publicKey that are used
 * to establish the connection and query info of the default node.
 * <br /><br />
 * @example Using the `DefaultNodePayload` type to configure nodes
 * ```ts
 *  // by default the URL can contain the schema and port
 *  const defaultNode = {
 *    url: "http://dual-02.dhealth.cloud:3000",
 *    publicKey: "613010BCE1FBF3CE1503DEF3003C76E451EA4DD9205FAD3530BFF7B1D78BC989"
 *  } as DefaultNodePayload;
 * ```
 *
 * @link NetworkConfig:COMMON
 * @since v0.3.0
 */
export type DefaultNodePayload = {
  url: string;
  publicKey: string;
};

/**
 * @label COMMON
 * @type NodeConnectionPayload
 * @description This type consists of an URL and an optional port
 * that are used to establish the connection with an operating
 * dHealth Network Node. Typically, this node connection payload
 * refers to a node by its URL with scheme, domain name and port.
 * <br /><br />
 * @example Using the `NodeConnectionPayload` type to configure nodes
 * ```ts
 * // by default the URL can contain the schema and port
 * const myNode1 = { url: "http://dual-02.dhealth.cloud:3000" } as NodeConnectionPayload;
 *
 * // or also, the port can be split in a separate field
 * const myNode2 = { url: "http://dual-02.dhealth.cloud", port: 3000 } as NodeConnectionPayload;
 * ```
 *
 * @link NetworkConfig:COMMON
 * @since v0.3.0
 */
export type NodeConnectionPayload = {
  url: string;
  port?: number | string;
};

/**
 * @label COMMON
 * @type NetworkParameters
 * @description This type consists of network parameters that are
 * necessary when trying to establish connection to an operating
 * node of dHealth Network.
 * <br /><br />
 * Important network connection parameters include the network type,
 * which can be MAIN_NET (104) or TEST_NET (152), a network identifier
 * that is used as a security against transaction replays, and some
 * other network related fields like it's starting epoch (UTC timestamp).
 * <br /><br />
 * @example Example network configuration object for dHealth Network
 * ```json
 * {
 *   namespaceName: "dhealth.dhp",
 *   mosaicId: "39E0C49FA322A459",
 *   namespaceId: "9D8930CDBB417337",
 *   divisibility: 6,
 *   networkIdentifier: 104,
 *   epochAdjustment: 1616978397,
 *   generationHash: "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
 * }
 * ```
 *
 * @link NetworkConfig:COMMON
 * @since v0.3.0
 */
export type NetworkParameters = {
  namespaceName: string;
  mosaicId: string;
  namespaceId: string;
  divisibility: number;
  networkIdentifier: number;
  epochAdjustment: number;
  generationHash: string;
};

/**
 * @label COMMON
 * @interface NetworkConfig
 * @description The dApp network configuration. This configuration
 * object is used to determine communication, transport and network
 * information.
 *
 * @link NetworkConfig:CONFIG
 * @since v0.2.0
 */
export interface NetworkConfig {
  /**
   * A default operation network node to connect to.
   * This configuration option uses the {@link DefaultNodePayload:COMMON}
   * type and consists of an URL and a publicKey that are used
   * to establish the connection and query info of the default node.
   * <br /><br />
   * Note that it is OK to use IP addresses rather than a domain
   * name in this configuration option.
   *
   * @example `"http://dual-02.dhealth.cloud:3000"`
   * @access public
   * @var {DefaultNodePayload}
   */
  defaultNode: DefaultNodePayload;

  /**
   * A list of operating network nodes that can be connected to.
   * This configuration option uses the {@link NodeConnectionPayload:COMMON}
   * type and consists of an URL and an optional port that are used
   * to establish the connection with the node.
   * <br /><br />
   * Note that it is OK to use IP addresses rather than a domain
   * name in this configuration option.
   *
   * @example `[ { "url": "http://dual-02.dhealth.cloud:3000", "port": 3000 } ]`
   * @access public
   * @var {NodeConnectionPayload}
   */
  apiNodes: NodeConnectionPayload[];

  /**
   * A network configuration object. This consists of parameters that
   * are necessary to connect to *operating nodes* on dHealth Network.
   * This configuration option uses the {@link NetworkParameters:COMMON}
   * type and consists of network connection parameters.
   * <br /><br />
   * Important network connection parameters include the network type,
   * which can be MAIN_NET (104) or TEST_NET (152), a network identifier
   * that is used as a security against transaction replays, and some
   * other network related fields like it's starting epoch (UTC timestamp).
   * <br /><br />
   * CAUTION: By modifying the content of this configuration field,
   * *changes* may occur for the dHealth Network connection and may
   * thereby affect the data loaded by the backend runtime.
   * <br /><br />
   * @example Example network configuration object for dHealth Network
   * ```json
   * {
   *   namespaceName: "dhealth.dhp",
   *   mosaicId: "39E0C49FA322A459",
   *   namespaceId: "9D8930CDBB417337",
   *   divisibility: 6,
   *   networkIdentifier: 104,
   *   epochAdjustment: 1616978397,
   *   generationHash: "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
   * }
   * ```
   *
   * @access public
   * @var {NetworkParameters}
   */
  network: NetworkParameters;
}
