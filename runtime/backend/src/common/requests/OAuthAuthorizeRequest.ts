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
 * @class OAuthAuthorizeRequest
 * @description This class defines the requirements for HTTP
 * requests that must include a `dhealthAddress` in the query.
 * <br /><br />
 * We enforce the presence of fields in this request class
 * using nestjs' `Query` guard that will automatically fail
 * when the challenge is not present or invalid.
 *
 * @since v0.3.0
 */
export class OAuthAuthorizeRequest {
  /**
   * The Address of the account on dHealth Network. This field
   * will be validated to hold the same value as the one of the
   * currently authenticated user (signed cookie).
   * i.e. this should be an authenticated end-user's address on
   * dHealth Network.
   * <br /><br />
   * This field is required in `/oauth/:provider` requests.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description: "The Address of the account on dHealth Network",
  })
  public dhealthAddress: string;

  /**
   * The referral code in the context of users invitations. This
   * code is typically attached to another end-user whom is then
   * considered the *referrer*.
   * <br /><br />
   * This field is optional in `/oauth/:provider` requests.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "ELEVATE2022",
    description:
      "The referral code in the context of users invitations. This code is typically attached to another end-user whom is considered the referrer.",
  })
  public ref?: string;
}
