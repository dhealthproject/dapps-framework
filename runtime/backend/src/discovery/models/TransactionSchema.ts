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
import {
  Transaction as SdkTransaction,
  TransactionMapping,
} from "@dhealth/sdk";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";

// internal dependencies
import { Transferable } from "../../common/concerns/Transferable";
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
export class Transaction extends Transferable<TransactionDTO> /* extends Documentable */ {
  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public signerAddress: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
   @Prop({ required: true, index: true })
  public signerPublicKey: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true })
  public transactionType: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public transactionHash: string;

  /**
   * XXX
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true })
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
  public get toQuery(): Record<string, any> {
    let query: Record<string, any> = {};

    if (undefined !== this.signerAddress)
      query["signerAddress"] = this.signerAddress;

    if (undefined !== this.transactionHash)
      query["transactionHash"] = this.transactionHash;

    return query;
  }

  /**
   * This method implements the document columns list as defined
   * for the collection `transactions`.
   *
   * @returns {Record<string, any>}    The individual data fields that belong to the document.
   */
  public get toDocument(): Record<string, any> {
    return {
      id: this._id,
      signerAddress: this.signerAddress,
      transactionType: this.transactionType,
      transactionHash: this.transactionHash,
      signature: this.signature,
      encodedBody: this.encodedBody,
      discoveredAt: this.discoveredAt,
    }
  }

  /**
   * 
   */
  public toSDK(): SdkTransaction {
    return TransactionMapping.createFromPayload(this.encodedBody, false); // false for `isEmbedded`
  }
}

/**
 * @class TransactionModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `TransactionModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Transaction, TransactionModel } from "./TransactionSchema";
 *
 *   class MyTransactionService {
 *     public constructor(
 *       @InjectModel(Transaction.name) private readonly model: TransactionModel
 *     )
 * 
 *     public addEntry(data: Record<string, any>) {
 *       return this.model.create(data);
 *     }
 *   }
 * ```
 *
 * @since v0.2.0
 */
export class TransactionModel extends Model<Transaction> {}

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
export class TransactionQuery extends Queryable<Transaction> {
  /**
   * Copy constructor for pageable queries in `transactions` collection.
   *
   * @see Queryable
   * @param   {Transaction|undefined} document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
   public constructor(
    document?: Transaction,
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

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Transaction} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
TransactionSchema.loadClass(Transaction, true);
