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
   * The Address of this account on dHealth Network. The
   * account's **address** typically refers to a human-readable
   * series of 39 characters, starting either with a `T`, for
   * TESTNET addresses, or with a `N`, for MAINNET addresses.
   *
   * @example `"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"`   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description: "The Address of the linked account on dHealth Network",
  })
  public address: string;

  /**
   * The OAuth integration *provider name*. This is usually
   * the name of the platform of which an account is being
   * linked to the dApp.
   *
   * @example `"strava"`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "string",
    example: "strava",
    description:
      "The name of the OAuth provider that an account has authorized.",
  })
  public name: string;
}
