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
 * @interface ConsentParameters
 * @description This interface defines the *requirements* for
 * objects passed as **inputs** to {@link Consent} instances.
 * <br /><br />
 * Use this interface whenever you are *using the `Consent`* contract.
 * <br /><br />
 * Following *inputs* apply to the {@link Consent} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "folio". |
 * | `level` | `string` | **Required** | The access level that must be granted upon *accepting* this consent request, i.e. must contain on of: `view`, `edit` or `delete` |
 * | `scope` | `string` | **Required** | Contains the transaction hash of the *confirmed* transaction which links to metadata about the shared document. |
 * | `purpose` | `string` | **Required** | Contains an *encrypted* message from the consent *requester* which should describe the purpose of getting access to the shared document. |
 *
 * <br /><br />
 * @example Using the `ConsentParameters` class
 * ```ts
 * // creating consent contract inputs
 * const inputs = {
 *   dappIdentifier: "my-cool-dapp",
 *   level: "read",
 *   scope: "...",
 *   purpose: "..."
 * } as ConsentParameters;
 * ```
 * <br /><br />
 * #### Other links
 * {@link Consent} | {@link Contract} | {@link Factory}
 * <br /><br />
 * @since v1.0.0
 */
export interface ConsentParameters extends ContractParameters {
  /**
   * Contains the *access level* that will be granted upon accepting
   * the attached consent request.
   *
   * @access public
   * @example `"view"`
   * @var {string}
   */
  level: string | "view" | "edit" | "delete";

  /**
   * Contains the transaction hash of the *confirmed* transaction
   * which links to metadata about the shared document.
   * <br /><br />
   * Note that the linked transaction *shall not* reveal publicly,
   * the location of said shared document. Please use `@dhealth/dimi-sdk`
   * for further definition around handshakes and consent requests.
   *
   * @access public
   * @example `"59A422A39FC4E03940420F0000000000007468697320697320746865206D6573"`
   * @var {string}
   */
  scope: string;

  /**
   * Contains an *encrypted* message from the consent *requester*
   * which should describe the purpose of getting access to the
   * shared document.
   *
   * @access public
   * @example `...`
   * @var {string}
   */
  purpose: string;
}

/**
 * @class Consent
 * @description This class contains the implementation of the
 * *consent* contract which is used to discover consent requests
 * in the FOLIO dApp.
 * <br /><br />
 * Use this class whenever you are interpreting an operation of
 * consent for your dApp. Also, an instance of this class is created
 * using {@link Factory.createFromJSON} given a contract signature
 * that matches: `/:consent$/` (ends with).
 * <br /><br />
 * #### Parameters
 * Following *inputs* apply to the {@link Consent} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "folio". |
 * | `level` | `string` | **Required** | The access level that must be granted upon *accepting* this consent request, i.e. must contain on of: `view`, `edit` or `delete` |
 * | `scope` | `string` | **Required** | Contains the transaction hash of the *confirmed* transaction which links to metadata about the shared document. |
 * | `purpose` | `string` | **Required** | Contains an *encrypted* message from the consent *requester* which should describe the purpose of getting access to the shared document. |
 *
 * <br /><br />
 * @example Using the `Consent` contract class
 * ```ts
 * // creating a reward contract
 * const contract: Consent = new Consent({
 *   dappIdentifier: "folio",
 *   level: "read",
 *   scope: "...",
 *   purpose: "..."
 * });
 * ```
 * <br /><br />
 * #### Other links
 * {@link ConsentParameters} | {@link Contract} | {@link Factory}
 * <br /><br />
 * @since v1.0.0
 */
export class Consent extends Contract {
  /**
   * Construct a **consent** contract. Note that some of
   * the **inputs are required**.
   * <br /><br />
   * The consent contract *requires* inputs including the `dappIdentifier`,
   * the `level` of access requested, the `scope`of access and an encrypted
   * `purpose` that can be decrypted only by the recipient. Refer to the above
   * [parameters](#parameters) description for more details.
   *
   * @access public
   * @param   {ConsentParameters}   inputs      The inputs that are used during execution ("arguments").
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
     * The consent contract *requires* inputs including the `dappIdentifier`,
     * the `level` of access requested, the `scope`of access and an encrypted
     * `purpose` that can be decrypted only by the recipient. Refer to the above
     * [parameters](#parameters) description for more details.
     *
     * @access public
     * @example `{ dappIdentifier: "my-cool-dapp", level: "read" }`
     * @var {ConsentParameters}
     */
    public inputs: ConsentParameters,

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
    Assertions.assertObligatoryFields(
      ["level", "scope", "purpose"],
      Object.keys(inputs)
    );
  }

  /**
   * This method should return a `string` that is used as the
   * *identifier of the contract* being executed.
   * <br /><br />
   * This identifier will be concatenated with the dApp identifier
   * to form the *contract signature*.
   * <br /><br />
   * This method should return an identifier that is unique
   * across *one dApp*, i.e. it is OK to re-define an `consent`
   * contract in a different dApp than FOLIO.
   *
   * @access public
   * @abstract
   * @returns {string}  A contract identifier as present on-chain in the contract signature.
   */
  public get identifier(): string {
    return "consent";
  }

  /**
   * This method should return an {@link ObjectLiteral} that consists of
   * the **body** of the contract, e.g. in the {@link Consent} contract
   * the body contains a *date*, a *scope* and a *purpose*.
   * <br /><br />
   * In the consent contract, we **always** include the `level`, `scope`
   * and `purpose` fields.
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
    // listed fields are obligatory
    const fields: ObjectLiteral = {
      level: this.inputs.level,
      scope: this.inputs.scope,
      purpose: this.inputs.purpose,
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
   * <br /><br />
   * Note that the {@link Consent} contract *does not* attach any
   * mosaics to the transfer transaction.
   *
   * @access protected
   * @returns {Mosaic[]}   An array of *assets* and *amounts thereof* that are attached to a transfer transaction.
   */
  protected getMosaics(): Mosaic[] {
    // by default, this uses a 0-amount `DHP` attachment
    // CAUTION: removing this 0-amount mosaics entry breaks
    // compatibility for signing transactions with dHealth
    // Mobile Wallet - We attach a 0-amount DHP entry because
    // dHealth Mobile Wallet *always* expects a mosaics entry.
    let assetId: string = this.parameters.currencyMosaicId;
    let amount: number = 0;

    // returns a dHealth Network transfer transaction attachment
    return [new Mosaic(new MosaicId(assetId), UInt64.fromUint(amount))];
  }
}
