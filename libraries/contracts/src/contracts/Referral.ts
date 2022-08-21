/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth Contracts
 * @subpackage  API
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { PlainMessage, TransferTransaction } from "@dhealth/sdk";

// internal dependencies
import type { ContractParameters } from "@/types/ContractParameters";
import type { NetworkParameters } from "@/types/NetworkParameters";
import type { ObjectLiteral } from "@/types/ObjectLiteral";
import type { TransactionParameters } from "@/types/TransactionParameters";
import { Contract } from "@/Contract";
import { dHealthNetwork } from "@/types/dHealthNetwork";

/**
 * @interface ReferralParameters
 * @description This interface defines the *requirements* for
 * objects passed as **inputs** to {@link Referral} instances.
 * <br /><br />
 * Use this interface whenever you are *using the `Referral`* contract.
 * <br /><br />
 * Following *inputs* apply to the {@link Referral} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "elevate". |
 * | `refCode` | `string` | **Required** | The referral code for this referral operation, e.g. "ELEVATE2022". |
 * <br /><br />
 * @example Using the `ReferralParameters` class
 * ```ts
 * // creating authentication contract inputs
 * const inputs = {
 *   dappIdentifier: "my-cool-dapp",
 *   refCode: "ELEVATE2022",
 * } as ReferralParameters;
 * ```
 *
 * @link Referral
 * @link Contract
 * @link Factory
 * @since v0.3.0
 */
export interface ReferralParameters extends ContractParameters {
  /**
   * The *referral code* input that is linked to another
   * end-user of the dApp. Referral codes permit the dApp to
   * keep track of new users invitations.
   * <br /><br />
   * This referral code is *required* and you can assume that it
   * is *always present* in the {@link Referral} contract.
   *
   * @access public
   * @example `"ELEVATE2022"`
   * @var {string}
   */
  refCode: string;
}

/**
 * @class Referral
 * @description This class contains the implementation of the
 * *referral* contract which is used to discover new users
 * invitations in the dApp.
 * <br /><br />
 * Use this class whenever you are interpreting an operation of
 * referral for your dApp. Also, an instance of this class is created
 * using {@link Factory.createFromJSON} given a contract signature
 * that matches: `/:referral$/` (ends with).
 * <br /><br />
 * #### Parameters
 * Following *inputs* apply to the {@link Referral} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "elevate". |
 * | `refCode` | `string` | **Required** | The referral code for this operation, e.g. "ELEVATE2022". |
 * <br /><br />
 * @example Using the `Referral` contract class
 * ```ts
 * // creating a referral contract
 * const contract: Referral = new Referral({
 *   dappIdentifier: "elevate",
 *   refCode: "ELEVATE2022",
 * });
 * ```
 *
 * @link ReferralParameters
 * @link Contract
 * @link Factory
 * @since v0.3.0
 */
export class Referral extends Contract {
  /**
   * Construct a **referral** contract. Note that some of
   * the **inputs are required**.
   * <br /><br />
   * The referral contract *requires* inputs including the `dappIdentifier`
   * and `refCode` for the operation, refer to the above [parameters](#parameters)
   * description for more details.
   *
   * @access public
   * @param   {EarnParameters}      inputs      The inputs that are used during execution ("arguments").
   * @param   {number}              version     (Optional) The contract version number (defaults to `1`).
   * @param   {NetworkParameters}   parameters  (Optional) The network parameters ("connection").
   */
  public constructor(
    /**
     * Contains an object of fields with their respective values. The
     * inputs to a contract are typically passed to the contract at the
     * time of execution ("runtime").
     * <br /><br />
     * Use this field to pass custom parameters to a contract before
     * it gets executed.
     * <br /><br />
     * The referral contract *requires* inputs including the `dappIdentifier`
     * and `refCode` for the operation, refer to the above [parameters](#parameters)
     * description for more details.
     *
     * @access protected
     * @example `{ dappIdentifier: "my-cool-dapp", date: "20220829" }`
     * @var {EarnParameters}
     */
    protected inputs: ReferralParameters,

    /**
     * Consists of the *version* of this contract. Each contract may
     * use a different version because they can be updated with time
     * passing. This field is *always* attached to contracts.
     * <br /><br />
     * Numbering starts with `1` for the *first* version of a dApp
     * contract.
     * <br /><br />
     * Use this field whenever you update the version of a contract,
     * or add fields that are required for the contract's successful
     * execution.
     * <br /><br />
     * Defaults to `1` to denote the *first* version of a contract.
     *
     * @access protected
     * @example `1`
     * @var {number}
     */
    protected readonly version: number = 1,

    /**
     * Contains a configuration object that defines fields necessary
     * to *prepare* transactions for dHealth Network. Transaction are
     * usually created and **signed** *fully off-line* and can then be
     * broadcast using a different piece of software - the backend.
     * <br /><br />
     * Note that this library is not responsible for *broadcasting*
     * (or "announcing") transactions on the network.
     * <br /><br />
     * Use this field to determine *on which network* the transaction(s)
     * aim to be broadcast/announced.
     * <br /><br />
     * Defaults to connection parameters to connect to dHealth Network.
     *
     * @access protected
     * @example `{ generationHash: "my-different-network" }`
     * @var {NetworkParameters}
     */
    protected parameters: NetworkParameters = new dHealthNetwork()
  ) {
    super(inputs, version, parameters);

    // @throws MissingContractFieldError given missing obligatory field
    this.assertObligatoryInputs(["refCode"], Object.keys(inputs));
  }

  /**
   * This method should return a `string` that is used as the
   * *identifier of the contract* being executed.
   * <br /><br />
   * This identifier will be concatenated with the dApp identifier
   * to form the *contract signature*.
   * <br /><br />
   * This method should return an identifier that is unique
   * across *one dApp*, i.e. it is OK to re-define an `earn`
   * contract in a different dApp than elevate.
   *
   * @access public
   * @abstract
   * @returns {string}  A contract identifier as present on-chain in the contract signature.
   */
  public get identifier(): string {
    return "referral";
  }

  /**
   * This method should return an {@link ObjectLiteral} that consists of
   * the **body** of the contract, e.g. in the {@link Referral} contract
   * the body contains a *refCode* (referral code).
   * <br /><br />
   * In the referral contract, we **always** include the `refCode` field.
   * <br /><br />
   * Note that by modifying the *required* fields of a contract's
   * body, you **must** also update the *version* of the contract
   * to prevent inconsistencies in operations.
   *
   * @access public
   * @abstract
   * @returns {ObjectLiteral}  An object that consists of custom fields related to the scope of the contract.
   */
  public get body(): ObjectLiteral {
    // date is obligatory
    const fields: ObjectLiteral = {
      refCode: this.inputs.refCode,
    };

    return fields;
  }

  /**
   * This method should return a prepared `Transaction` object from
   * `@dhealth/sdk`. This transaction *will not* be broadcast or
   * signed *yet* and this method can be called without requiring
   * an internet connection ("off-line").
   * <br /><br />
   * Note that by modifying the *transaction* that is created when
   * executing a contract, you **must** also update the *version*
   * of the contract to prevent inconsistencies in operations.
   *
   * @access public
   * @abstract
   * @param   {TransactionParameters}   parameters    A configuration object that is passed to the creation process of the dHealth Network Transaction.
   * @returns {Transaction}   A prepared (but unsigned) dHealth Network Transaction.
   */
  public toTransaction(parameters: TransactionParameters): TransferTransaction {
    return TransferTransaction.create(
      this.parameters.getDeadline(),
      this.parameters.getPublicAccount(
        parameters.recipientPublicKey,
        this.parameters.getNetworkType()
      ).address,
      this.parameters.getMosaic(0),
      PlainMessage.create(this.toJSON()),
      this.parameters.getNetworkType(),
      this.parameters.getMaxFee(0)
    );
  }
}
