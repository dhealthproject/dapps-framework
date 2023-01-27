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

export interface UserNotificationBody {
  address?: string; // if no address - notification is for everyone
  subjectId?: string; // if no subjectId - notification is for general purposes, e.g. strava integrated notification, welcome notification
  subjectType: "assets" | "activities" | "general";
  title: string;
  description: string;
  shortDescription: string;
  readAt?: string; // if no readAt - notification wasn't read
  createdAt: string | number;
}

/**
 * @class UserNotificationDTO
 * @description A DTO class that consists of notification properties
 *
 * @since v0.3.0
 */
export class UserNotificationDTO extends BaseDTO {
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
  public address?: string; // if no address - notification is for everyone

  /**
   * Subject id field, represents identifier
   * of subject which was received. Can be asset.id or activity.id
   *
   * @example `"6377bb780a56699ae5ca4e4c"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "6377bb780a56699ae5ca4e4c",
    description: "Id of the asset or of activity",
  })
  public subjectId?: string; // if no subjectId - notification is for general purposes, e.g. strava integrated notification, welcome notification

  /**
   * Subject type field represents notification
   * type assets or activities related. Can have
   * "general" type if notification related to general events
   * e.g. Registration, strava integration, etc.
   *
   * @example `"assets"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "assets",
    description: "Type of the notification",
  })
  public subjectType: "assets" | "activities" | "general";

  /**
   * Title of the notification which
   * describes notification in 2-3 words.
   *
   * @example `Successfully integrated strava`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "Successfully integrated strava",
    description: "Title of the notification",
  })
  public title: string;

  /**
   * Description of the notification
   * which explains notification in details.
   *
   * @example `You successfully integrated your strava account to your elevate profile, congrats!`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example:
      "You successfully integrated your strava account to your elevate profile, congrats!",
    description: "Full description of the notification",
  })
  public description: string;

  /**
   * Short description of the notifications
   * which should be displayed in notifications *preview*.
   *
   * @example `You successfully strava account`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "You successfully strava account",
    description: "Short description of the notification",
  })
  public shortDescription: string;

  /**
   * Property which represents date when user got read notification.
   *
   * @example `2022-11-18T17:06:00.330+00:00`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string | number",
    example: "2022-11-18T17:06:00.330+00:00",
    description: "Date when notification has been read by user.",
  })
  public readAt?: string | number;

  /**
   * Property which represents date when notification has been created.
   *
   * @example `2022-11-18T17:06:00.330+00:00`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string | number",
    example: "2022-11-18T17:06:00.330+00:00",
    description: "Date when notification has been created.",
  })
  public createdAt: string | number;
}
