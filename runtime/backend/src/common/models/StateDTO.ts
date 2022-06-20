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
import type { StateData } from "./StateData";

/**
 * @class StateDto
 * @description A DTO class that consists of a **module** `name`
 * and a `data` field that may contain custom fields in the form
 * of an object.
 * <br /><br />
 * This class shall be used to **respond** to queries for the mongo
 * `states` collection documents.
 *
 * @since v0.1.0
 */
export class StateDTO {
  /**
   * Contains the name of this state cache entry. An example name
   * may be `"discovery"`, or `"payout"` which correspond to a
   * dynamic module that the runtime configuration has enabled.
   * <br /><br />
   * It is recommended to use **camelCase** or **snake_case** for
   * state cache names because these may refer to subfolders of the
   * source code.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public name: string;

  /**
   * Contains the actual state cache data. This field is usually
   * populated or updated within a service class.
   * <br /><br />
   * This field can hold **any** type of information as it extends
   * the `Record<string, any>` type to permit greater flexibility
   * around state cache entries.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public data: StateData;
}
