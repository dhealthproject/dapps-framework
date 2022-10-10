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
 * @class OAuthCallbackRequest
 * @description This class defines the requirements for HTTP
 * requests that must include a `challenge` in the body.
 * <br /><br />
 * We enforce the presence of fields in this request class
 * using nestjs' `Body` guard that will automatically fail
 * when the challenge is not present or invalid.
 *
 * @since v0.3.0
 */
export class OAuthCallbackRequest {
  /**
   * The remote user identifier as attached by Strava in their
   * callback request. i.e. with the Strava OAuth Provider, this
   * field represents the *athlete identifier*.
   * <br /><br />
   * Note that this field is required and that it is forwarded to
   * a *subsequent request to the provider* which requests a pair
   * of accessToken/refreshToken for the user.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "abc12def",
    description:
      "The remote user identifier as attached by Strava in their callback request. i.e. with the Strava OAuth Provider, this field represents the *athlete identifier*.",
  })
  public identifier: string;

  /**
   * The *authorized* scope as attached by OAuth Providers with
   * regards to successful authorizations. e.g. with our Strava
   * integration, the scope used is "activity:read_all".
   * <br /><br />
   * Note that this field is required and that it is forwarded to
   * a *subsequent request to the provider* which requests a pair
   * of accessToken/refreshToken for the user.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "abc12def",
    description:
      "The authorized scope as attached by OAuth Providers with regards to successful authorizations. e.g. with our Strava integration, the scope used is 'activity:read_all'.",
  })
  public scope: string;

  /**
   * The code that Strava or other providers *may* attach to
   * their callback request. This should be forwarded from the
   * frontend to the backend as to *verify* the authenticity
   * of the callback request.
   * <br /><br />
   * Note that this field is optional, and when it is provided,
   * it will be forwarded to a *subsequent request to the provider*
   * which requests a pair of accessToken/refreshToken for the user.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "abc12def",
    description:
      "The authorization code as attached by Strava in their callback request. This should be forwarded from the frontend to the backend as to *verify* the authenticity of the callback request.",
  })
  public code?: string;

  /**
   * The state that Strava or other providers *may* attach to
   * their callback request. This should be forwarded from the
   * frontend to the backend as to *verify* the authenticity
   * of the callback request.
   * <br /><br />
   * Note that this field is optional, and when it is provided,
   * it will be forwarded to a *subsequent request to the provider*
   * which requests a pair of accessToken/refreshToken for the user.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "abc12def",
    description: "The authorization state as attached by Strava in their callback request. This should be forwarded from the frontend to the backend as to *verify* the authenticity of the callback request.",
  })
  public state?: string;
}
