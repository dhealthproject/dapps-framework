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

/**
 * @class StateDto
 * @description A DTO class that consists of an account's **address**,
 * an optional transactions count, a first transaction timestamp and
 * a first transaction block height.
 * <br /><br />
 * This class shall be used to **respond** to queries for the mongo
 * `accounts` collection documents.
 *
 * @todo The transaction timestamp in `firstTransactionAt` should probably be a **number** to avoid timezone issues.
 * @since v0.1.0
 */
export class AccountDTO {
  /**
   * Account's wallet address.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public address: string;

  /**
   * Account's transaction count.
   * Measures the total number of transactions it has received from dapp account.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty()
  public transactionsCount?: number;

  /**
   * Account's first transaction date.
   * This is the date of the first transaction it received from dapp account.
   *
   * @access public
   * @var {Date}
   */
  @ApiProperty()
  public firstTransactionAt?: Date;

  /**
   * Account's first transaction block.
   * The block height that this account's first transaction got confirmed.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty()
  public firstTransactionAtBlock?: number;
}
