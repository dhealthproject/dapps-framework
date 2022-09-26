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
 * @class AssetDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an asset. Typically this includes information *that is already
 * made public* or is known from dHealth Network.
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about accounts to be revealed.
 *
 * @since v0.3.0
 */
export class AssetDTO extends BaseDTO {
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
  public transactionHash?: string;

  /**
   * This is the user's address. The user corresponds to the
   * account that has *received* said assets [recipient], a.k.a.
   * the destination address.
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
  public userAddress?: string;

  /**
   * The asset assignment's creation block number. This field **does** reflect
   * the time of creation of an assignment. You can use the dHealth Network API
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
      "The height of the block that included the transaction executing this asset assignment on dHealth Network",
  })
  public creationBlock?: number;

  /**
   * This is the dHealth Network Mosaic ID that characterizes the assets
   * on the network and acts as an *identifier* for the asset. An asset
   * can always and *only* be obtained using a *transfer transaction* on
   * dHealth Network.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "39E0C49FA322A459",
    description:
      "This is the asset identifier on dHealth Network (Mosaic ID). It consists of a hexadecimal identifier and is unique on dHealth Network.",
  })
  public assetId: string;

  /**
   * This is the **absolute** amount of assets that are transferred. An
   * amount is considered *absolute* when it is expressed in the *smallest*
   * possible unit of the asset.
   * <br /><br />
   * Note that *depending on the divisibility* of the dHealth Network Mosaic,
   * absolute amounts have to be *divided* correctly to represent relative
   * amounts, i.e. with a divisibility of 6, you should divide an absolute
   * amount by `1000000` to get its relative representation.
   * <br /><br />
   * Note that `Number.MAX_SAFE_INTEGER` takes a maximum value of:
   * `9007199254740991` and is thereby compatible with the maximum amount
   * that can be present in dHealth Network transfers: `8999999999999999`.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "number",
    example: 123,
    description:
      "This is the amount of this asset as attached on dHealth Network. It consists of a number and is attached in transfer transaction on dHealth Network.",
  })
  public amount: number;
}
