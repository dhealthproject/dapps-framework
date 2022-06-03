/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { PagePaginatedQueryDto } from './paginated-result.dto';

/**
 * @class AccountDTO
 * @description A DTO class that represents the Account schema.
 *
 * @since 0.1.0
 */
export class AccountDTO {
  /**
   * Account's wallet address.
   *
   * @var {string}
   */
  address: string;

  /**
   * Account's transaction count.
   * Measures the total number of transactions it has received from dapp account.
   *
   * @var {number}
   */
  transactionsCount?: number;

  /**
   * Account's first transaction date.
   * This is the date of the first transaction it received from dapp account.
   *
   * @var {Date}
   */
  firstTransactionAt?: Date;

  /**
   * Account's first transaction block.
   * The block height that this account's first transaction got confirmed.
   *
   * @var {number}
   */
  firstTransactionAtBlock?: number;

  /**
   * Account's creation date.
   * The date this account was created in database.
   *
   * @var {Date}
   */
  createdAt?: Date;

  /**
   * Account's update date.
   * The date this account was last updated in database.
   *
   * @var {Date}
   */
  updatedAt?: Date;
}

/**
 * @class AccountQueryDTO
 * @description A DTO class that represents the Account query schema.
 *
 * @extends {PagePaginatedQueryDto} Paginated query
 * @since 0.1.0
 */
export class AccountQueryDTO extends PagePaginatedQueryDto {
  /**
   * Account's wallet address.
   *
   * @var {string}
   */
  address?: string;

  /**
   * Account's transaction count.
   *
   * @var {number}
   */
  transactionsCount?: number;
}
