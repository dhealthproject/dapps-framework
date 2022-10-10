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
 * @class StravaWebHookSubscriptionFields
 * @description This class consists of the required fields in order to
 * establish a connection and *webhook subscription process* with
 * third-party data providers.
 * <br /><br />
 * This class is used in {@link StravaWebHookSubscriptionRequest.hub} and
 * {@link StravaWebHookSubscriptionResponse.hub} to validate webhook
 * subscription.
 *
 * @since v0.3.2
 */
export class StravaWebHookSubscriptionFields {
  /**
   * The webhook request **mode**. This field should always contain 'subscribe'.
   * As described in the Strava Developer Documentation for webhooks, this
   * field is used solely to further differentiate webhooks events from the
   * subscription.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "subscribe",
    description:
      "The webhook request mode. This field should always contain 'subscribe'.",
  })
  public mode?: string;

  /**
   * The **challenge** that must be *echoed* by the callback, such that Strava
   * can verify the authenticity of the response.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "abc12def",
    description:
      "The challenge that must be echoed by the callback. This field consists in a verification field for Strava to detect the authenticity of a callback response.",
  })
  public challenge: string;

  /**
   * The callback request **verification token**. This field is included by
   * Strava in the callback request and allows us to verify the authenticity
   * of a callback request.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "abc12def",
    description:
      "The callback request verification token. This field is included by Strava in the callback request and allows us to verify the authenticity of a callback request.",
  })
  public verify_token?: string;
}
