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
import {
  Mosaic,
  MosaicId,
  PlainMessage,
  TransferTransaction,
  UInt64,
} from "@dhealth/sdk";

// internal dependencies
import type { ContractParameters } from "../types/ContractParameters";
import type { NetworkParameters } from "../types/NetworkParameters";
import type { ObjectLiteral } from "../types/ObjectLiteral";
import type { TransactionParameters } from "../types/TransactionParameters";
import { Contract } from "../Contract";
import { Assertions } from "../types/Assertions";
import { dHealthNetwork } from "../types/dHealthNetwork";

/**
 * @interface EarnParameters
 * @description This interface defines the *requirements* for
 * objects passed as **inputs** to {@link Earn} instances.
 * <br /><br />
 * Use this interface whenever you are *using the `Earn`* contract.
 * <br /><br />
 * Following *inputs* apply to the {@link Earn} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "elevate". |
 * | `date` | `string` | **Required** | The date of the operation being rewarded, e.g. "20220829". |
 * | `asset` | `string` | **Optional** | The identifier of the asset attached to this operation, e.g. "4ADBC6CEF9393B90". |
 * | `amount` | `number` | **Optional** | The amount of asset(s) attached to this operation, e.g. `1`. |
 *
 * <br /><br />
 * @example Using the `EarnParameters` class
 * ```ts
 * // creating earn contract inputs
 * const inputs = {
 *   dappIdentifier: "my-cool-dapp",
 *   date: "20220829",
 * } as EarnParameters;
 *
 * // creating earn contract inputs with optionals
 * const inputs = {
 *   dappIdentifier: "my-cool-dapp",
 *   date: "20220829",
 *   asset: "4ADBC6CEF9393B90", ("FIT")
 *   amount: 1234,
 * } as EarnParameters;
 * ```
 * <br /><br />
 * #### Other links
 * {@link Earn} | {@link Contract} | {@link Factory}
 * <br /><br />
 * @since v0.3.0
 */
export interface EarnParameters extends ContractParameters {
  /**
   * Contains the date of the operation that is being rewarded, i.e.
   * this corresponds to the the *date* as presented in the operation
   * details and can also be different than the transaction inclusion
   * date.
   * <br /><br />
   * Note that in a previous version of our dApps framework, this field
   * used a date-format of `YYYYMMDD`. We permit the usage of such date
   * values *but we recommend that you use more detailed date values*.
   * <br /><br />
   * For the purpose of backwards compatibility, the `date` input *may*
   * contain a date-format as listed below:
   * - `YYYYMMDD`: e.g. "20220829"
   * - `YYYY-MM-DD`: e.g. "2022-08-29"
   *
   * @access public
   * @example `"20220829"`
   * @var {string}
   */
  date: string;

  /**
   * Contains the identifier of the asset attached to this operations,
   * i.e. this corresponds to the *mosaic identifier* as presented in
   * the resulting *transfer transaction*'s *mosaics* field.
   * <br /><br />
   * For the purpose of backwards compatibility, the `asset` input *may*
   * be *empty* because previous versions of this contract (v0) did not
   * include an amount of rewarded assets.
   *
   * @access public
   * @example `"4ADBC6CEF9393B90"`
   * @var {string}
   */
  asset?: string;

  /**
   * Contains the amount of asset(s) attached to this operations,
   * i.e. this corresponds to the *mosaic amount* as presented in
   * the resulting *transfer transaction*'s *mosaics* field.
   * <br /><br />
   * For the purpose of backwards compatibility, the `amount` input *may*
   * be *empty* because previous versions of this contract (v0) did not
   * include an amount of rewarded assets.
   *
   * @access public
   * @example `1`
   * @var {number}
   */
  amount?: number;
}

/**
 * @class Earn
 * @description This class contains the implementation of the
 * *earn* contract which is used to discover operations
 * of reward in the dApp.
 * <br /><br />
 * Use this class whenever you are interpreting an operation of
 * reward for your dApp. Also, an instance of this class is created
 * using {@link Factory.createFromJSON} given a contract signature
 * that matches: `/:earn$/` (ends with).
 * <br /><br />
 * #### Parameters
 * Following *inputs* apply to the {@link Auth} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "elevate". |
 * | `date` | `string` | **Required** | The date of the operation being rewarded, e.g. "20220829". |
 * | `asset` | `string` | **Optional** | The identifier of the asset attached to this operation, e.g. "4ADBC6CEF9393B90". |
 * | `amount` | `number` | **Optional** | The amount of asset(s) attached to this operation, e.g. `1`. |
 * <br /><br />
 * @example Using the `Earn` contract class
 * ```ts
 * // creating a reward contract
 * const contract: Earn = new Earn({
 *   dappIdentifier: "elevate",
 *   date: "20220829",
 * });
 *
 * // creating a reward contract with optionals
 * const contract: Earn = new Earn({
 *   dappIdentifier: "elevate",
 *   date: "20220829",
 *   asset: "4ADBC6CEF9393B90",
 *   amount: 123,
 * });
 * ```
 * <br /><br />
 * #### Other links
 * {@link EarnParameters} | {@link Contract} | {@link Factory}
 * <br /><br />
 * @since v0.3.0
 */
export class Earn extends Contract {
  /**
   * Construct an **earn** contract. Note that some of
   * the **inputs are required**.
   * <br /><br />
   * The earn contract *requires* inputs including the `dappIdentifier`
   * and `date` of the operation, refer to the above [parameters](#parameters)
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
     * The earn contract *requires* inputs including the `dappIdentifier`
     * and `date` for the operation, refer to the above [parameters](#parameters)
     * description for more details.
     *
     * @access public
     * @example `{ dappIdentifier: "my-cool-dapp", date: "20220829" }`
     * @var {EarnParameters}
     */
    public inputs: EarnParameters,

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
     * @access public
     * @example `1`
     * @var {number}
     */
    public readonly version: number = 1,

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
     * @access public
     * @example `{ generationHash: "my-different-network" }`
     * @var {NetworkParameters}
     */
    public parameters: NetworkParameters = new dHealthNetwork()
  ) {
    super(inputs, version, parameters);

    // @throws MissingContractFieldError given missing obligatory field
    Assertions.assertObligatoryFields(["date"], Object.keys(inputs));
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
    return "earn";
  }

  /**
   * This method should return an {@link ObjectLiteral} that consists of
   * the **body** of the contract, e.g. in the {@link Earn} contract
   * the body contains a *date*.
   * <br /><br />
   * In the earn contract, we **always** include the `date` field.
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
      date: this.inputs.date,
    };

    // add asset and amount if available
    if (this.inputs.asset && this.inputs.amount) {
      fields.asset = this.inputs.asset;
      fields.amount = this.inputs.amount;
    }

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
    // extract for shortcuts
    const { deadline, maxFee } = parameters;

    // prepare unsigned transaction object
    return TransferTransaction.create(
      deadline !== undefined ? deadline : this.parameters.getDeadline(),
      this.getRecipientAddress(parameters),
      this.getMosaics(),
      PlainMessage.create(this.toJSON()),
      this.parameters.getNetworkType(),
      maxFee !== undefined
        ? UInt64.fromUint(maxFee)
        : this.parameters.getMaxFee(0)
    );
  }

  /**
   * This method should return an array of `Mosaic` instances as
   * defined in `@dhealth/sdk`. The transaction assets consists
   * of a set of **assets** that are attached to a transaction
   * on dHealth Network.
   *
   * @access protected
   * @returns {Mosaic[]}   An array of *assets* and *amounts thereof* that are attached to a transfer transaction.
   */
  protected getMosaics(): Mosaic[] {
    // by default, this uses `DHP`
    let assetId: string = this.parameters.currencyMosaicId;
    let amount: number = 0;

    // if the operation has a custom `asset`, use it
    if ("asset" in this.inputs && undefined !== this.inputs.asset) {
      assetId = this.inputs.asset;
    }

    // by default, the amount is 0, if custom provided, use it
    if ("amount" in this.inputs && undefined !== this.inputs.amount) {
      amount = this.inputs.amount;
    }

    // returns a dHealth Network transfer transaction attachment
    return [new Mosaic(new MosaicId(assetId), UInt64.fromUint(amount))];
  }
}
