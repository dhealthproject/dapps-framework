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
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// internal dependencies
import { Documentable } from "../../common/concerns/Documentable";
import { Transferable } from "../../common/traits/Transferable";
import { Queryable } from "../../common/concerns/Queryable";
import { TransactionDTO } from "../models/TransactionDTO";

/**
 * @class Transaction
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `transactions` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo The {@link Transaction} model does not need fields to be **public**.
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.2.0
 */
@Schema({
  timestamps: false,
})
export class Transaction extends Transferable<TransactionDTO> {
  /**
   * The document identifier. This field is automatically populated
   * if it does not exist (mongoose) and **cannot be updated**.
   *
   * @access public
   * @var {string}
   */
  public _id: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true })
  public signerAddress: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop()
  public transactionType: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop()
  public transactionHash: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop()
  public signature?: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop()
  public encodedBody?: string;

  /**
   * The document's discovery timestamp. This field **does not** reflect the
   * date of creation of a transaction but rather the date of creation of the
   * cached database entry.
   *
   * @access public
   * @var {Date}
   */
  @Prop()
  public discoveredAt?: Date;
}

/**
 * @type TransactionDocument
 * @description This type merges the mongoose base `Document` object with
 * specialized state document objects such that this document can be used
 * directly in `mongoose` queries for `Transactions` documents.
 *
 * @since v0.2.0
 */
export type TransactionDocument = Transaction & Documentable;

/**
 * @class TransactionQuery
 * @description This class augments {@link Queryable} objects enabling
 * *transactions* to be queried **by `signerAddress`** and **by `transactionHash`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `transactions` collection.
 *
 * @since v0.2.0
 */
export class TransactionQuery extends Queryable {
  /**
   * This field can be used to query documents in the `Transactions` mongo
   * collection by their `signerAddress` field value.
   *
   * @access public
   * @var {string}
   */
  public signerAddress?: string;

  /**
   * This field can be used to query documents in the `Transactions` mongo
   * collection by their `transactionHash` field value.
   *
   * @access public
   * @var {string}
   */
  public transactionHash?: string;

  /**
   * Copy constructor for pageable queries in `states`collection.
   * The `StateQuery` parameter that is optionally passed to this
   * method is then destructured to mimic a copy construction logic.
   *
   * @param   {string|undefined}    identifier        The *document* identifier (value of the field "_id").
   * @param   {string|undefined}    signerAddress     The query's `signerAddress` field value (optional).
   * @param   {string|undefined}    transactionHash   The query's `transactionHash` field value (optional).
   * @param   {number|undefined}    pageNumber        The page number of the query (defaults to `1`).
   * @param   {number|undefined}    pageSize          The number of entities/documents in one page (defaults to `20`).
   * @param   {string|undefined}    sort              The field used for sorting (defaults to `"_id"`).
   * @param   {string|undefined}    order             The sorting direction, must be one of `"asc"` and `"desc"` (defaults to `"asc"`)
   */
  public constructor(
    id?: string,
    signerAddress?: string,
    transactionHash?: string,
    pageNumber?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
  ) {
    super(id, pageNumber, pageSize, sort, order);

    if (undefined !== signerAddress) this.signerAddress = signerAddress;
    if (undefined !== transactionHash)
      this.transactionHash = transactionHash;
  }
}

/**
 * @export TransactionSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Transaction} class and should be used mainly when 
 * *inferring* the type of fields in a document for the corresponding
 * collection.
 *
 * @since v0.2.0
 */
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
