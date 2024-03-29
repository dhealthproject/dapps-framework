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
import { BaseDTO } from "./BaseDTO";

/**
 * @class AccountDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an account. Typically this includes information *that is already made
 * public* or is known from dHealth Network.
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about accounts to be revealed.
 *
 * @since v0.1.0
 */
export class AccountDTO extends BaseDTO {
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
    description: "The Address of this account on dHealth Network",
  })
  public address: string;

  /**
   * The account's referral code. This code should be used when inviting
   * new users to the dApp. This field contains a unique random string of
   * 8 characters.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "string",
    example: "JOINFIT22-4234432424",
    description:
      "The account's referral code. This code should be used when inviting new users to the dApp.",
  })
  public referralCode: string;

  /**
   * The account's **referrer address**. This address refers to the
   * account that *invited* the current account to the dApp.
   * <br /><br />
   * This field is **optional** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description:
      "The account's referrer address. This address refers to the account whom *invited* the current account to the dApp.",
  })
  public referredBy?: string;

  /**
   * The total number of transactions discovered for
   * this account on dHealth Network.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 1,
    description:
      "The total number of transactions discovered for this account on dHealth Network",
  })
  public transactionsCount?: number;

  /**
   * The time at which this account first interacted
   * with this dApp on dHealth Network.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: "2022-08-16T22:24:00.216Z",
    description:
      "The time at which this account first interacted with this dApp on dHealth Network",
  })
  public firstTransactionAt?: number;

  /**
   * The height of the block that included the transaction
   * with which this account first interacted with this dApp
   * on dHealth Network.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 123456,
    description:
      "The height of the block that included the transaction with which this account first interacted with this dApp on dHealth Network",
  })
  public firstTransactionAtBlock?: number;
}
