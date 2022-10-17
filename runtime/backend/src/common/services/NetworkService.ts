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
} from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import {
  DefaultNodePayload,
  NetworkParameters,
  NodeConnectionPayload,
} from "../models/NetworkConfig";
import { HttpRequestHandler } from "../drivers/HttpRequestHandler";

/**
 * @type NetworkConnectionPayload
 * @description This type encapsulates parameters that can be
 * used when connecting to a dHealth Network node. Configuring
 * the connection object (repository factory) permits to avoid
 * extra node requests to be issued *before* connection can be
 * established.
 *
 * @example Example network connection payload object for dHealth Network
 * ```typescript
 *  import { Currency } from "@dhealth/sdk";
 *
 *  const networkConnectionPayload = {
 *    nodePublicKey: "5172C98BD61DF32F447C501DE8090A9D7096F9E71975D788D67F7A82B8C04EFA",
 *    generationHash: "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16",
 *    epochAdjustment: "1616978397",
 *    networkIdentifier: 104,
 *    networkCurrencies: {
 *      new Currency({
 *        mosaicId: new MosaicId("39E0C49FA322A459"),
 *        divisibility: 6,
 *        transferable: true,
 *        supplyMutable: false,
 *        restrictable: false,
 *      }),
 *      new Currency({
 *        mosaicId: new MosaicId("39E0C49FA322A459"),
 *        divisibility: 6,
 *        transferable: true,
 *        supplyMutable: false,
 *        restrictable: false,
 *      });
 *    }
 *  } as NetworkConnectionPayload;
 * ```
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
   * @access public
   * @var {RepositoryFactoryHttp}
   */
  public repositoryFactoryHttp: RepositoryFactoryHttp;

  /**
   * The transaction repository that permits to execute REST
   * requests on the `/transaction` namespace.
   *
   * @access public
   * @var {TransactionRepository}
   */
  public transactionRepository: TransactionRepository;

  /**
   * The blocks repository that permits to execute REST
   * requests on the `/blocks` namespace.
   *
   * @access public
   * @var {BlockRepository}
   */
  public blockRepository: BlockRepository;

  /**
   * The chain repository that permits to execute REST
   * requests on the `/chain` namespace.
   *
   * @access public
   * @var {ChainRepository}
   */
  public chainRepository: ChainRepository;

  /**
   * The node repository that permits to execute REST
   * requests on the `/node` namespace.
   *
   * @access public
   * @var {NodeRepository}
   */
  public nodeRepository: NodeRepository;

  /**
   * This class' HTTP service. It's a handler for HTTP requests and contains
   * methods for executing *remote* API calls, e.g. calling a `GET` HTTP API
   * endpoint.
   *
   * @access protected
   * @var {HttpRequestHandler}
   */
  protected httpService: HttpRequestHandler;

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
    const defaultNodePayload = this.configService.get<DefaultNodePayload>(
      "defaultNode",
    ) as DefaultNodePayload;

    // store a copy of network parameters in memory
    this.currentNetwork = this.getNetworkConfiguration();

    // connects to a node only if there is a default
    if (!!defaultNodePayload?.url && defaultNodePayload.url.length > 0) {
      // initializes a repository factory and passes connection
      // information to avoid extra node requests.
      this.connectToNode(
        defaultNodePayload.url,
        defaultNodePayload.publicKey,
        this.currentNetwork,
      );
    }

    // initializes this class' http service
    this.httpService = new HttpRequestHandler();
  }

  /**
   * Public helper method to retrieve the *network parameters* from the
   * runtime configuration. This is helpful to create new adapters that
   * connect to nodes on dHealth Network.
   * <br /><br />
   * This method is used internally to populate the {@link currentNetwork}
   * class property and can be used whenever network parameters must be
   * fetched from the runtime configuration.
   *
   * @returns {NetworkConnectionPayload}
   */
  public getNetworkConfiguration(): NetworkConnectionPayload {
    // reads runtime configuration related to network parameters
    const networkParameters =
      this.configService.get<NetworkParameters>("network");

    // no configuration of network parameters should instead
    // read network parameters *from the node* and therefore
    // we return an empty network connection payload
    if (undefined === networkParameters) {
      return {} as NetworkConnectionPayload;
    }

    // destructuring for further usage in connection payload
    const {
      generationHash,
      epochAdjustment,
      networkIdentifier,
      mosaicId: currencyMosaicId,
      divisibility: tokenDivisibility,
    } = this.configService.get<NetworkParameters>("network");

    // creating this object locally avoids node requests for it
    const networkCurrency = this.getNetworkCurrency(
      currencyMosaicId,
      tokenDivisibility,
    );

    // returns a purposefully created NetworkConnectionPayload
    return {
      generationHash,
      epochAdjustment,
      networkIdentifier,
      networkCurrencies: new NetworkCurrencies(
        networkCurrency,
        networkCurrency,
      ),
    } as NetworkConnectionPayload;
  }

  /**
   * Public helper method to retrieve the *network currenciy* from the
   * runtime configuration. This is helpful to create new adapters that
   * connect to nodes on dHealth Network and *to avoid extra requests
   * to the node*.
   * <br /><br />
   * This method is used internally to populate the `networkCurrencies`
   * field in the {@link currentNetwork} class property and can be used
   * whenever network currencies information is necessary.
   *
   * @param   {string}  currencyMosaicId
   * @param   {number}  tokenDivisibility
   * @returns {Currency}
   */
  public getNetworkCurrency(
    currencyMosaicId: string,
    tokenDivisibility: number,
  ): Currency {
    return new Currency({
      mosaicId: new MosaicId(currencyMosaicId),
      divisibility: tokenDivisibility,
      transferable: true,
      supplyMutable: false,
      restrictable: false,
    });
  }

  /**
   * This method forwards the execution of promises using
   * `Promise.all()` and given request failure, connects to
   * a different node that is currently in a healthy state.
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
    } catch (e) {
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
   * <br /><br />
   * Note that this method executes a call to the node's API
   * using the endpoint `/node/health` to determine the health
   * state of selected nodes. As of now, the nodes that are
   * added to the runtime configuration will be iterated in a
   * sequential and ascending order.
   *
   * @async
   * @access protected
   * @returns {NodeConnectionPayload}
   */
  protected async getNextAvailableNode(): Promise<NodeConnectionPayload> {
    // reads configuration
    const otherNodes =
      this.configService.get<NodeConnectionPayload[]>("apiNodes");
    const networkApiUrl = this.configService.get<string>("networkApi");

    // iterates through all nodes that are listed in the
    // configuration and checks for their healthiness to
    // make sure we always return a node that is currently
    // available and healthy on the network.
    for (let i = 0, max = otherNodes.length; i < max; i++) {
      // parses the node connection payload
      const nodeUrl = this.getNodeUrl(otherNodes[i]);

      try {
        // instanciate new repository factory
        this.connectToNode(nodeUrl, null, this.currentNetwork);

        // query for node health before we continue
        const result: NodeHealth = await this.nodeRepository
          .getNodeHealth()
          .toPromise();

        // break here if node is healthy
        if (result.apiNode === "up" && result.db === "up") {
          return otherNodes[i];
        }

        throw new Error("Skipping unhealthy node");
      } catch (e) {
        // ignore errors here as they are expected when
        // a node is not in a healthy state or not available
        continue;
      }
    }

    // none of the configured nodes is currently in a healthy
    // state, we will now use the network-api to query for a
    // healthy and available node instead
    const healthyNodesResponse = await this.httpService.call(
      `${networkApiUrl}/network/nodes?health.apiNode=up&health.db=up`,
      "GET",
    );

    // get data from query response
    const healthyNodesResponseData = healthyNodesResponse.data.data as Record<
      string,
      string
    >[];

    // convert data to a list of NodeConnectionPayload
    const healthyNodes: NodeConnectionPayload[] = healthyNodesResponseData.map(
      (response: Record<string, string>) =>
        ({
          url: response.host,
          port: response.port,
        } as NodeConnectionPayload),
    );

    // if there exists a node, return it
    if (healthyNodes.length > 0) {
      return healthyNodes[0];
    }

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
  protected getNodeUrl(payload: NodeConnectionPayload): string {
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
   * @param {string} nodePublicKey
   * @param {NetworkConnectionPayload} connectionPayload
   * @returns {NetworkService}
   */
  protected connectToNode(
    nodeUrl: string,
    nodePublicKey: string,
    connectionPayload: NetworkConnectionPayload,
  ): NetworkService {
    // configures the repository factory
    this.repositoryFactoryHttp = new RepositoryFactoryHttp(nodeUrl, {
      generationHash: connectionPayload.generationHash,
      epochAdjustment: connectionPayload.epochAdjustment,
      networkType: connectionPayload.networkIdentifier,
      networkCurrencies: connectionPayload.networkCurrencies,
      nodePublicKey,
    } as RepositoryFactoryConfig);

    // store copy of connected node
    this.currentNode = { url: nodeUrl, port: 3000 };

    // retrieve repositories from factory
    this.transactionRepository =
      this.repositoryFactoryHttp.createTransactionRepository();
    this.blockRepository = this.repositoryFactoryHttp.createBlockRepository();
    this.chainRepository = this.repositoryFactoryHttp.createChainRepository();
    this.nodeRepository = this.repositoryFactoryHttp.createNodeRepository();

    return this;
  }
}
