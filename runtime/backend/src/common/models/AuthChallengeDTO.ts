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
 * @class AuthChallengeDTO
 * @description A DTO class that consists of an authentication challenge.
 * <br /><br />
 * - The end-user includes this challenge in a transfer transaction
 *   to the dApp's authentication authority address.
 * - The dApp's processor scope catches these challenges on-chain
 *   and processes them.
 * - Frontends will receive a **cookie** that contains a OAuth-alike
 *   `"accessToken"` and `"refreshToken"`. The access token is short-
 *   lived and the refresh token can used to refresh the currently
 *   used access token whenever it expires.
 *
 * @since v0.3.0
 */
export class AuthChallengeDTO extends BaseDTO {
  /**
   * The authentication challenge that can be used to authenticate
   * a user to the dApp. This challenge must be included in a transaction
   * on dHealth Network such that an end-user can be considered logged-in.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "abc12def",
    description:
      "The authentication challenge that can be used to authenticate a user to the dApp.",
  })
  public challenge: string;
}
