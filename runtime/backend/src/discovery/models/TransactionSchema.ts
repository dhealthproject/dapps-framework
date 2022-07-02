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
import { Queryable, QueryParameters } from "../../common/concerns/Queryable";
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

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `transactions`.
   *
   * @access public
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public toQuery(): Record<string, any> {
    let query: Record<string, any> = {};

    if (undefined !== this.signerAddress)
      query["signerAddress"] = this.signerAddress;

    if (undefined !== this.transactionHash)
      query["transactionHash"] = this.transactionHash;

    return query;
  }
}

/**
 * @type TransactionDocument
 * @description This type merges the mongoose base `Document` object with
 * specialized state document objects such that this document can be used
 * directly in `mongoose` queries for `Transactions` documents.
 * <br /><br />
 * Due to the implementation of `toQuery` in {@link Account}, the order
 * of creation of this mixin is important such that the implementation of
 * the method inside `Account` overwrites that of `Documentable`.
 *
 * @since v0.2.0
 */
export type TransactionDocument = Documentable & Transaction;

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
export class TransactionQuery extends Queryable<TransactionDocument> {
  /**
   * Copy constructor for pageable queries in `transactions` collection.
   *
   * @see Queryable
   * @param   {TransactionDocument|undefined} document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
   public constructor(
    document?: TransactionDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
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
