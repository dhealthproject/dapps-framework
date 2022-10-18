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
 * @enum ProcessingState
 * @description A type enumeration that consists of *possible values*
 * for processing state fields. These values determine whether an entity
 * *has been processed* before or not.
 *
 * @since v0.3.2
 */
export enum ProcessingState {
  Not_Processed = 0,
  Processed = 1,
  Failed = -1,
}

/**
 * @class ProcessingStatusDTO
 * @description A DTO class that consists of a **status** property
 * only and can be used to determine the state of processing individual
 * entities, i.e. to determine whether an entity was processed before.
 *
 * @since v0.3.2
 */
export class ProcessingStatusDTO extends BaseDTO {
  /**
   * Contains the status of processing of an entity. This property may contain
   * one of the following values as listed in {@link ProcessingState}.
   *
   * @example `1` or `0` or `-1`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: Number,
    example: 1,
    description: "The processing state for an attached entity.",
  })
  public status: ProcessingState;

  /**
   * Creates an object instance of this DTO.
   *
   * @access public
   * @static
   * @param   {number}      code      The status code as defined by {@link ProcessingState}
   * @returns {ProcessingStatusDTO}   The created instance of this class, with provided `code`.
   */
  public static create(code: number): ProcessingStatusDTO {
    const result = new ProcessingStatusDTO();
    result.status = code;
    return result;
  }
}
