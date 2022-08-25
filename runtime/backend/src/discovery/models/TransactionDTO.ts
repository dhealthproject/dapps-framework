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

/**
 * @class TransactionDTO
 * @description
 *
 * @todo Add relevant class documentation and usage example
 * @todo Use the `@dhealth/contracts` abstraction and include in TransactionDTO if necessary.
 * @since v0.2.0
 */
export class TransactionDTO {
  /**
   * This is the signer's address. The signer corresponds to the
   * issuer of said transaction ("owner"). It is not to be confused
   * with the discovery source address.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description:
      "This is the signer's address. The signer corresponds to the issuer of said transaction - a.k.a the owner.",
  })
  public signerAddress: string;

  /**
   * This is the recipient address. The recipient corresponds to the
   * destination of said transaction.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    example: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    description:
      "This is the recipient address. The recipient corresponds to the destination of said transaction.",
  })
  public recipientAddress: string;

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
    example: "4288A7ACF51A04AEFFBAA3DC96BCB96F20BA95671C19C3EE9E0443BC0FB79A61",
    description:
      "This is the transaction hash as defined by dHealth Network. It contains an *immutable* sha3-256 hash created from the transaction body.",
  })
  public transactionHash: string;

  /**
   * The document's creation block number. This field **does** reflect the
   * time of creation of a transaction. You can use the dHealth Network API
   * to find out exact timestamp by block height.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @var {number}
   */
  @ApiProperty({
    example: 123456,
    description:
      "The height of the block that included this transaction on dHealth Network",
  })
  public creationBlock?: number;
}
