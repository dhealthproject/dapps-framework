/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth Contracts
 * @subpackage  API
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @interface Parameters
 * @description This interface defines the *requirements* for
 * *sets of parameters*.
 * <br /><br />
 * Use this interface whenever you are *defining a new contract*
 * or *creating sets of inputs or parameters* to be passed to a
 * contract.
 * <br /><br />
 * Note that this interface is currently still empty and only
 * present for future-upgradeability of contract parameters,
 * if necessary. Also, due to the usage of `eslint`, a custom
 * `"@typescript-eslint/no-empty-interface": "off"` has been
 * added to the `eslint` configuration to permit the creation
 * of this interface and usage of it in child interfaces.
 * <br /><br />
 * @example Using the `Parameters` interface
 * ```ts
 * // creating custom parameters
 * const params = {
 *   coolness: "with a cool 8-) value",
 * } as Parameters;
 * ```
 *
 * @link ContractParameters
 * @link NetworkParameters
 * @link TransactionParameters
 * @since v0.3.0
 */
export interface Parameters {}
