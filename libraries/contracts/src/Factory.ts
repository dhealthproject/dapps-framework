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
import type { ObjectLiteral } from "@/types/ObjectLiteral";
import type { NetworkParameters } from "@/types/NetworkParameters";
import type { ContractParameters } from "./Contracts";
import { Contract } from "@/Contract";
import { Auth, AuthParameters } from "@/contracts/Auth";
import { Earn, EarnParameters } from "@/contracts/Earn";
import { Referral, ReferralParameters } from "@/contracts/Referral";
import { Welcome, WelcomeParameters } from "@/contracts/Welcome";
import { InvalidContractError } from "@/errors/InvalidContractError";
import { MissingContractFieldError } from "@/errors/MissingContractFieldError";
import { UnknownContractError } from "./errors/UnknownContractError";
import { dHealthNetwork } from "@/types/dHealthNetwork";

/**
 * @class Factory
 * @description This factory class can used to re-build contracts
 * from their JSON payloads or directly from the transactions that
 * included them.
 * <br /><br />
 * Use this factory whenever you would like to create a contract
 * instance from its' JSON payload or transaction content.
 * <br /><br />
 * @example Using the `Factory` class
 * ```ts
 * // re-creates the `Auth` contract
 * const contract1: Auth = Factory.createFromJSON({
 *   contract: "elevate:auth",
 *   version: 1,
 *   challenge: "abcdef12",
 * });
 *
 * // re-creates the `Referral` contract
 * const contract2: Referral = Factory.createFromJSON({
 *   contract: "elevate:referral",
 *   version: 1,
 *   refCode: "MY-REF-CODE",
 * });
 * ```
 *
 * @link Contract
 * @since v0.3.0
 */
export class Factory {
  /**
   * This *static* factory method creates a *contract instance*
   * using its' JSON payload as present on dHealth Network in
   * transfer transaction messages.
   * <br /><br />
   * Note that JSON payloads **must** contain a `contract` field,
   * as well as a `version` field. Additionally, for some contracts
   * it is possible that other fields are required, as defined by
   * their {@link Contract.body} implementation.
   * <br /><br />
   * As for the dApp identifier, that is attached in the `contract`
   * field, we authorize the use of uppercase characters just to
   * prevent unnecessary *errors* from happening due toinconsistent
   * end-user inputs, i.e. on-chain it is OK to use `"ELEvATE:auTH",
   * but we of course **recommend not to do that** and to rather
   * prefer using this library for creating contract, instead.
   *
   * @access public
   * @static
   * @param   {string | ObjectLiteral}  contractJSON    A `string` or {@link ObjectLiteral} object that contains the full JSON payload of the contract.
   * @param   {NetworkParameters}       parameters      (Optional) A configuration object that is used to overwrite the default network parameters.
   * @throws  {MissingContractFieldError}   Given missing one or more obligatory field(s) in the contract JSON payload.
   * @throws  {InvalidContractError}        Given contract JSON payload that contains **invalid JSON** and could not get parsed into a contract.
   * @throws  {UnknownContractError}        Given contract JSON payload that could not get parsed into a valid contract that extends {@link Contract}.
   * @returns {Contract}    An instance of a *child class* of {@link Contract} that has been built using the {@link contractJSON} JSON payload, e.g. {@link Auth}, {@link Earn}, {@link Welcome}.
   */
  public static createFromJSON(
    contractJSON: string | ObjectLiteral,
    parameters: NetworkParameters = new dHealthNetwork()
  ): Contract {
    // prepare the factory instance
    const factory = new Factory(parameters);

    // validates the contract content (JSON)
    // may throw `InvalidContractError`
    const contractObject: ObjectLiteral | null =
      factory.parseJSON(contractJSON);

    // some fields are obligatory and must be included
    const keys: string[] = Object.keys(contractObject);
    const obligatory = ["contract", "version"];

    // verify presence of mandatory fields
    if (obligatory.filter((k) => !keys.includes(k)).length) {
      throw new MissingContractFieldError(
        `` +
          `Some fields are missing in the contract. ` +
          `One of ${obligatory.join(" or ")} is not present ` +
          `but it is required to parse contracts.`
      );
    }

    // destructure the contract content
    const { contract, version, ...body } = contractObject;

    // find out the dapp identifier. note that we allow for
    // *uppercase* here as well, this prevents erroring for
    // inconsistent end-user input (e.g. "eleVaTe").
    const dappIdentifier: string = contract.replace(
      // eslint-disable-next-line
      /^([a-zA-Z0-9\._-]+):([a-zA-Z0-9\._-:]+)$/,
      "$1"
    );

    // re-builds the specialized instance
    return factory.buildContract(
      contract.toLowerCase(),
      version,
      { dappIdentifier, ...body } as ContractParameters,
      factory.parameters
    );
  }

  /**
   * Constructs an instance of this `Factory` class.
   * <br /><br />
   * Note that you *should not* use this method directly,
   * please refer to the *static API methods* instead.
   *
   * @access protected
   * @param  {NetworkParameters}  parameters    (Optional)  A configuration object that is used to overwrite the default network parameters.
   */
  protected constructor(
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
    private parameters: NetworkParameters = new dHealthNetwork()
  ) {}

  /**
   * This method *parses a contract's JSON payload* to create an
   * object of type {@link ObjectLiteral}. This is necessary to
   * further secure the processes that *manipulate* this created
   * object.
   * <br /><br />
   * Invalid JSON errors will trigger the {@link InvalidContractError}
   * exception to be thrown.
   * <br /><br />
   * This method is used internally to *transform* a `string` JSON
   * payload into an {@link ObjectLiteral} by making sure that the
   * JSON payload uses *valid JSON formatting rules*.
   *
   * @access protected
   * @param   {string | ObjectLiteral}  contractJSON    A `string` or {@link ObjectLiteral} object that contains the full JSON payload of the contract.
   * @throws  {InvalidContractError}    Given contract JSON payload that contains **invalid JSON** and could not get parsed into a contract.
   * @returns {ObjectLiteral}   A *parsed* contract consists of an `object` of type {@link ObjectLiteral}.
   */
  protected parseJSON(contractJSON: string | ObjectLiteral): ObjectLiteral {
    // the parsed contract is an object built from JSON
    let parsed: ObjectLiteral = {};

    // do we need to parse?
    if (typeof contractJSON === "string") {
      try {
        parsed = JSON.parse(contractJSON);
      } catch (e) {
        throw new InvalidContractError("A contract could not be parsed.");
      }
    }

    return parsed;
  }

  /**
   * This method parses the *contract signature* and creates a new instance
   * of a *child class* of {@link Contract}, attaching the *version*, the
   * *inputs* and *network parameters* to it, i.e. this method may return
   * instances from classes that include, but are not limited to: {@link Auth},
   * {@link Earn}, {@link Referral} or {@link Welcome}.
   * <br /><br />
   * Given an invalid {@link contract} signature, this method will trigger
   * the {@link UnknownContractError} to be thrown.
   * <br /><br />
   * This method is used internally to create a *matching* contract's child
   * class instance using the correct *inputs*, *version* and *parameters*.
   *
   * @access protected
   * @param   {string}                contract      A *contract signature* that consists of the dApp identifier and the contract identifier.
   * @param   {version}               version       A *contract version* that consists of a number set to identify the version of the contract implementation.
   * @param   {ContractParameters}    inputs        A set of *inputs* that are/were passed to the contract during runtime and that are attached to its JSON payload.
   * @param   {NetworkParameters}     parameters    The network parameters ("connection details") as present in the factory.
   * @returns {Contract}  An instance of a *child class* of {@link Contract} that has been built using the {@link contractJSON} JSON payload, e.g. {@link Auth}, {@link Earn}, {@link Welcome}.
   */
  protected buildContract(
    contract: string,
    version: number,
    inputs: ContractParameters,
    parameters: NetworkParameters
  ): Contract {
    // (1) e.g. "elevate:auth" contract
    // eslint-disable-next-line
    if (contract.match(/^([a-z0-9\._-]+):auth$/)) {
      return new Auth(inputs as AuthParameters, version, parameters);
    }
    // (2) e.g. "elevate:earn" contract
    // eslint-disable-next-line
    else if (contract.match(/^([a-z0-9\._-]+):earn$/)) {
      return new Earn(inputs as EarnParameters, version, parameters);
    }
    // (3) e.g. "elevate:referral" contract
    // eslint-disable-next-line
    else if (contract.match(/^([a-z0-9\._-]+):referral$/)) {
      return new Referral(inputs as ReferralParameters, version, parameters);
    }
    // (4) e.g. "elevate:welcome" contract
    // eslint-disable-next-line
    else if (contract.match(/^([a-z0-9\._-]+):welcome$/)) {
      return new Welcome(inputs as WelcomeParameters, version, parameters);
    }

    // Not Supported Yet
    throw new UnknownContractError(
      `The contract "${contract}" is currently not supported yet.`
    );
  }
}
