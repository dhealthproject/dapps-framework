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
 * @module NetworkConfig
 * @description The dApp network configuration. This configuration
 * object is used to determine communication, transport and network
 * information as listed below:
 * <br /><br />
 * - A **default connected node** identifies the *default network
 *   node* that must be used for direct requests from the backend
 *   to an operating node on dHealth Network.
 * - Additional validators of the dHealth Network, that are used
 *   alternatively to the *default node*. Importantly, these nodes
 *   *relay the same information* as the default node.
 * - Network configuration properties that are related to dHealth
 *   Network's protocol such as: the divisibility of the network's
 *   main asset (`dhealth.dhp`), the type of network and network
 *   starting epoch and last but not least, the network identifier.
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the dHealth Network connection and may
 * thereby affect the data loaded by the backend runtime.
 *
 * @since v0.3.0
 */
export default () => ({
  /**
   * A default operating network node to connect to. This must be
   * a URL that contains a schema and a port, which identifies the
   * node and where it is operating.
   * <br /><br />
   * Note that it is OK to use IP addresses rather than a domain
   * name in this configuration option.
   *
   * @example `{
   *    url: "http://dual-02.dhealth.cloud:3000",
   *    publicKey: "613010BCE1FBF3CE1503DEF3003C76E451EA4DD9205FAD3530BFF7B1D78BC989"
   * }`
   * @var {string}
   */
  defaultNode: {
    url: "http://dual-02.dhealth.cloud:3000",
    publicKey: "613010BCE1FBF3CE1503DEF3003C76E451EA4DD9205FAD3530BFF7B1D78BC989"
  },

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
   * 
   * @link NodeConnectionPayload:COMMON
   * @var {NodeConnectionPayload[]}
   */
  apiNodes: [
    { "url": "http://dual-01.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://dual-02.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://dual-03.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://api-01.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://api-02.dhealth.cloud:3000", "port": 3000 }
  ],

  /**
   * The `network-api` url. This is the url to the currently running
   * `network-api` instance.
   * <br /><br />
   * The dHealth network api is an open api that allows network
   * monitoring and statistics measurement on dHealth blockchain.
   * <br /><br />
   * @see https://docs.dhealth.com/reference/open-source-software#dhealth-network-api
   *
   * @example `"http://peers.dhealth.cloud:7903"`
   * @var {string}
   */
  networkApi: "http://peers.dhealth.cloud:7903",

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
   * @link NetworkParameters:COMMON
   * @var {NetworkParameters}
   */
  network: {
    /**
     * The namespace name that is used to identify dHealth Network's
     * **currency asset**. The *currency asset* is used to pay fees
     * when sending transactions.
     *
     * @example `"dhealth.dhp"`
     * @var {string}
     */
    namespaceName: "dhealth.dhp",

    /**
     * The mosaic Id that is used to identify dHealth Network's
     * **currency asset**. The *currency asset* is used to pay fees
     * when sending transactions.
     *
     * @example `"39E0C49FA322A459"`
     * @var {string}
     */
    mosaicId: "39E0C49FA322A459",

    /**
     * The namespace Id that is used to identify dHealth Network's
     * **currency asset**. The *currency asset* is used to pay fees
     * when sending transactions.
     *
     * @example `"9D8930CDBB417337"`
     * @var {string}
     */
    namespaceId: "9D8930CDBB417337",

    /**
     * The divisibility of dHealth Network's **currency asset**.
     * The *currency asset* is used to pay fees when sending
     * transactions.
     *
     * @example `6`
     * @var {number}
     */
    divisibility: 6,

    /**
     * The network identifier number of dHealth. This network type
     * can be MAIN_NET (104) or TEST_NET (152), a network identifier
     * that is used as a security against transaction replays.
     *
     * @example `104`
     * @var {number}
     */
    networkIdentifier: 104,

    /**
     * The dHealth Network's starting epoch (UTC timestamp).
     * This is used to convert network timestamp to UTC timestamp and vice versa.
     *
     * @example `123456`
     * @var {number}
     */
    epochAdjustment: 1616978397,

    /**
     * The dHealth Network's generation hash. This is used to validate whether the
     * current connected network is the correct network.
     *
     * @example "1234567890ABC"
     * @var {string}
     */
    generationHash: "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
  }
});
