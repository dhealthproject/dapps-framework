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
 * @class CompilerError
 * @description This class is used for more transparent error
 * handling and as a base for other error classes that happen
 * because of *development errors* and *build time errors*.
 * <br /><br />
 * An error that is an instance of this class indicates there
 * is something *wrong* with the added implementation or that
 * something is missing on top of what was implemented.
 * <br /><br />
 * @example Throwing a `CompilerError` error
 * ```ts
 * throw new CompilerError("This error happens at development time.");
 * ```
 * <br /><br />
 * #### Other links
 * {@link RuntimeError}
 * <br /><br />
 * @since v0.5.0
 */
export class CompilerError extends RuntimeError {}
