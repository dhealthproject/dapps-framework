/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth Contracts
 * @subpackage  API
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { Parameters } from "@/types/Parameters";

/**
 * @interface TransactionParameters
 * @description This interface defines the *requirements* for
 * objects passed as **transaction parameters** to the method
 * {@link Contract.toTransaction} as implemented in the child
 * class specialization.
 * <br /><br />
 * As it is not possible to tell *a public key* from an address,
 * other than by executing *connected network requests*, we use
 * public keys so that we are **always** able to perform both
 * tasks: identifying an account (by an address) and verifying
 * transactions (with a public key).
 * <br /><br />
 * Use this interface whenever you are *defining a new contract*
 * or *creating sets of parameters* to be passed to transactions.
 * <br /><br />
 * @example Using the `TransactionParameters` interface
 * ```ts
 * // creating transaction parameters
 * const params = {
 *   recipientPublicKey: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
 * } as TransactionParameters;
 * ```
 * <br /><br />
 * #### Other links
 * {@link Contract.toTransaction}
 * <br /><br />
 * @since v0.3.0
 */
export interface TransactionParameters extends Parameters {
  /**
   * Contains the transaction's *recipient* public key. We use
   * a public key here because we need to be able to generate
   * an address (account identifier) **but also** we need to be
   * able to **verify** transaction signatures which happens
   * using a public key, not an address.
   * <br /><br />
   * The address generated using this public key, corresponds
   * to the address of the account that defines the *destination*
   * of the transaction on dHealth Network.
   *
   * @access public
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
   * @var {string}
   */
  recipientPublicKey: string;

  /**
   * Contains the transaction's *signer* public key. We use
   * a public key here because we need to be able to generate
   * an address (account identifier) **but also** we need to be
   * able to **verify** transaction signatures which happens
   * using a public key, not an address.
   * <br /><br />
   * The address generated using this public key, corresponds
   * to the address of the account that defines the *origin*
   * of the transaction on dHealth Network.
   * <br /><br />
   * This field is optional and does not need to be present
   * with all `TransactionParameters` objects.
   *
   * @access public
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
   * @var {string}
   */
  signerPublicKey?: string;

  // @todo add aggregateWith parameter
  // @todo add maxFee parameter
  // @todo add deadline parameter
  // @todo add asset parameter and think about `AssetParameters` type
}
