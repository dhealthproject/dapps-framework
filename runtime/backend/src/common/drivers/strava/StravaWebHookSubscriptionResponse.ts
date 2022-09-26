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
import { StravaWebHookSubscriptionFields } from "./StravaWebHookSubscriptionFields";

/**
 * @class StravaWebHookSubscriptionResponse
 * @description A response class that consists of fields that are
 * included in the response of a *successful* callback request for
 * the *webhook subscription process* with third-party data providers.
 * <br /><br />
 * This class is used in {@link WebHooksController.event} to type the response
 * format as returned for successful webhook subscriptions.
 *
 * @since v0.3.0
 */
export class StravaWebHookSubscriptionResponse {
  /**
   * The webhook subscription validation object. This field consists of
   * only the `challenge` field and is Strava-specific. Other data providers
   * may require the presence of different fields to *complete* the webhook
   * subscription process.
   *
   * @access public
   * @var {StravaWebHookSubscriptionFields}
   */
  @ApiProperty({
    type: StravaWebHookSubscriptionFields,
    example: { challenge: "..." },
    description:
      "The webhook subscription validation object. This field consists of several fields that are Strava-specific and may be different with other data providers.",
  })
  public hub: StravaWebHookSubscriptionFields;
}
