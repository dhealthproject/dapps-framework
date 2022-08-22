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
 * @class InvalidContractError
 * @description This class is used for more transparent error
 * handling. It is thrown, notably by the {@link Factory.parseJSON}
 * method that gets called internally when creating contract
 * instances from JSON payloads.
 * <br /><br />
 * This error is thrown when the attached *JSON payload* is
 * not represented as a *valid JSON object*.
 * <br /><br />
 * @example Throwing an `InvalidContractError` error
 * ```ts
 * throw new InvalidContractError("This JSON payload is invalid.");
 * ```
 * <br /><br />
 * #### Other links
 * {@link Factory.parseJSON}
 * <br /><br />
 * @since v0.3.0
 */
export class InvalidContractError extends InvalidArgumentError {}
