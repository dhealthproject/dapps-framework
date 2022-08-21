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
  Deadline,
  Mosaic,
  NetworkType,
  PublicAccount,
  UInt64,
} from "@dhealth/sdk";

// internal dependencies
import { Parameters } from "@/types/Parameters";

/**
 * @interface NetworkParameters
 * @description This interface defines the *requirements* for
 * objects passed as **network parameters** to {@link Contract}
 * instances.
 * <br /><br />
 * Use this interface whenever you are *trying to choose a network*
 * for which to prepare transactions. By default, we define and use
 * the {@link dHealthNetwork} implementation (child class).
 * <br /><br />
 * Please, be mindful when modifying the network parameters
 * as you may thereby invalidate transactions that are created
 * with this library. Use with caution.
 * <br /><br />
 * @example Using the `NetworkParameters` interface
 * ```ts
 * // creating network parameters (dHealth Network below)
 * const network = {
 *   generationHash: "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16",
 *   networkType: 104,
 *   epochAdjustment: 1616978397,
 *   currencyMosaicId: "39E0C49FA322A459", // dhealth.dhp
 * } as ContractParameters;
 * ```
 *
 * @link Contract
 * @link dHealthNetwork
 * @since v0.3.0
 */
export interface NetworkParameters extends Parameters {
  /**
   * Contains the *identifier* of the blockchain *network* and is
   * used as a security to prevent *transaction replays*. When
   * creating transactions, this identifier is attached so that
   * after *signing the transaction*, the transaction can only be
   * broadcast using dHealth Network Nodes.
   * <br /><br />
   * You should only ever change the *default* identifier when
   * you aim to *connect to a different network than dHealth
   * Network.*
   * <br /><br />
   * Please, be mindful when modifying the `generationHash` value
   * as you may thereby invalidate transactions that are created
   * with this library. Use with caution.
   *
   * @access public
   * @example `"ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"`
   * @var {string}
   */
  generationHash: string;

  /**
   * Contains the *type of network* that is used to broadcast
   * transactions. Typically, this can contain either of `104`
   * for a **MAINNET** network, or `152` for a **TESTNET**.
   * <br /><br />
   * You should only ever change the *default* network type
   * when you aim to *connect to a different network than dHealth
   * Network.*
   * <br /><br />
   * Please, be mindful when modifying the `networkType` value
   * as you may thereby invalidate transactions that are created
   * with this library. Use with caution.
   *
   * @access public
   * @example `104`
   * @var {NetworkType | number}
   */
  networkType: NetworkType | number;

  /**
   * Contains an the *UTC timestamp* in *seconds* which is used
   * as a security prevent *time-attacks* on dHealth Network.
   * <br /><br />
   * You should only ever change the *default* epoch adjustment
   * when you aim to *connect to a different network than dHealth
   * Network.*
   * <br /><br />
   * Please, be mindful when modifying the `epochAdjustment` value
   * as you may thereby invalidate transactions that are created
   * with this library. Use with caution.
   *
   * @access public
   * @example `1616978397`
   * @var {NetworkType | number}
   */
  epochAdjustment: number;

  /**
   * Contains a *mosaic identifier* in hexadecimal format. This
   * is the identifier of the **asset** used to pay for fees on
   * dHealth Network.
   * <br /><br />
   * You should only ever change the *default* asset identifier
   * when you aim to *connect to a different network than dHealth
   * Network.*
   * <br /><br />
   * Please, be mindful when modifying the `currencyMosaicId` value
   * as you may thereby invalidate transactions that are created
   * with this library. Use with caution.
   *
   * @access public
   * @example `1616978397`
   * @var {NetworkType | number}
   */
  currencyMosaicId: string;

  /**
   * This method should return a `NetworkType` instance as defined
   * in `@dhealth/sdk`. Typically, this can contain either of `104`
   * for a **MAINNET** network, or `152` for a **TESTNET**.
   *
   * @access public
   * @returns {NetworkType}   A number represented as one of the values in the enumeration `NetworkType`.
   */
  getNetworkType(): NetworkType;

  /**
   * This method should return a `Deadline` instance as defined
   * in `@dhealth/sdk`. The transaction deadline consists of the
   * *UTC timestamp* at which the *transaction shall expire* in
   * case it is not yet confirmed in a block.
   *
   * @access public
   * @returns {Deadline}   A *UTC timestamp* represented as an object of `Deadline`.
   */
  getDeadline(): Deadline;

  /**
   * This method should return an array of `Mosaic` instances as
   * defined in `@dhealth/sdk`. The transaction assets consists
   * of a set of **assets** that are attached to a transaction
   * on dHealth Network.
   *
   * @access public
   * @param   {number}    amount    The amount of *assets* to be attached ("how many").
   * @returns {Mosaic[]}   An array of *assets* and *amounts thereof* that are attached to a transfer transaction.
   */
  getMosaic(amount: number): Mosaic[];

  /**
   * This method should return the *maximum fee* that can be
   * paid for a transaction to be included in a block. This
   * amount is represented using the `UInt64` class as defined
   * in `@dhealth/sdk` and is *protected for number overflows*.
   *
   * @access public
   * @param   {number}    amount    The amount of *assets* to be attached as a **fee for the node operator**.
   * @returns {Mosaic[]}   A number of *assets* ("amount") that is attached to a transfer transaction as the *fee for the node operator*.
   */
  getMaxFee(amount: number): UInt64;

  /**
   * This method should return a `PublicAccount` instance as
   * defined in `@dhealth/sdk` and uses a *public key*, as well
   * as a *network type* to be able to create the correct account.
   * <br /><br />
   * The `PublicAccount` class of `@dhealth/sdk` permits to refer
   * to *pairs of public key and address* which belong together
   * and *can both be used to identify accounts*.
   * <br /><br />
   * As it is not possible to tell *a public key* from an address,
   * other than by executing *connected network requests*, we use
   * public keys so that we are **always** able to perform both
   * tasks: identifying an account (by an address) and verifying
   * transactions (with a public key).
   *
   * @access public
   * @param   {string}        publicKey     The account's public key. This is a `string` of `64` characters in hexadecimal notation.
   * @param   {NetworkType}   networkType   This can contain either of `104` for a **MAINNET** network, or `152` for a **TESTNET**.
   * @returns {PublicAccount}   A *public account information* from dHealth Network. This consists of a pair of *public key* and *address*.
   */
  getPublicAccount(publicKey: string, networkType: NetworkType): PublicAccount;
}
