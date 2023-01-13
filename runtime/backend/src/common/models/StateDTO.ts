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
 * @class StateDTO
 * @description A DTO class that consists of the *transferable* properties
 * of a module state. Typically this includes information *that is already
 * public* or is known from dHealth Network.
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about module states to be revealed.
 *
 * @since v0.1.0
 */
export class StateDTO extends BaseDTO {
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
  @ApiProperty({
    type: "string",
    example: "discovery:DiscoverTransactions",
    description:
      "The identifier of the state entry. Typically, this holds a unique identifier that determines for which module state is being saved.",
  })
  public name: string;

  /**
   * Contains the actual state cache data's hash.
   * <br /><br />
   * The content is hashed with SHA3-256 to prevent revealing actual
   * state data to the client.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "",
    description:
      "Contains the actual state cache data's hash. The content is hashed with SHA3-256 to prevent revealing actual state data to the client.",
  })
  public data: string;
}
