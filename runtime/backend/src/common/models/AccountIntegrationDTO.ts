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
 * @class AccountIntegrationDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an OAuth *integration*.
 *
 * @since v0.3.0
 */
export class AccountIntegrationDTO extends BaseDTO {
  /**
   * The Address of this account on dHealth Network.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description: "The Address of the linked account on dHealth Network",
  })
  public address: string;

  /**
   * The OAuth provider name.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    example: "strava",
    description:
      "The name of the OAuth provider that an account has authorized.",
  })
  public name: string;
}
