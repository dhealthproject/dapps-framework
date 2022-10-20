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
 * @class AccessTokenDTO
 * @description A DTO class that consists of an JWT access token
 * payload. This DTO *always* contains an access token that is
 * short-lived (1 hour) and a refresh token.
 * <br /><br />
 * Access tokens are always **signed** with the dApp's auth
 * secret and expire after 1 hour (one hour).
 *
 * @since v0.3.0
 */
export class AccessTokenDTO extends BaseDTO {
  /**
   * The identifier of the account at the data provider API.
   * This is a unique identifier for the account on said platform.
   * <br /><br />
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "123456",
    description:
      "The identifier of the account at the data provider API, this is a unique identifier for the account on said platform.",
  })
  public remoteIdentifier?: string;

  /**
   * The JWT access token that can be attached in the **bearer
   * authorization header** of HTTP requests to indicate users
   * that are authenticated ("logged in").
   * <br /><br />
   * Access tokens are always **signed** with the dApp's auth
   * secret and expire after 1 hour (one hour).
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    description:
      "The JWT access token that can be attached in the **bearer authorization header** of HTTP requests to indicate users that are authenticated - a.k.a logged in.",
  })
  public accessToken: string;

  /**
   * The JWT refresh token that can be attached in the **bearer
   * authorization header** of HTTP requests to `/auth/token` to
   * indicate that a user's access token must be refreshed.
   * <br /><br />
   * Refresh tokens are always **signed** with the dApp's auth
   * secret and expire after 1 year (one year).
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    description:
      "The JWT refresh token that can be attached in the **bearer authorization header** of HTTP requests to `/auth/token` to indicate that a user's access token must be refreshed.",
  })
  public refreshToken?: string;

  /**
   * The JWT access token expiration timestamp. This timestamp
   * uses the `UTC` timezone.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 1662571893676,
    description:
      "The JWT access token expiration timestamp. This timestamp uses the `UTC` timezone.",
  })
  public expiresAt?: number;
}
