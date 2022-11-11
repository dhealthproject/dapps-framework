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

/**
 * @class AccessTokenRequest
 * @description This class defines the requirements for HTTP
 * requests that must include a `challenge` in the body.
 * <br /><br />
 * We enforce the presence of fields in this request class
 * using nestjs' `Body` guard that will automatically fail
 * when the challenge is not present or invalid.
 *
 * @since v0.3.0
 */
export class AccessTokenRequest {
  /**
   * The authentication challenge that must be used on-chain
   * to authorize the access using a given {@link Account}, i.e.
   * in other APIs this would map to the "password".
   * <br /><br />
   * Note that this authentication challenge must be *attached* to an
   * [encrypted] transfer transaction on dHealth Network, which also
   * requires it to be **signed** accordingly.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "abc12def",
    description:
      "The authentication challenge that can be used to authenticate a user to the dApp.",
  })
  public challenge: string;

  /**
   * A referral code *may* be attached to this request to mark that the
   * authenticating account was *invited* to the dApp by another account.
   * <br /><br />
   * Note that this property *must* contain a *valid*, 8-characters long,
   * referral code previously attached to an `accounts` document.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "JOINFIT22-4234432424",
    description:
      "A referral code *may* be attached to this request to mark that the authenticating account was *invited* to the dApp by another account.",
  })
  public referralCode?: string;

  /**
   * The JWT sub value that can be attached in the **bearer
   * authorization header** of HTTP requests to serve as a
   * unique identity of each device.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "5d60ad3bcd08fa119b77a7e5ef72dae509d291e33ccf75d93b4c155e61db55d7",
    description:
      "The JWT sub value that can be attached in the **bearer authorization header** of HTTP requests to serve as a unique identity of each device.",
  })
  public sub: string;
}
