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
 * @class GeolocationDTO
 * @description A DTO class that consists of the *transferable* properties
 * of a geolocation. Note this DTO *can* be used in mongo queries to perform
 * geo-queries as specified in following documentation:
 * - https://mongoosejs.com/docs/geojson.html
 * - https://www.mongodb.com/docs/manual/reference/geojson/
 * <br /><br />
 * Fields that use this type can be used in query operations like `$geoWithin`.
 *
 * @link https://www.rfc-editor.org/rfc/rfc7946#section-3.1.4
 * @since v0.3.2
 */
export abstract class GeolocationDTO extends BaseDTO {
  /**
   * The geolocation object type. Depending on the type of this geolocation
   * object, the value of the field {@link GeolocationDTO.coordinates} may
   * differ.
   * <br /><br />
   * This field may contain the following values:
   * | Type | Value Type | Description |
   * | --- | --- | --- |
   * | `Point` | `[number]` | An array of numbers specifying *longitude* and *latitude* - in this order. |
   * | `MultiPoint` | `number[][]` | An array of *positions coordinates*. |
   * | `LineString` | `number[]` | An array of *two or more* **positions**. |
   * | `MultiLineString` | `number[][]` | An array of *LineString* coordinate array. |
   * <br /><br />
   *
   * @example `"Point"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: String,
    enum: ["Point", "MultiPoint", "LineString", "MultiLineString"],
    example: "Point",
    description:
      "The geolocation object type. Depending on the type of this geolocation object, the value of the coordinates field may differ.",
  })
  public type: string;

  /**
   * The geolocation coordinates. Depending on the type of this geolocation
   * object, the value of this field may differ as noted in {@link GeolocationDTO.type}.
   * <br /><br />
   * Valid coordinates arrays consist of *numbers* that are included in the
   * following ranges:
   * - Valid longitude values are between `-180` and `180`, both inclusive.
   * - Valid latitude values are between `-90` and `90`, both inclusive.
   * <br /><br />
   * For more precision, it is possible that some values use *decimal* places.
   *
   * @example `"[39, 56]"`
   * @access public
   * @var {number[] | number[][] | number[][][]}
   */
  public abstract coordinates: number[] | number[][] | number[][][];
}
