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
import { MissingContractFieldError } from "../errors/MissingContractFieldError";

/**
 * @class Assertions
 * @description
 */
export class Assertions {
  /**
   * This method asserts the presence of *mandatory* fields for
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
  public static assertObligatoryFields(
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
