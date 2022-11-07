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
import { CompilerError } from "../../common/errors/CompilerError";

/**
 * @label ERRORS
 * @class InvalidPayoutSubjectError
 * @description This class is used for more transparent error
 * handling and indicates an error that happened due to some
 * unknown *payout subject type* being used. This error is
 * thrown by the static {@link PayoutSchema.fetchSubject}.
 * <br /><br />
 * @example Throwing a `InvalidPayoutSubjectError` error
 * ```ts
 * throw new InvalidPayoutSubjectError("This subject is invalid.");
 * ```
 * <br /><br />
 * @since v0.3.0
 */
export class InvalidPayoutSubjectError extends CompilerError {}
