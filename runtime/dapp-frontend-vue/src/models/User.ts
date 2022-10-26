/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @class User
 * @description This interface ...
 * <br /><br />
 * @example Using the `User` interface
 * ```typescript
 *   const api = new ProfileService();
 *   const user: User = await api.getMe();
 *   console.log(user);
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    address                  Contains the dHealth Account Address of an end-user.
 * @param   {number}    transactionsCount        (Optional) Contains the total number of transaction of an end-user.
 * @param   {Date}      firstTransactionAt       (Optional) Contains the date of the first transaction of an end-user.
 * @param   {number}    firstTransactionAtBlock  (Optional) Contains the block height that includes the first transaction of end-user.
 *
 * @since v0.3.0
 */
export interface User {
  address: string;
  transactionsCount?: number;
  firstTransactionAt?: Date;
  firstTransactionAtBlock?: number;
  integrations?: string[];
  refCode?: string;
}
