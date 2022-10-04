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
 * @class BlockDTO
 * @description A DTO class that consists of the *transferable* properties
 * of a block. Typically this includes information *that is already
 * made public* or is known from dHealth Network.
 *
 * @since v0.3.2
 */
export class BlockDTO extends BaseDTO {
  /**
   * This is the block height that refers to the order in which
   * blocks were added to the network.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 123456,
    description:
      "This is the block height that refers to the order in which blocks were added to the network.",
  })
  public height?: number;

  /**
   * This is the block's harvester address, corresponds to the
   * account that has *harvested* this block.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description:
      "This is the user's address. The user corresponds to the account that has *harvested* this block.",
  })
  public harvester?: string;

  /**
   * This block's creation timestamp. This field reflects the
   * time of the creation of the block.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 123456,
    description:
      "This block's creation timestamp. This field reflects the time of the creation of the block.",
  })
  public timestamp?: number;

  /**
   * The total number of transactions included in this block.
   *
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 123456,
    description: "The total number of transactions included in this block..",
  })
  public countTransactions?: number;
}
