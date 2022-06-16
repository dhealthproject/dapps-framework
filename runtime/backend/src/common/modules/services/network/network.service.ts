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
  NamespaceId,
  NetworkCurrencies,
  RepositoryFactoryHttp,
  RepositoryFactoryConfig,
  TransactionRepository,
  UInt64,
} from '@dhealth/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * @class NetworkService
 * @description The main service for the network module.
 * Contains all common, reusable dHealth network information.
 *
 * @since v0.1.0
 */
@Injectable()
export class NetworkService {
  /**
   * Common instance of {@link RepositoryFactoryHttp}.
   * This property is not expected to be accessible. It is meant to be
   * a base factory to create other reusable properties.
   *
   * @access private
   * @var {RepositoryFactoryHttp}
   */
  private repositoryFactoryHttp: RepositoryFactoryHttp;

  /**
   * Common, reusable instance of {@link TransactionRepository}.
   *
   * @access public
   * @var {TransactionRepository}
   */
  public readonly transactionRepository: TransactionRepository;

  /**
   * Common, reusable instance of {@link BlockRepository}.
   *
   * @access public
   * @var {BlockRepository}
   */
  public readonly blockRepository: BlockRepository;

  /**
   * The constructor of this class.
   * Upon creation, initialize all common properties.
   *
   * @param {ConfigService} configService
   */
  constructor(private readonly configService: ConfigService) {
    // prepares the connection parameters
    const defaultNode = this.configService.get<string>('defaultNode');
    const generationHash = this.configService.get<string>('network.generationHash');
    const epochAdjustment = this.configService.get<number>('network.epochAdjustment');
    const networkIdentifier = this.configService.get<number>('network.networkIdentifier');
    const currencyMosaicId = this.configService.get<string>('network.mosaicId');
    const currencyNamespaceId = this.configService.get<string>('network.namespaceId');
    const tokenDivisibility = this.configService.get<number>('network.divisibility');
    const networkCurrency = new Currency({
      mosaicId: new MosaicId(currencyMosaicId),
      namespaceId: new NamespaceId(currencyNamespaceId),
      divisibility: tokenDivisibility,
      transferable: true,
      supplyMutable: false,
      restrictable: false,
    });

    // initializes a repository factory and passes connection
    // information to avoid extra node requests.
    this.repositoryFactoryHttp = new RepositoryFactoryHttp(defaultNode, {
      generationHash: generationHash,
      epochAdjustment: epochAdjustment,
      networkType: networkIdentifier,
      networkCurrencies: new NetworkCurrencies(networkCurrency, networkCurrency),
      nodePublicKey: 'FakeUnauthorizedPublicKey',
    } as RepositoryFactoryConfig);
    this.transactionRepository =
      this.repositoryFactoryHttp.createTransactionRepository();
    this.blockRepository = this.repositoryFactoryHttp.createBlockRepository();
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
    if (!block) throw new Error('Cannot query block from height');
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
      'network.epochAdjustment',
    );
    return Math.round(timestampNumber / 1000) + epochAdjustment;
  }
}
