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
 * @class ActivityDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an account's [remote] activity.
 *
 * @since v0.3.0
 */
export class ActivityDTO extends BaseDTO {
  /**
   * The Address of this account on dHealth Network. The
   * account's **address** typically refers to a human-readable
   * series of 39 characters, starting either with a `T`, for
   * TESTNET addresses, or with a `N`, for MAINNET addresses.
   *
   * @example `"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description: "The Address of the linked account on dHealth Network",
  })
  public address: string;

  /**
   * The activity slug is composed of the date of the activity,
   * the index of it on a daily basis, the activity identifier
   * and the athlete identifier.
   *
   * @example `"20220910-1-123456"`
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "string",
    example: "20220910-1-65432-123456",
    description:
      "The activity slug is composed of the date of the activity, the index of it on a daily basis, the activity identifier and the athlete identifier.",
  })
  public slug: string;

  /**
   * The OAuth provider name. This is usually the name of the
   * platform of which an account has completed an activity.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @example `"strava"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "strava",
    description:
      "The OAuth provider name. This is usually the name of the platform of which an account has completed an activity.",
  })
  public provider: string;

  /**
   * Activity type field.
   * Gets populated once user completes an activity.
   * <br /><br />
   * This field is **not required** and *not indexed*.
   *
   * @example `"swim"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "swim",
    description:
      "Sport type, gets defined by provider when user completes an activity",
  })
  public sport: string;

  /**
   * This property represents time that user spent
   * on completing activity.
   * <br /><br />
   * This field is **not required** and *not indexed*.
   *
   * @example `"swim"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "number",
    example: "234",
    description: "Time that user spent on completing activity",
  })
  public elapsedTime: number;

  /**
   * This field represents distance user completed during an activity.
   * <br /><br />
   * This field is **not required** and *not indexed*.
   *
   * @example `"swim"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "number",
    example: "100",
    description: "Distance completed by user per activity",
  })
  public distance: number;

  /**
   * This property represents an elevation gain
   * <br /><br />
   * This field is **not required** and *not indexed*.
   *
   * @example `"swim"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "number",
    example: "10",
    description: "Elevation gain received per activity",
  })
  public elevationGain: number;

  /**
   * This property represents an amount of received assets
   * <br /><br />
   * This field is **not required** and *not indexed*.
   *
   * @example `"swim"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "number",
    example: "15",
    description: "Amount of tokens received per activity",
  })
  public assets: number | any;
}
