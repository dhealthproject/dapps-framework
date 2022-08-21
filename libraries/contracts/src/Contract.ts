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
import { Transaction } from "@dhealth/sdk";

// internal dependencies
import type { ContractParameters } from "@/types/ContractParameters";
import type { NetworkParameters } from "@/types/NetworkParameters";
import type { TransactionParameters } from "@/types/TransactionParameters";
import type { ObjectLiteral } from "@/types/ObjectLiteral";
import { MissingContractFieldError } from "@/errors/MissingContractFieldError";
import { dHealthNetwork } from "@/types/dHealthNetwork";

/**
 * @abstract
 * @class Contract
 * @description The contract class serves as a base for defining
 * digital contracts that are executed on dHealth Network. These
 * are currently always included in *transfer transactions* as a
 * JSON message and are versioned *individually* using a `version`
 * field.
 * <br /><br />
 * #### Parameters
 * Following *inputs* apply to the {@link Auth} contract class:
 * | Input | Type | Required? | Description |
 * | --- | --- | --- | --- |
 * | `dappIdentifier` | `string` | **Required** | The dApp identifier, e.g. "elevate". |
 * <br /><br />
 * @example Extending the `Contract` class
 * ```ts
 * class MyContract extends Contract {
 *   public get body(): ObjectLiteral {
 *     return { fakeKey: "fake-value" };
 *   }
 *
 *   public get identifier(): string {
 *     return "my-contract";
 *   }
 * }
 * ```
 *
 * @link Factory
 * @since v0.3.0
 */
export abstract class Contract {
  /**
   * Constructs a contract object. This constructor accepts {@link inputs},
   * a {@link version} field and network parameters in {@link parameters}.
   * <br /><br />
   * As noted in {@link ContractParameters}, the `dappIdentifier` is obligatory
   * and must be present in the **inputs**. Please, note that this identifier
   * must be unique for the dApp you are building or otherwise, inconsistencies
   * may occur while the backend runtime is processing operations.
   *
   * @access public
   * @param   {ContractParameters}  inputs      The inputs that are used during execution ("arguments").
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
     * Defaults to an empty inputs object that contains a dApp identifier
     * of `"unknown-dapp". Make sure to change that.
     *
     * @access protected
     * @example `{ dappIdentifier: "my-cool-dapp" }`
     * @var {ContractParameters}
     */
    protected inputs: ContractParameters = {
      dappIdentifier: "unknown-dapp",
    } as ContractParameters,

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
  ) {}

  /**
   * This getter method transforms the provided `dappIdentifier`
   * *input* into a **slug**. The characters set for valid slugs
   * includes: lowercase alpha-numerical characters, underscores
   * and hyphens. Additionally, multiple hyphens in a series are
   * replaced for single hyphens.
   * <br /><br />
   * This method is used internally to determine a dapp identifier
   * that is *compliant* to a strict characters set.
   *
   * @access private
   * @returns {string}  A *slugified* dApp identifier as present on-chain.
   */
  private get dApp(): string {
    return (
      this.inputs.dappIdentifier
        .toLowerCase()
        .replace(/\s+/g, "-") // space to hyphen
        // eslint-disable-next-line
        .replace(/[^a-z0-9\._-]/g, "") // limit chars
        .replace(/--+/g, "-")
    ); // multi hyphen to hyphen
  }

  /**
   * This getter method prepares the contract **header**. The
   * header consists of the *contract signature* and *version*
   * of the contract.
   * <br /><br />
   * The contract header is **always attached to contracts**
   * using the {@link toJSON} method.
   *
   * @access public
   * @returns {ObjectLiteral}   An *object* that consists of the contract signature and version.
   */
  public get header(): ObjectLiteral {
    return {
      contract: `${this.dApp}:${this.identifier}`,
      version: this.version,
    };
  }

  /**
   * This method creates a *JSON payload* using the contract
   * header and the custom body fields, as defined in child
   * classes.
   * <br /><br />
   * Note that the resulting `string` is attached as is to
   * the transfer transaction on dHealth Network.
   *
   * @access public
   * @returns {string}  A JSON payload that can be attached to transfer transactions.
   */
  public toJSON(): string {
    const { contract, version } = this.header;

    return JSON.stringify(
      {
        contract,
        version,
        ...this.body,
      },
      undefined, // replacer
      2 // spaces=2
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
   * across *one dApp*, i.e. it is OK to re-define an `earn`
   * contract in a different dApp than elevate.
   *
   * @access public
   * @abstract
   * @returns {string}  A contract identifier as present on-chain in the contract signature.
   */
  public abstract get identifier(): string;

  /**
   * This method should return an {@link ObjectLiteral} that consists of
   * the **body** of the contract, e.g. in the {@link Auth} contract
   * the body contains a *challenge*.
   * <br /><br />
   * Note that by modifying the *required* fields of a contract's
   * body, you **must** also update the *version* of the contract
   * to prevent inconsistencies in operations.
   *
   * @access public
   * @abstract
   * @returns {ObjectLiteral}  An object that consists of custom fields related to the scope of the contract.
   */
  public abstract get body(): ObjectLiteral;

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
  public abstract toTransaction(parameters: TransactionParameters): Transaction;

  /**
   * This method asserts the presence of *mandatory* inputs for
   * the execution of a contract. The first argument {@link obligatory}
   * can be used to list the obligatory field names and the second
   * argument {@link fields} must contain the fields present in
   * the JSON payload.
   *
   * @param   {string[]}  obligatory        An array of *obligatory* field names.
   * @param   {string[]}  fields            An array of *fields* as presented and to be checked.
   * @throws  {MissingContractFieldError}   Given missing one of {@link obligatory} (obligatory fields) in {@link fields}.
   * @returns {void}
   */
  protected assertObligatoryInputs(
    obligatory: string[],
    fields: string[]
  ): void {
    if (
      !fields.length ||
      obligatory.filter((k) => !fields.includes(k)).length > 0
    ) {
      throw new MissingContractFieldError(
        `` +
          `Some fields are missing in the contract. ` +
          `One of ${obligatory.join(" or ")} is not present ` +
          `but it is required.`
      );
    }
  }
}
