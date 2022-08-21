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
import { RuntimeError } from "@/errors/RuntimeError";

/**
 * @class InvalidArgumentError
 * @description This class is used for more transparent error
 * handling and as a base for other error classes. Note that
 * this class was added for future upgradeability in handling
 * errors.
 * <br /><br />
 * @example Throwing a `InvalidArgumentError` error
 * ```ts
 * throw new InvalidArgumentError("This argument is invalid.");
 * ```
 *
 * @link InvalidContractError
 * @link MissingContractFieldError
 * @link UnknownContractError
 * @since v0.3.0
 */
export class InvalidArgumentError extends RuntimeError {}
