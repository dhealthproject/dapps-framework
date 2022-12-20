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
import { TransactionType } from "@dhealth/sdk";

/**
 * @class TransactionTypes
 * @description A helper class that handle and process {@link TransactionType}.
 *
 * @todo Use the `@dhealth/contracts` abstraction and include in TransactionDTO if necessary.
 * @since v0.2.0
 */
export class TransactionTypes {
  /**
   * A helper method that returns a string representation
   * of a {@link TransactionType}.
   *
   * @access public
   * @static
   * @param {TransactionType} type The transaction type to get a string representation of.
   * @returns {string}
   */
  public static getTransactionType(type: TransactionType): string {
    switch (type) {
      case TransactionType.TRANSFER:
        return "transfer";
      default:
        return "custom";
    }
  }
}
