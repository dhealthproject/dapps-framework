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

  /**
   * Method to get date range according to the period format string.
   *
   * @access public
   * @param {string} periodFormat The period format string e.g. `"D"`, `"W"`, `"M"`.
   * @returns { startDate: Date, endDate: Date }
   */
  public getTimeRange(periodFormat: string): {
    startDate: Date;
    endDate: Date;
  } {
    const dateNow = new Date();
    switch (periodFormat) {
      case "D": {
        // today at 00:00:00:000
        const startDate = new Date(
          Date.UTC(
            dateNow.getUTCFullYear(),
            dateNow.getUTCMonth(),
            dateNow.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        );
        // tomorrow at 00:00:00:000
        const endDate = new Date(
          Date.UTC(
            dateNow.getUTCFullYear(),
            dateNow.getUTCMonth(),
            dateNow.getUTCDate() + 1,
            0,
            0,
            0,
            0,
          ),
        );
        return { startDate, endDate };
      }
      case "W": {
        const dayOfWeek = dateNow.getUTCDay();
        const startDate = new Date(
          Date.UTC(
            dateNow.getUTCFullYear(),
            dateNow.getUTCMonth(),
            dateNow.getUTCDate() - dayOfWeek + 1,
          ),
        );
        const endDate = new Date(
          Date.UTC(
            dateNow.getUTCFullYear(),
            dateNow.getUTCMonth(),
            dateNow.getUTCDate() + (8 - dayOfWeek),
          ),
        );
        return { startDate, endDate };
      }
      case "M": {
        const startDate = new Date(
          Date.UTC(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), 1),
        );
        const endDate = new Date(
          Date.UTC(dateNow.getUTCFullYear(), dateNow.getUTCMonth() + 1, 1),
        );
        return { startDate, endDate };
      }
      default:
        return null;
    }
  }

  /**
   * Method to return a html formatted string that represents the input object.
   * This string will be used mostly by a {@link Notifier} strategy implementation
   * to present the report content.
   *
   * @param {Record<string, string | number | object>[]} details The list of queried result.
   * @returns {string} The html-formatted string that represents the input queried result.
   */
  public createDetailsTableHTML(
    details: Record<string, string | number | object>[],
  ): string {
    const style = 'style="border: 1px solid #dddddd"';
    const result = [];
    for (const detail of details) {
      result.push("<table>");
      for (const field in detail) {
        result.push(
          `<tr ${style}><td ${style}>${field}</td><td ${style}>${JSON.stringify(
            detail[field],
            null,
            1,
          )}</td></tr>`,
        );
      }
      result.push("</table><br /><br />");
    }
    return result.join("");
  }
}
