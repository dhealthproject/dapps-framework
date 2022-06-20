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
  Currency,
  MosaicId,
  NetworkCurrencies,
  RepositoryFactoryHttp,
  RepositoryFactoryConfig,
  TransactionRepository,
  UInt64,
} from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * @type NodeConnectionPayload
 * @description This type encapsulates parameters that can be
 * used when connecting to a dHealth Network node. Configuring
 * the connection object (repository factory) permits to avoid
 * extra node requests to be issued *before* connection can be
 * established.
 *
 * @since v0.1.0
 */
export type NodeConnectionPayload = {
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
 * @todo Potentially add `nodePublicKey` to network configuration (for default node).
 * @todo Move method {@link getBlockTimestamp} to helpers/formatters concern.
 * @todo Move method {@link getNetworkTimestampFromUInt64} to helpers/formatters concern.
 * @since v0.1.0
 */
@Injectable()
export class NetworkService {
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

      // initializes a repository factory and passes connection
      // information to avoid extra node requests.
      this.connectToNode(defaultNode, {
        generationHash,
        epochAdjustment,
        networkIdentifier,
        networkCurrencies: new NetworkCurrencies(
          networkCurrency,
          networkCurrency,
        ),
      } as NodeConnectionPayload);
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
   * @returns {BlockRepository}
   */
  public getTransactionRepository(): TransactionRepository {
    return this.transactionRepository;
  }

  /**
   * Method to get timestamp from a dHealth block-height number.
   *
   * @access public
   * @async
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
   * Helper method that connects to a node's REST interface
   * using the SDK's `RepositoryFactoryHttp` class. Note that
   * the connection payload is *pre-configured* so that extra
   * requests are spared.
   *
   * @param {string} nodeUrl
   * @param {NodeConnectionPayload} connectionPayload
   * @returns {NetworkService}
   */
  protected connectToNode(
    nodeUrl: string,
    connectionPayload: NodeConnectionPayload,
  ): NetworkService {
    this.repositoryFactoryHttp = new RepositoryFactoryHttp(nodeUrl, {
      generationHash: connectionPayload.generationHash,
      epochAdjustment: connectionPayload.epochAdjustment,
      networkType: connectionPayload.networkIdentifier,
      networkCurrencies: connectionPayload.networkCurrencies,
      nodePublicKey: "FakeUnauthorizedPublicKey",
    } as RepositoryFactoryConfig);

    this.transactionRepository =
      this.repositoryFactoryHttp.createTransactionRepository();
    this.blockRepository = this.repositoryFactoryHttp.createBlockRepository();

    return this;
  }
}
