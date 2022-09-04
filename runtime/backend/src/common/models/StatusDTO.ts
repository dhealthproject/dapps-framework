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
import { BaseDTO } from "./BaseDTO";

/**
 * @class StatusDTO
 * @description A DTO class that consists of a **status** property
 * only and can be used to determine the correct execution of requests.
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about module states to be revealed.
 *
 * @since v0.3.0
 */
export class StatusDTO extends BaseDTO {
  /**
   * Contains the HTTP status code sent with the response
   * object. Successful requests shall contain `200` as the
   * status code.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    example: 200,
    description: "The HTTP status code sent with the response.",
  })
  public code: number;

  /**
   * Contains `true` given a successful request,
   * or false otherwise.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: true,
    description:
      "Contains `true` given a successful request, or false otherwise.",
  })
  public status: boolean;

  /**
   *
   */
  public static create(code: number): StatusDTO {
    const result = new StatusDTO();
    result.code = code;
    result.status = code === 200;
    return result;
  }
}
