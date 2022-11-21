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
 * @interface HandshakeParameters
 * @description This interface defines the *requirements* for
 * objects passed as **inputs** to {@link Handshake} instances.
 * <br /><br />
 * Use this interface whenever you are *using the `Handshake`* contract.
 * <br /><br />
 * Following *inputs* apply to the {@link Handshake} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "folio". |
 * | `issuer` | `string` | **Required** | This field should contain the *public key* of the *issuer* of the handshake, i.e. the account that initiates the handshake operation. |
 * | `recipient` | `string` | **Required** | This field should contain the *public key* of the *recipient* of the handshake, i.e. the account of the second participant in the handshake operation. |
 * | `operation` | `string` | **Required** | The transaction hash of the *confirmed* `AggregateComplete` transaction that contains a handshake operation and encryption keys. |
 *
 * <br /><br />
 * @example Using the `HandshakeParameters` class
 * ```ts
 * // creating handshake contract inputs
 * const inputs = {
 *   dappIdentifier: "my-cool-dapp",
 *   issuer: "ISSUER_PUBLIC_KEY",
 *   recipient: "RECIPIENT_PUBLIC_KEY",
 *   operation: "HANDSHAKE_TRANSACTION_HASH"
 * } as HandshakeParameters;
 * ```
 * <br /><br />
 * #### Other links
 * {@link Handshake} | {@link Contract} | {@link Factory}
 * <br /><br />
 * @since v1.0.0
 */
export interface HandshakeParameters extends ContractParameters {
  /**
   * This field should contain the *public key* of the *issuer*
   * of the handshake, i.e. the account that initiates the handshake
   * operation.
   *
   * @access public
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
   * @var {string}
   */
  issuer: string;

  /**
   * This field should contain the *public key* of the *recipient*
   * of the handshake, i.e. the account of the second participant
   * in the handshake operation.
   *
   * @access public
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
   * @var {string}
   */
  recipient: string;

  /**
   * Contains the transaction hash of the *confirmed* `AggregateComplete`
   * transaction that contains a handshake operation and encryption keys.
   * <br /><br />
   * Note that *handshake* contracts are only valid given that they refer to
   * the transaction hash of a **confirmed transaction** on dHealth Network.
   *
   * @access public
   * @example `"..."`
   * @var {string}
   */
  operation: string;
}

/**
 * @class Handshake
 * @description This class contains the implementation of the
 * *handshake* contract which is used to discover handshake requests
 * in the FOLIO dApp.
 * <br /><br />
 * Use this class whenever you are interpreting an operation of
 * handshake for your dApp. Also, an instance of this class is created
 * using {@link Factory.createFromJSON} given a contract signature
 * that matches: `/:handshake$/` (ends with).
 * <br /><br />
 * #### Parameters
 * Following *inputs* apply to the {@link Handshake} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "folio". |
 * | `issuer` | `string` | **Required** | This field should contain the *public key* of the *issuer* of the handshake, i.e. the account that initiates the handshake operation. |
 * | `recipient` | `string` | **Required** | This field should contain the *public key* of the *recipient* of the handshake, i.e. the account of the second participant in the handshake operation. |
 * | `operation` | `string` | **Required** | The transaction hash of the *confirmed* `AggregateComplete` transaction that contains a handshake operation and encryption keys. |
 *
 * <br /><br />
 * @example Using the `Handshake` contract class
 * ```ts
 * // creating a reward contract
 * const contract: Handshake = new Handshake({
 *   dappIdentifier: "folio",
 *   issuer: "ISSUER_PUBLIC_KEY",
 *   recipient: "RECIPIENT_PUBLIC_KEY",
 *   operation: "HANDSHAKE_TRANSACTION_HASH"
 * });
 * ```
 * <br /><br />
 * #### Other links
 * {@link HandshakeParameters} | {@link Contract} | {@link Factory}
 * <br /><br />
 * @since v1.0.0
 */
export class Handshake extends Contract {
  /**
   * Construct a **handshake** contract. Note that some of
   * the **inputs are required**.
   * <br /><br />
   * The handshake contract *requires* inputs including the `dappIdentifier`,
   * the `issuer` account public key, the `recipient` account public key and
   * an `operation` transaction hash. Refer to the above [parameters](#parameters)
   * description for more details.
   *
   * @access public
   * @param   {HandshakeParameters}   inputs      The inputs that are used during execution ("arguments").
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
     * The handshake contract *requires* inputs including the `dappIdentifier`,
     * the `issuer` account public key, the `recipient` account public key and
     * an `operation` transaction hash. Refer to the above [parameters](#parameters)
     * description for more details.
     *
     * @access public
     * @example `{ dappIdentifier: "my-cool-dapp", level: "read" }`
     * @var {HandshakeParameters}
     */
    public inputs: HandshakeParameters,

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
      ["issuer", "recipient", "operation"],
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
   * across *one dApp*, i.e. it is OK to re-define an `handshake`
   * contract in a different dApp than FOLIO.
   *
   * @access public
   * @abstract
   * @returns {string}  A contract identifier as present on-chain in the contract signature.
   */
  public get identifier(): string {
    return "handshake";
  }

  /**
   * This method should return an {@link ObjectLiteral} that consists of
   * the **body** of the contract, e.g. in the {@link Handshake} contract
   * the body contains a *date*, a *scope* and a *purpose*.
   * <br /><br />
   * In the handshake contract, we **always** include the `level`, `scope`
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
      issuer: this.inputs.issuer,
      recipient: this.inputs.recipient,
      operation: this.inputs.operation,
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
   * Note that the {@link Handshake} contract *does not* attach any
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
