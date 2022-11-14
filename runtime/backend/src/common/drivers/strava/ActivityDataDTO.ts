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
import { ObjectLiteral } from "@dhealth/contracts";
import dayjs from "dayjs";

// internal dependencies
import { OAuthEntity, OAuthEntityType } from "../OAuthEntity";
import { BasicRemoteDTO } from "../BasicRemoteDTO";

/**
 * @label STRAVA
 * @class ActivityDataDTO
 * @description This class defines the fields and methods of an
 * **activity** as defined by the *Strava API*.
 * <br /><br />
 * The fields of this class take values as defined in the Strava
 * documentation for the `DetailedActivity` model, see below for
 * a link to the fields documentation.
 * <br /><br />
 * Note that we do not extract and interpret *all fields* that are
 * shared by Strava.
 *
 * @link https://developers.strava.com/docs/reference/#api-models-DetailedActivity
 * @since v0.4.0
 */
export class ActivityDataDTO extends BasicRemoteDTO {
  /**
   * The type of entity represented in this object.
   *
   * @access public
   * @var {OAuthEntityType}
   */
  public readonly type: OAuthEntityType = OAuthEntityType.Activity;

  /**
   * The column names as they are represented in the backend runtime
   * database for `activities.activityData` documents.
   * <br /><br />
   * Note that the fields listed here *will be* stored in documents.
   *
   * @access public
   * @readonly
   * @var {string[]}
   */
  public readonly columns: string[] = [
    "name",
    "sport",
    "startedAt",
    "timezone",
    "startLocation",
    "endLocation",
    "hasTrainerDevice",
    "elapsedTime",
    "movingTime",
    "distance",
    "elevation",
    "kilojoules",
    "calories",
    "isManual",
    "sufferScore",
  ];

  /**
   * The name of the activity.
   *
   * @access public
   * @var {string}
   */
  public name: string;

  /**
   * A text value that determines the type of sport.
   *
   * @link https://developers.strava.com/docs/reference/#api-models-SportType
   * @access public
   * @var {string}
   */
  public sport: string;

  /**
   * The time at which the activity was started, expressed in *milliseconds*
   * since the UTC epoch.
   *
   * @access public
   * @var {number}
   */
  public startedAt: number;

  /**
   * The local timezone used during completion of this activity. This is
   * the timezone of the *end-user* and can be used to format {@link startedAt}
   * accordingly.
   *
   * @access public
   * @var {string}
   */
  public timezone: string;

  /**
   * A geolocation pair of `latitude/longitude` expressed in an array of
   * *float numbers* which represents the *start location* of an activity.
   * <br /><br />
   * If the end-user *disables* sharing of geolocation, this field will
   * contain an empty array.
   *
   * @link https://developers.strava.com/docs/reference/#api-models-LatLng
   * @access public
   * @var {number[]}
   */
  public startLocation: number[];

  /**
   * A geolocation pair of `latitude/longitude` expressed in an array of
   * *float numbers* which represents the *end location* of an activity.
   * <br /><br />
   * If the end-user *disables* sharing of geolocation, this field will
   * contain an empty array.
   *
   * @link https://developers.strava.com/docs/reference/#api-models-LatLng
   * @access public
   * @var {number[]}
   */
  public endLocation: number[];

  /**
   * Whether this activity was recorded on a *training maching* (device).
   *
   * @access public
   * @var {boolean}
   */
  public hasTrainerDevice: boolean;

  /**
   * The total number of *seconds* elapsed for completion of this
   * activity. This represents the time that was necessary to complete
   * the activity from begin to end (including breaks).
   * <br /><br />
   * Note that this field contains a number of **seconds**.
   *
   * @access public
   * @var {number}
   */
  public elapsedTime: number;

  /**
   * The total number of *seconds* during which the end-user has been
   * moving during execution of this activity. This represents the time
   * during which some *movement(s)* were recorded.
   * <br /><br />
   * Note that this field contains a number of **seconds**.
   *
   * @access public
   * @var {number}
   */
  public movingTime: number;

  /**
   * The total distance covered with this activity. This represents the
   * total number of *meters* covered.
   * <br /><br />
   * Note that this field contains a number of **meters**.
   *
   * @access public
   * @var {number}
   */
  public distance: number;

  /**
   * The total elevation gain with this activity. This represents the
   * total number of *meters* that were "climbed" during the execution
   * of the activity.
   * <br /><br />
   * Note that this field contains a number of **meters**.
   *
   * @access public
   * @var {number}
   */
  public elevation: number;

  /**
   * The total work done in kilojoules during this activity. This field
   * is filled only for *rides*.
   * <br /><br />
   * Note that this field contains a number of **kilojoules**.
   *
   * @access public
   * @var {number}
   */
  public kilojoules: number;

  /**
   * The number of kilocalories consumed during this activity. This
   * field is filled only for activities with a high-enough intensity.
   * <br /><br />
   * Note that this field contains a number of **kilocalories**.
   *
   * @access public
   * @var {number}
   */
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
  public isManual: boolean;

  /**
   * The suffer score attributed to this activity *by Strava*.
   * We store a copy of this value so that we can evaluate its
   * usage in our formulas.
   * <br /><br />
   * Note that this field is sometimes `null` when received from
   * Strava, in those cases this field is set to `-1`.
   *
   * @access public
   * @var {sufferScore}
   */
  public sufferScore: number;

  /**
   * This method shall *extract* an entity's definition (field values)
   * from an API response object.
   * <br /><br />
   * In the implementation below, the *right-hand-side* values use the
   * field names as defined by the data provider and the *left-hand-side*
   * values use the field names as defined by the runtime database.
   * <br /><br />
   * This method is a requirement defined in {@link OAuthEntity}.
   *
   * @access public
   * @static
   * @param   {ObjectLiteral | any}   data   The `data` field of the API Response (contains the entity columns).
   * @returns {ActivityDataDTO}       The extracted object literal that contains the entity columns.
   */
  public static createFromDTO(data: ObjectLiteral | any): ActivityDataDTO {
    const activity = new ActivityDataDTO();
    activity.name = data.name;
    activity.sport = data.sport_type;
    activity.startedAt = dayjs(data.start_date).toDate().valueOf();
    activity.timezone = data.timezone;
    activity.startLocation = data.start_latlng;
    activity.endLocation = data.end_latlng;
    activity.hasTrainerDevice = data.trainer;
    activity.elapsedTime = data.elapsed_time;
    activity.movingTime = data.moving_time;
    activity.distance = data.distance;
    activity.elevation = data.total_elevation_gain;
    activity.kilojoules = data.kilojoules;
    activity.calories = data.calories;
    activity.isManual = data.manual;
    activity.sufferScore = null === data.suffer_score ? -1 : data.suffer_score;
    return activity;
  }

  /**
   * This constructor is private as to avoid the creation of instances
   * *outside of this implementation*. This allows us to make sure that
   * activities as *scoped inside the Strava OAuth Driver*, always use
   * the correct format and are always transformed correctly.
   * <br /><br />
   * To create an instance of this class, you must use the static method
   * {@link ActivityDataDTO.createFromDTO}.
   *
   * @access protected
   */
  protected constructor() {
    super();
  }
}
