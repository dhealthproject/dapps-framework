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
 * @class AccountSessionDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an account session.
 *
 * @since v0.3.2
 */
export class AccountSessionDTO extends BaseDTO {
  /**
   * The Address of this account on dHealth Network. The
   * account's **address** typically refers to a human-readable
   * series of 39 characters, starting either with a `T`, for
   * TESTNET addresses, or with a `N`, for MAINNET addresses.
   *
   * @example `"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description: "The Address of this account on dHealth Network",
  })
  public address: string;

  /**
   * The account's referral code. This code should be used when inviting
   * new users to the dApp. This field contains a unique random string of
   * 8 characters.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "string",
    example: "JOINFIT22-4234432424",
    description:
      "The account's referral code. This code should be used when inviting new users to the dApp.",
  })
  public referralCode: string;

  /**
   * The account's **referrer address**. This address refers to the
   * account that *invited* the current account to the dApp.
   * <br /><br />
   * This field is **optional** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description:
      "The account's referrer address. This address refers to the account whom *invited* the current account to the dApp.",
  })
  public referredBy?: string;

  /**
   * The JWT sub value that can be attached in the **bearer
   * authorization header** of HTTP requests to serve as a
   * unique identity of each device.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "5d60ad3bcd08fa119b77a7e5ef72dae509d291e33ccf75d93b4c155e61db55d7",
    description: "The JWT sub value that can be attached in the **bearer authorization header** of HTTP requests to serve as a unique identity of each device.",
  })
  public sub: string;

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
  public accessToken?: string;

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
  public refreshTokenHash?: string;

  /**
   * The transaction hash that is/was attached to the **last**
   * authenticated *session* of this account.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example:
      "3BB567908EFB0A6B642EE984D4DEC7CA4854266984DCB416164350B2A1078089",
    description:
      "The transaction hash that is/was attached to the last authenticated session of this account.",
  })
  public lastSessionHash?: string;
}