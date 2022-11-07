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
import { RuntimeError } from "./RuntimeError";

/**
 * @label ERRORS
 * @class ConfigurationError
 * @description This class is used for more transparent error
 * handling and indicates an error that happened due to some
 * inconsistent dApps configuration values.
 * <br /><br />
 * @example Throwing a `ConfigurationError` error
 * ```ts
 * throw new ConfigurationError("This configuration is invalid.");
 * ```
 * <br /><br />
 * @since v0.3.0
 */
export class ConfigurationError extends RuntimeError {}
