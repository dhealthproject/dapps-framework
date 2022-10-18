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
import { AxiosResponse } from "axios";

// internal dependencies
import { BaseDTO } from "./BaseDTO";

/**
 * @class ResponseStatusDTO
 * @description A DTO class that consists of a **status** property
 * and an attached **response**, which can be used to determine the
 * correct execution of requests and read the response object.
 *
 * @since v0.3.2
 */
export class ResponseStatusDTO extends BaseDTO {
  /**
   * Contains the HTTP status code sent with the response
   * object. Successful requests shall contain `200` as the
   * status code.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
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
    type: "boolean",
    example: true,
    description:
      "Contains `true` given a successful request, or false otherwise.",
  })
  public status: boolean;

  /**
   * Contains the response object given a successful request,
   * or `undefined` otherwise.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "object",
    example: { field: "value" },
    description:
      "Contains the response object given a successful request, or `undefined` otherwise.",
  })
  public response?: any;

  /**
   * Helper getter method to skip duplicate "data" fields in source code.
   *
   * @access public
   * @returns {any}
   */
  public get data(): any {
    // forwards this directly to the actual "data" from AxiosResponse
    if (undefined !== this.response && "data" in this.response) {
      return this.response.data;
    }

    // or return the object untouched
    return this.response;
  }

  /**
   * Creates an object instance of this DTO.
   *
   * @access public
   * @static
   * @param   {number}      code   The HTTP status code sent with the response object.
   * @returns {StatusDTO}          The created instance of this class, with provided `code`.
   */
  public static create(code: number, response: any = {}): ResponseStatusDTO {
    const result = new ResponseStatusDTO();
    result.code = code;
    result.status = code === 200;
    result.response = response;
    return result;
  }
}
