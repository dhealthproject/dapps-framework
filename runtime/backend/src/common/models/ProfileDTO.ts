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
import { AccountDTO } from "./AccountDTO";

/**
 * @class ProfileDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an augmented account, a "profile".
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about accounts to be revealed.
 *
 * @since v0.3.2
 */
export class ProfileDTO extends AccountDTO {
  /**
   * The OAuth *integrations* that are enabled for one {@link AccountDTO}
   * object. This array contains *provider identifiers*, e.g. `"strava".
   *
   * @example `["strava"]`
   * @access public
   * @var {string[]}
   */
  @ApiProperty({
    type: "string",
    isArray: true,
    example: ["strava"],
    description:
      "The OAuth integrations that are enabled for one account. This array should contain provider identifiers, e.g. 'strava'.",
  })
  public integrations: string[];
}
