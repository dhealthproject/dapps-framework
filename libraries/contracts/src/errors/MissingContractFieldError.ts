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
import { InvalidArgumentError } from "@/errors/InvalidArgumentError";

/**
 * @class MissingContractFieldError
 * @description This class is used for more transparent error
 * handling. It is thrown, notably by the {@link Factory.buildContract}
 * method that gets called internally when creating contract
 * instances from JSON payloads or transactions.
 * <br /><br />
 * This error is thrown when the attached *contract inputs* and
 * *contract body* are missing one or more *obligatory* fields.
 * <br /><br />
 * @example Throwing an `MissingContractFieldError` error
 * ```ts
 * throw new MissingContractFieldError("This field is missing but it is required.");
 * ```
 *
 * @link Factory.buildContract
 * @since v0.3.0
 */
export class MissingContractFieldError extends InvalidArgumentError {}
