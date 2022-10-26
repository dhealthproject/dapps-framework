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
import { BlockHttp, UInt64 } from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NetworkService } from "../services/NetworkService";

@Injectable()
export class DappHelper {
  /**
   * Constructs an instance of this helper.
   *
   * @constructor
   * @param {ConfigService} configService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly networkService: NetworkService,
  ) {}

  /**
   * Method to get timestamp from a dHealth block-height number.
   *
   * @async
   * @access public
   * @param {BlockHttp} blockRepository
   * @param {number} height
   * @returns {Promise<number>}
   */
  public async getBlockTimestamp(
    blockRepository: BlockHttp,
    height: number,
  ): Promise<number> {
    const [block] = await this.networkService.delegatePromises([
      blockRepository.getBlockByHeight(UInt64.fromUint(height)).toPromise(),
    ]);
    if (!block) throw new Error("Cannot query block from height");
    const timestamp = this.getNetworkTimestampFromUInt64(block.timestamp);
    return timestamp * 1000;
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
}
