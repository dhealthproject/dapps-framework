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
import { ObjectLiteral } from "@dhealth/contracts";

// internal dependencies
import { BaseDTO } from "../../common/models/BaseDTO";

/**
 * @class PayoutDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an account's payout.
 *
 * @since v0.4.0
 */
export class PayoutDTO extends BaseDTO {
  /**
   * The Address of this account on dHealth Network. The
   * account's **address** typically refers to a human-readable
   * series of 39 characters, starting either with a `T`, for
   * TESTNET addresses, or with a `N`, for MAINNET addresses.
   * <br /><br />
   * This is the user's address. The user corresponds to the
   * destination of said **payout** ("recipient").
   *
   * @example `"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"`
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description:
      "This is the user's address. The user corresponds to the destination of said **payout**, i.e. the recipient.",
  })
  public address: string;

  /**
   * This is the payout's mosaics as defined by dHealth Network.
   * It contains an array of `ObjectLiteral` objects that consist
   * of both a *mosaicId* and *amount* field.
   *
   * @example `[{ "mosaicId": "39E0C49FA322A459", amount: 1 }]`
   * @access public
   * @var {ObjectLiteral[]}
   */
  @ApiProperty({
    type: "string",
    example: [{ mosaicId: "39E0C49FA322A459", amount: 1 }],
    description:
      "This is the payout's mosaics as defined by dHealth Network. It contains an array of `ObjectLiteral` objects that consist of both a *mosaicId* and *amount* field.",
  })
  public assets: ObjectLiteral[];
}
