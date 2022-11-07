/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth Contracts
 * @subpackage  API
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label ERRORS
 * @class RuntimeError
 * @description This class is used for more transparent error
 * handling and as a base for other error classes. Note that
 * this class was added for future upgradeability in handling
 * errors.
 * <br /><br />
 * @example Throwing a `RuntimeError` error
 * ```ts
 * throw new RuntimeError("This error happens at runtime.");
 * ```
 * <br /><br />
 * #### Other links
 * {@link InvalidConfigurationError}
 * <br /><br />
 * @since v0.3.0
 */
export class RuntimeError extends Error {}
