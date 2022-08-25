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
 * @class TransactionDTO
 * @description
 *
 * @todo Add relevant helper function documentation
 * @todo Use the `@dhealth/contracts` abstraction and include in TransactionDTO if necessary.
 * @since v0.2.0
 */
export const getTransactionType = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.TRANSFER:
      return "transfer";
    default:
      return "custom";
  }
};
