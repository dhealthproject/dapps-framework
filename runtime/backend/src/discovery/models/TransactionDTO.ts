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
 * @todo Use the `@dhealth/contracts` abstraction and include in TransactionDTO if necessary.
 * @since v0.2.0
 */
export class TransactionDTO {
  /**
   * The transaction signer address. This is more commonly referred
   * to the *owner* of said transaction.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public signerAddress: string;

  /**
   * The transaction type in string format. Note that we use strings
   * here rather than numbers as provided by `@dhealth/sdk`, for clarity.
   *
   * @see getTransactionType
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public transactionType: string;

  /**
   * The transaction hash. This property *can never* be altered
   * after a transaction has been read.
   * <br /><br />
   * The content of this field is represented in *hexadecimal* format.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public transactionHash: string;

  /**
   * The transaction signature. This property *can never* be altered
   * after a transaction has been read.
   * <br /><br />
   * The content of this field is represented in *hexadecimal* format.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public signature: string;

  /**
   * The *encoded* body of the transaction. This property contains
   * only the actual *content* of the transaction and does not
   * contain the transaction header.
   * <br /><br />
   * It is important to note that re-building transactions using
   * this payload *must* re-construct the transaction header
   * separately, i.e. using {@link signature} and {@link transactionHash}.
   * <br /><br />
   * The content of this field is represented in *hexadecimal* format.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public encodedBody: string;
}
