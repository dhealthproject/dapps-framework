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
import { BaseDTO } from "./BaseDTO";

/**
 * @class ActivityDTO
 * @description A DTO class that consists of an activity.
 * <br /><br />
 * - Frontend will receive object, will contain fields from DTO,
 * but not limited to that
 *
 * @since v0.3.0
 */
export class ActivityDTO extends BaseDTO {
  /**
   * Object type, example: object_type: "activitity"
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "activitity",
    description: "Type of onject to create",
  })
  public object_type: string;
  /**
   * Object id, example: object_type: "11111"
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "11111",
    description: "Id of created object",
  })
  public object_id: string;
  /**
   * Aspect type, example: object_type: "create"
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "create",
    description: "Aspect type",
  })
  public aspect_type: string;
  /**
   * Owner id, example: owner_id: "QQQQQQ-WWWWWW-RRRRRR-TTTTTT-YYYYYY-UUUUUU-III"
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "QQQQQQ-WWWWWW-RRRRRR-TTTTTT-YYYYYY-UUUUUU-III",
    description: "User's hash address",
  })
  public owner_id: string;
}
