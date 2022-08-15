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
import {
  BlockRepository,
  ChainRepository,
  Currency,
  MosaicId,
  NetworkCurrencies,
  NodeHealth,
  NodeRepository,
  RepositoryFactoryHttp,
  RepositoryFactoryConfig,
  TransactionRepository,
  UInt64,
} from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * @type NetworkConnectionPayload
 * @description This type encapsulates parameters that can be
 * used when connecting to a dHealth Network node. Configuring
 * the connection object (repository factory) permits to avoid
 * extra node requests to be issued *before* connection can be
 * established.
 *
 * @since v0.1.0
 */
export type NetworkConnectionPayload = {
  nodePublicKey?: string;
  generationHash: string;
  epochAdjustment: number;
  networkIdentifier: number;
  networkCurrencies: NetworkCurrencies;
};

/**
 * 
 */
export type NodeConnectionPayload = {
  url: string,
  port?: number | string,
};

/**
 * @class NetworkService
 * @description This class serves as a *connection handler* for nodes
 * on dHealth Network. It uses a node's [REST](https://docs.dhealth.com/reference/rest-gateway) interface
 * to fetch data directly from the node.
 * <br /><br />
 * Note that the connection is done **upon instanciation**. A possible
 * refactor of this class may move this process such that the connection
 * adapter is not *always* considered "connected", as is currently the
 * case.
 *
 * @todo Potentially add `nodePublicKey` to network configuration (for default node).
 * @todo Move method {@link getBlockTimestamp} to helpers/formatters concern.
 * @todo Move method {@link getNetworkTimestampFromUInt64} to helpers/formatters concern.
 * @since v0.1.0
 */
@Injectable()
export class NetworkService {
  /**
   * The currently connected node.
   *
   * @access protected
   * @var {NodeConnectionPayload}
   */
  protected currentNode: NodeConnectionPayload;

  /**
   * The information related to the connected network.
   * This is necessary to connect to other nodes of the
   * network.
   *
   * @access protected
   * @var {NetworkConnectionPayload}
   */
  protected currentNetwork: NetworkConnectionPayload;

  /**
   * The repository factory used to communicate with the
   * connected node's REST interface.
   *
   * @access protected
   * @var {RepositoryFactoryHttp}
   */
  protected repositoryFactoryHttp: RepositoryFactoryHttp;

  /**
   * The transaction repository that permits to execute REST
   * requests on the `/transaction` namespace.
   *
   * @access protected
   * @var {TransactionRepository}
   */
  protected transactionRepository: TransactionRepository;

  /**
   * The blocks repository that permits to execute REST
   * requests on the `/blocks` namespace.
   *
   * @access protected
   * @var {BlockRepository}
   */
  protected blockRepository: BlockRepository;

  /**
   * The chain repository that permits to execute REST
   * requests on the `/chain` namespace.
   *
   * @access protected
   * @var {ChainRepository}
   */
  protected chainRepository: ChainRepository;

  /**
   * The node repository that permits to execute REST
   * requests on the `/node` namespace.
   *
   * @access protected
   * @var {NodeRepository}
   */
  protected nodeRepository: NodeRepository;

  /**
   * Constructs an instance of the network service and connects
   * to the **configured** `defaultNode` (config/network.json). Note
   * that connection handling is currently *automatic* and executed
   * upon instanciation of network service objects.
   *
   * @access public
   * @param {ConfigService} configService
   */
  public constructor(private readonly configService: ConfigService) {
    // prepares the connection parameters
    const defaultNode = this.configService.get<string>("defaultNode");
    const generationHash = this.configService.get<string>(
      "network.generationHash",
    );
    const epochAdjustment = this.configService.get<number>(
      "network.epochAdjustment",
    );
    const networkIdentifier = this.configService.get<number>(
      "network.networkIdentifier",
    );
    const currencyMosaicId = this.configService.get<string>("network.mosaicId");
    const tokenDivisibility = this.configService.get<number>(
      "network.divisibility",
    );

    // makes sure to connect only with values set for
    // all required fields during node connection setup.
    const isConnectionPossible: boolean =
      !!defaultNode &&
      !!generationHash &&
      !!currencyMosaicId &&
      defaultNode.length > 0 &&
      generationHash.length > 0 &&
      currencyMosaicId.length > 0;

    if (isConnectionPossible) {
      // initializes network currencies (uses `js-sha3`)
      // so that they are not retrieved from the node.
      const networkCurrency = new Currency({
        mosaicId: new MosaicId(currencyMosaicId),
        divisibility: tokenDivisibility,
        transferable: true,
        supplyMutable: false,
        restrictable: false,
      });

      // stores a copy of the network connection payload
      this.currentNetwork = {
        generationHash,
        epochAdjustment,
        networkIdentifier,
        networkCurrencies: new NetworkCurrencies(
          networkCurrency,
          networkCurrency,
        ),
      } as NetworkConnectionPayload;

      // initializes a repository factory and passes connection
      // information to avoid extra node requests.
      this.connectToNode(defaultNode, this.currentNetwork);
    }
  }

  /**
   * Getter method that returns the *blocks* repository for the
   * currently connected node (through repository factory).
   * <br /><br />
   * This repository permits to execute requests on the `/blocks`
   * namespace using the node's REST interface.
   *
   * @access public
   * @returns {BlockRepository}
   */
  public getBlockRepository(): BlockRepository {
    return this.blockRepository;
  }

  /**
   * Getter method that returns the *transactions* repository for the
   * currently connected node (through repository factory).
   * <br /><br />
   * This repository permits to execute requests on the `/transactions`
   * namespace using the node's REST interface.
   *
   * @access public
   * @returns {TransactionRepository}
   */
  public getTransactionRepository(): TransactionRepository {
    return this.transactionRepository;
  }

  /**
   * Method to get timestamp from a dHealth block-height number.
   *
   * @async
   * @access public
   * @param {number} height
   * @returns {Promise<number>}
   */
  public async getBlockTimestamp(height: number): Promise<number> {
    const block = await this.blockRepository
      .getBlockByHeight(UInt64.fromUint(height))
      .toPromise();
    if (!block) throw new Error("Cannot query block from height");
    const timestamp = this.getNetworkTimestampFromUInt64(block.timestamp);
    return timestamp * 1e3;
  }

  /**
   * Method to get (network adjusted) timestamp from an UInt64 timestamp.
   *
   * @access public
   * @param {UInt64} timestamp
   * @returns {number}
   */
  public getNetworkTimestampFromUInt64(timestamp: UInt64): number {
    const timestampNumber = timestamp.compact();
    const epochAdjustment = this.configService.get<number>(
      "network.epochAdjustment",
    );
    return Math.round(timestampNumber / 1000) + epochAdjustment;
  }

  /**
   * This method forwards the execution of promises using
   * `Promise.all()` and given request failure, connects to
   * a different node that is currently in a health state.
   *
   * @async
   * @access public
   * @param   {Promise<ResponseType>[]}  promises    An array of promises that will be executed.
   * @returns {Promise<ResponseType[]>}  An array of results as promised.
   */
  public async delegatePromises<ResponseType>(
    promises: Promise<ResponseType>[],
  ): Promise<ResponseType[]> {
    try {
      return await Promise.all(promises);
    }
    catch (e) {
      // request to node **failed**, try with a different node
      this.currentNode = await this.getNextAvailableNode();
      return this.delegatePromises(promises);
    }
  }

  /**
   * Helper method to pick a **healthy** and available node
   * from the runtime configuration. If none of the configured
   * nodes is currently in a healthy state, this method will
   * use the {@link http://peers.dhealth.cloud:7903/network/nodes} endpoint
   * instead.
   *
   * @todo implement network-api interface to query health nodes
   * @async
   * @access protected
   * @returns {NodeConnectionPayload}
   */
  protected async getNextAvailableNode(): Promise<NodeConnectionPayload> {
    // reads configuration
    const otherNodes = this.configService.get<NodeConnectionPayload[]>("apiNodes");

    // iterates through all nodes that are listed in the
    // configuration and checks for their healthiness to
    // make sure we always return a node that is currently
    // available and healthy on the network.
    for (let i = 0, max = otherNodes.length; i < max; i++) {
      // parses the node connection payload
      const nodeUrl = this.getNodeUrl(otherNodes[i]);

      try {
        // instanciate new repository factory
        this.connectToNode(nodeUrl, this.currentNetwork);

        // query for node health before we continue
        const result: NodeHealth = await this.nodeRepository
          .getNodeHealth()
          .toPromise();

        // break here if node is healthy
        if (result.apiNode === "up" && result.db === "up") {
          return otherNodes[i];
        }

        throw new Error("Skipping unhealthy node");
      }
      catch (e) {
        // ignore errors here as they are expected when
        // a node is not in a healthy state or not available
        continue;
      }
    }

    // none of the configured nodes is currently in a healthy
    // state, we will now use the network-api to query for a
    // healthy and available node instead
    // @todo implement network-api interface to query health nodes

    // fallback to current node
    return this.currentNode;
  }

  /**
   * Helper method that constructs a node URL using the
   * {@link NodeConnectionPayload} payload.
   *
   * @access protected
   * @param   {NodeConnectionPayload}   payload 
   * @returns {string}
   */
  protected getNodeUrl(
    payload: NodeConnectionPayload,
  ): string {
    // when the URL already contains a port, returns URL
    if (payload.url.match(/:[0-9]{2,5}\/?/)) {
      return payload.url.replace(/\/$/, "");
    }

    // otherwise, use port from payload or fallback to default
    const port = "port" in payload ? payload.port : 3000;
    return `${payload.url}:${port}`;
  }

  /**
   * Helper method that connects to a node's REST interface
   * using the SDK's `RepositoryFactoryHttp` class. Note that
   * the connection payload is *pre-configured* so that extra
   * requests are spared.
   *
   * @access protected
   * @param {string} nodeUrl
   * @param {NetworkConnectionPayload} connectionPayload
   * @returns {NetworkService}
   */
  protected connectToNode(
    nodeUrl: string,
    connectionPayload: NetworkConnectionPayload,
  ): NetworkService {
    // configures the repository factory
    this.repositoryFactoryHttp = new RepositoryFactoryHttp(nodeUrl, {
      generationHash: connectionPayload.generationHash,
      epochAdjustment: connectionPayload.epochAdjustment,
      networkType: connectionPayload.networkIdentifier,
      networkCurrencies: connectionPayload.networkCurrencies,
      nodePublicKey: "FakeUnauthorizedPublicKey",
    } as RepositoryFactoryConfig);

    // store copy of connected node
    this.currentNode = { url: nodeUrl, port: 3000 };

    // retrieve repositories from factory
    this.transactionRepository =
      this.repositoryFactoryHttp.createTransactionRepository();
    this.blockRepository = this.repositoryFactoryHttp.createBlockRepository();
    this.chainRepository = this.repositoryFactoryHttp.createChainRepository();
    this.nodeRepository  = this.repositoryFactoryHttp.createNodeRepository();

    return this;
  }
}
