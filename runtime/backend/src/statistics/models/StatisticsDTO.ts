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
import { ApiProperty } from "@nestjs/swagger";

// internal dependencies
import { BaseDTO } from "../../common/models/BaseDTO";
import { StatisticsDataType } from "./StatisticsDataType";

/**
 * @class StatisticsDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an account's [remote] statistics.
 *
 * @since v0.3.2
 */
export class StatisticsDTO extends BaseDTO {
  /**
   * The type of this statistics DTO. Depends on the
   * sub-statistics scheduler it would take a different
   * specific value.
   *
   * @example `"leaderboard"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "leaderboard",
    description: "The Address of the linked account on dHealth Network",
  })
  public type?: string;

  /**
   * The period format of this statistics DTO. Depends on the
   * sub-statistics scheduler it would take a different
   * specific value.
   * Currently there are 3 types of periods:
   * | value   | description    |
   * |---------|----------------|
   * | "D"     | occurs daily   |
   * | "W"     | occurs weekly  |
   * | "M"     | occurs monthly |
   *
   * @example `"leaderboard"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "D",
    description:
      "The period format of this statistics DTO. Depends on the sub-statistics scheduler it would take a different specific value.",
  })
  public periodFormat?: "D" | "W" | "M";

  /**
   * The period string representation of this DTO.
   * Currently there are 3 types of periods:
   * | name    | description    | example     | example explained
   * |---------|----------------|-------------|--------------------------
   * | daily   | occurs daily   | "20220130"  | period occuring between 0:00 AM 30/01/2022 and 0:00 AM Jan 30 2022
   * | weekly  | occurs weekly  | "202201-02" | period occuring between monday and sunday the second week of Jan 2022
   * | monthly | occurs monthly | "202201"    | period occuring between the 1st and 31st of Jan 2022
   *
   * @example `"20220130"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "20220101",
    description: "The Address of the linked account on dHealth Network",
  })
  public period?: string;

  /**
   * The Address of this account on dHealth Network. The
   * account's **address** typically refers to a human-readable
   * series of 39 characters, starting either with a `T`, for
   * TESTNET addresses, or with a `N`, for MAINNET addresses.
   *
   * @example `"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description: "The Address of the linked account on dHealth Network",
  })
  public address?: string;

  /**
   * The position of the user of this DTO. This reflects
   * the position in terms of total rewards (token) amount
   * this user's address has received.
   *
   * @example `123456`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 123456,
    description: "The position of the current address",
  })
  public position?: number;

  /**
   * The total amount of tokens that the address of this DTO
   * has received. Amount is in absolute format.
   *
   * @example `123456`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 123456,
    description: "The total tokens acummulated from activities",
  })
  public amount?: number;

  /**
   * The data attached to this statistics document. This can contain
   * any object literal that is defined using one of:
   * - {@link UserStatisticsFields}: Consists of a user statistic fields definition.
   * - `ObjectLiteral`: e.g. `{ just: "a value" }`.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @example `123456`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "object",
    example: { just: "a value" },
    description: "The data attached to this statistics entry",
  })
  public data?: StatisticsDataType;
}
