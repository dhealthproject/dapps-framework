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
 * @class OperationDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an operation. Typically this includes information *that is already
 * made public* or is known from dHealth Network.
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about accounts to be revealed.
 *
 * @since v0.3.0
 */
export class OperationDTO extends BaseDTO {
  /**
   * This is the user's address. The user corresponds to the
   * account that has *executed* said operation, a.k.a. the
   * originator.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description:
      "This is the user's address. The user corresponds to the account that has *executed* said operation, a.k.a. the originator.",
  })
  public userAddress: string;

  /**
   * This is the transaction hash as defined by dHealth Network. It
   * contains an *immutable* sha3-256 hash created from the transaction
   * body.
   * <br /><br />
   * Due to the usage of sha3-256, this hash is **always** a **32 bytes**
   * transaction hash (64 characters in hexadecimal notation).
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "4288A7ACF51A04AEFFBAA3DC96BCB96F20BA95671C19C3EE9E0443BC0FB79A61",
    description:
      "This is the transaction hash as defined by dHealth Network. It contains an *immutable* sha3-256 hash created from the transaction body.",
  })
  public transactionHash: string;

  /**
   * This is the contract signature as presented inside a dHealth
   * Transfer Transaction.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "elevate:auth",
    description:
      "This is the contract signature as presented inside a dHealth Transfer Transaction. This consists of the *unique identifier* of the contract that was executed.",
  })
  public contractSignature: string;

  /**
   * The operation's creation block number. This field **does** reflect the
   * time of creation of an operation. You can use the dHealth Network API
   * to find out exact timestamp by block height.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @var {number}
   */
  @ApiProperty({
    type: "number",
    example: 123456,
    description:
      "The height of the block that included the transaction executing this operation on dHealth Network",
  })
  public creationBlock: number;
}
