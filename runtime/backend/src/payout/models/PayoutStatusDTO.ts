/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { ApiProperty } from "@nestjs/swagger";

// internal dependencies
import { BaseDTO } from "../../common/models/BaseDTO";

/**
 * @enum PayoutState
 * @description A type enumeration that consists of *possible values*
 * for payout state fields. These values determine whether a payout
 * *has been executed* before or not.
 *
 * @since v0.4.0
 */
export enum PayoutState {
  Not_Started = 0,
  Prepared = 1,
  Broadcast = 2,
  Confirmed = 3,
  Failed = -1,
  Not_Eligible = -2,
}

/**
 * @class PayoutStatusDTO
 * @description A DTO class that consists of a **status** property
 * only and can be used to determine the state of individual payouts,
 * i.e. to determine whether a payout was executed before.
 *
 * @since v0.4.0
 */
export class PayoutStatusDTO extends BaseDTO {
  /**
   * Contains the status of executing a payout. This property may contain
   * one of the following values as listed in {@link PayoutState}.
   *
   * @example `1` or `0` or `-1`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: Number,
    example: 1,
    description: "A payout state expressed using the PayoutState enumeration.",
  })
  public status: PayoutState;

  /**
   * Creates an object instance of this DTO.
   *
   * @access public
   * @static
   * @param   {number}      code      The status code as defined by {@link PayoutState}
   * @returns {PayoutStatusDTO}   The created instance of this class, with provided `code`.
   */
  public static create(code: number): PayoutStatusDTO {
    const result = new PayoutStatusDTO();
    result.status = code;
    return result;
  }
}
