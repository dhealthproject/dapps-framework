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
import { Parameters } from "../types/Parameters";

/**
 * @interface ContractParameters
 * @description This interface defines the *requirements* for
 * objects passed as **inputs** to {@link Contract} instances.
 * <br /><br />
 * Use this interface whenever you are *defining a new contract*
 * or *creating sets of inputs* to be passed to a contract.
 * <br /><br />
 * #### Parameters
 * Following *inputs* apply to this contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | Required | The dApp identifier, e.g. "elevate". |
 *
 * <br /><br />
 * @example Using the `ContractParameters` interface
 * ```ts
 * // creating contract inputs
 * const inputs = {
 *   dappIdentifier: "my-cool-dapp",
 * } as ContractParameters;
 * ```
 * <br /><br />
 * #### Other links
 * {@link Contract} | {@link Factory}
 * <br /><br />
 * @since v0.3.0
 */
export interface ContractParameters extends Parameters {
  /**
   * A human-readable dApp identifier, e.g. "ELEVATE".
   * <br /><br />
   * Note that this field will be *slugified* using the
   * {@link Contract.dApp} method before it is attached
   * to the transfer transaction message.
   *
   * @access public
   * @example `"My Cool dApp"`
   * @var {string}
   */
  dappIdentifier: string;
}
