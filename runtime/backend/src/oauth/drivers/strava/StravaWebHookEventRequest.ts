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
 * @label STRAVA
 * @class StravaWebHookEventRequest
 * @description This class defines the requirements for HTTP
 * requests that is issued by third-party data providers to
 * mark the creation or update of an event on their platform.
 * <br /><br />
 * We enforce the presence of fields in this request class
 * using nestjs' `Query` guard that will automatically fail
 * when the fields are not present or invalid.
 * <br /><br />
 * This class is used in {@link WebHooksController.event} to type the request
 * body as required for valid endpoint requests.
 *
 * @since v0.3.2
 */
export class StravaWebHookEventRequest {
  /**
   * The type of object that serves as a subject in the event. This
   * consists of a string that always contains one of: 'athlete' or
   * 'activity'.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "activity",
    description:
      "The type of object that serves as a subject in the event. This consists of a string that always contains one of: 'athlete' or 'activity'.",
  })
  public object_type: string;

  /**
   * The identifier of the object that serves as a subject in the
   * event. This consists of an activity identifier (for activity
   * events) or an athlete identifier (for athlete events).
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "12345",
    description:
      "The identifier of the object that serves as a subject in the event. This consists of an activity identifier (for activity events) or an athlete identifier (for athlete events).",
  })
  public object_id: string;

  /**
   * The type of event being served. This consists of a string that
   * always contains one of: 'create', 'update' or 'delete'.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "activity",
    description:
      "The type of event being served. This consists of a string that always contains one of: 'create', 'update' or 'delete'.",
  })
  public aspect_type: string;

  /**
   * The identifier of the athlete that created/updated/deleted
   * the event. This consists of an athlete identifier.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "12345",
    description:
      "The identifier of the athlete that created/updated/deleted the event. This consists of an athlete identifier.",
  })
  public owner_id: string;

  /**
   * The identifier of the webhook subscription. This consists
   * of a Strava-owned webhook subscription identifier.
   * <br /><br />
   * One subscription is always attached to *one app* and is
   * created by Strava or other third-party data providers.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 12345,
    description:
      "The identifier of the webhook subscription. This consists of a Strava-owned webhook subscription identifier.",
  })
  public subscription_id: number;

  /**
   * The time of the event being served. This consists of a UTC
   * timestamp at which the activity or athlete was created or
   * updated.
   * <br /><br />
   * Note that this fields contains *seconds elapsed* since
   * January 1st of 1970, *not milliseconds* as usual with `Date`.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 1516126040,
    description:
      "The time of the event being served. This consists of a UTC timestamp at which the activity or athlete was created or updated.",
  })
  public event_time: number;
}
