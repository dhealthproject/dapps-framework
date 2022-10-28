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
   * Referral code that must be used for identification
   * that user was referred by other user
   * <br /><br />
   * Can be optional
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "JOINFIT16667868627809199",
    description:
      "Referral code which is used for detecting if user was invited.",
  })
  public referralCode?: string;
}
