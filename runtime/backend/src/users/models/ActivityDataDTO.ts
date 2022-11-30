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
import { BaseDTO } from "../../common/models/BaseDTO";

/**
 * @class ActivityDataDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an account's [remote] activity **data**.
 * <br /><br />
 * This object may represent [some] parts of an end-users Patient Health
 * Record, as such it is important that this data is not accessible to
 * unauthorized users.
 * <br /><br />
 * Note that the current implementation uses DiMi as a request guard, this
 * may change in the future.
 *
 * @since v0.3.2
 */
export class ActivityDataDTO extends BaseDTO {
  /**
   * The activity slug is composed of the date of the activity,
   * the index of it on a daily basis, the activity identifier and
   * the athlete identifier.
   *
   * @example `"20220910-1-65432-123456"`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: String,
    example: "20220910-1-65432-123456",
    description:
      "The activity slug is composed of the date of the activity, the index of it on a daily basis, the activity identifier and the athlete identifier.",
  })
  public slug: string;

  /**
   * The activity's *sport type* as defined by the data provider. This
   * field permits to differentiate the *type of activity* and corresponding
   * intensity of any activity.
   *
   * @link https://developers.strava.com/docs/reference/#api-models-SportType
   * @example `"Run"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: String,
    example: "Run",
    description:
      "The activity's sport type as defined by the data provider. Examples: 'Run', 'Walk', 'Ride', 'Workout'",
  })
  public sport: string;

  /**
   * The activity's *elapsed time* as defined by the data provider. This
   * field is used to keep track of the *total elapsed time* covered by an
   * end-user during individual activities.
   * <br /><br />
   * The total elapsed time is always expressed in **seconds**.
   *
   * @example `900`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: Number,
    example: 900,
    description:
      "The activity's elapsed time as defined by the data provider. The total elapsed time is always expressed in **seconds**.'",
  })
  public elapsedTime: number;

  /**
   * The activity's *covered distance* as defined by the data provider. This
   * field is used to keep track of the *total distance* covered by an
   * end-user during individual activities.
   * <br /><br />
   * The total distance is always expressed in **meters**.
   *
   * @example `1500`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: Number,
    example: 1500,
    description:
      "The activity's *covered distance* as defined by the data provider. The total distance is always expressed in **meters**.'",
  })
  public distance: number;

  /**
   * The activity's *covered elevation* as defined by the data provider. This
   * field is used to keep track of the *total elevation gain* covered by an
   * end-user during individual activities.
   * <br /><br />
   * The total elevation gain is always expressed in **meters**.
   *
   * @example `14.3`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: Number,
    example: 14.3,
    description:
      "The activity's *covered elevation* as defined by the data provider. The total elevation gain is always expressed in **meters**.'",
  })
  public elevation: number;

  /**
   * The activity's *calories burned* as defined by the data provider. This
   * field is *transformed* from data providers' output such that it stores
   * the *calories burned*, not as provided the *kilocalories burned*.
   * <br /><br />
   * The calories burned are always expressed in **calories** (not kCal).
   *
   * @example `14.3`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: Number,
    example: 14.3,
    description:
      "The activity's *calories burned* defined by the data provider and transformed to calories (cal) rather than kCal. The calories burned are always expressed in **calories** (not kCal).'",
  })
  public calories: number;

  /**
   * Determines whether the activity was *crafted by hand* or if
   * it is the result of an actual activity.
   * <br /><br />
   * Note that manual activities are not considered for payouts.
   *
   * @access public
   * @var {boolean}
   */
  @ApiProperty({
    type: Boolean,
    example: true,
    description:
      "Determines whether the activity was *crafted by hand* or if it is the result of an actual activity. Note that manual activities are not considered for payouts.",
  })
  public isManual: boolean;
}
