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
 * @label STRAVA
 * @class StravaWebHookSubscriptionRequest
 * @description This class defines the requirements for HTTP
 * requests that must include a complex `hub` in the HTTP query.
 * <br /><br />
 * We enforce the presence of fields in this request class
 * using nestjs' `Query` guard that will automatically fail
 * when the fields are not present or invalid.
 * <br /><br />
 * This class is used in {@link WebHooksController.subscribe} to type the request
 * format as required for valid endpoint requests.
 *
 * @since v0.3.2
 */
export class StravaWebHookSubscriptionRequest {
  /**
   * The webhook subscription validation object. This field consists of
   * several fields that are Strava-specific and may be different with
   * other data providers, e.g. Apple Health.
   *
   * @access public
   * @var {StravaWebHookSubscriptionFields}
   */
  @ApiProperty({
    type: StravaWebHookSubscriptionFields,
    example: { mode: "subscribe", challenge: "...", verify_token: "..." },
    description:
      "The webhook subscription validation object. This field consists of several fields that are Strava-specific and may be different with other data providers.",
  })
  public hub: StravaWebHookSubscriptionFields;
}
