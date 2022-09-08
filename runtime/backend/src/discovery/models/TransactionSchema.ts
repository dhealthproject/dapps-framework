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
import { ObjectLiteral } from "@dhealth/contracts";

// internal dependencies
import { Documentable } from "../../common/concerns/Documentable";
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
 * @since v0.2.0
 */
@Schema({
  timestamps: true,
})
export class Transaction extends Transferable<TransactionDTO> {
  /**
   * This is the discovery source's address, not to be confused
   * with the signer address. A discovery source is an address
   * owned by the dApp itself and *from/to which* transactions
   * are issued.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly sourceAddress: string;

  /**
   * This is the signer's address. The signer corresponds to the
   * issuer of said transaction ("owner"). It is not to be confused
   * with the discovery source address.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly signerAddress: string;

  /**
   * This is the signer's public key. The signer corresponds to
   * the issuer of said transaction ("owner").
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly signerPublicKey: string;

  /**
   * This is the recipient address. The recipient corresponds to the
   * destination of said transaction.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly recipientAddress: string;

  /**
   * This is the transaction mode and may contain one of the
   * following values:
   * - `"incoming"`: This transaction is an *incoming* transaction
   *   of the {@link sourceAddress} discovery source account. i.e.
   *   this transaction was *sent to* the discovery source account.
   * - `"outgoing"`: This transaction is an *outgoing* transaction
   *   of the {@link sourceAddress} discovery source account. i.e.
   *   this transaction was *sent from* the discovery source account.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly transactionMode: string;

  /**
   * This is the transaction type as defined in dApps. Typically,
   * this field will contain `"transfer"`, as for now dApps always
   * use transfer transactions to perform operations.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly transactionType: string;

  /**
   * This is the transaction hash as defined by dHealth Network. It
   * contains an *immutable* sha3-256 hash created from the transaction
   * body.
   * <br /><br />
   * Due to the usage of sha3-256, this hash is **always** a **32 bytes**
   * transaction hash (64 characters in hexadecimal notation).
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true, unique: true, type: String })
  public readonly transactionHash: string;

  /**
   * This is the transaction message as defined by dHealth Network. It
   * contains a *plain text* or *encrypted* message that in turn may be
   * *processed as an operation*, or ignored.
   * <br /><br />
   * Due to some end-users preferring to *encrypt* their messages,
   * the content of this field may be highly variable, reaching from
   * plain text content over to hexadecimal payloads of encrypted text.
   * <br /><br />
   * CAUTION: This indexed field *must* be analyzed as it *could* grow
   * heavily due to the potential of 1024 bytes in transfer messages.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ index: true, nullable: true })
  public readonly transactionMessage?: string;

  /**
   * This is the contract payload as presented inside a dHealth
   * Transfer Transaction. Typically, the contract payload is made
   * of the `contract` and `version` fields, adding to it the body
   * of the contract instance, i.e. the `Auth` contract would here
   * also include a `challenge` field.
   *
   * @example `{ contract: "elevate:auth", version: 1, challenge: "abcdef12" }`
   * @access public
   * @var {string}
   */
  @Prop({ required: true, type: [Object] })
  public readonly transactionAssets: ObjectLiteral[];

  /**
   * This is the transaction signature as defined by dHealth Network. It
   * contains an *immutable* sha3-512 hash created from *some* of the data
   * stored in the transaction body.
   * <br /><br />
   * Due to the usage of sha3-512, this hash is **always** a **64 bytes**
   * transaction hash (128 characters in hexadecimal notation).
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly signature?: string;

  /**
   * This is the transaction body as defined by the dApps Framework. This
   * field contains *only a subset* of the binary payload that represents
   * this transaction.
   * <br /><br />
   * Notably, following transaction header applies on dHealth Network:
   * ```
   * size | r1 | sig | pub | r2 | ver | net | type
   *   4b | 4b | 64b | 32b | 4b |  1b |  1b |   2b
   * ```
   * <br /><br />
   * This field *does not* contain the above transaction header as it is
   * always the same network-wide, depending on the transaction type. It
   * permits to save `112 bytes` of data, that is easily reproduced using
   * the other fields of this document.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop()
  public readonly encodedBody?: string;

  /**
   * The document's creation block number. This field **does** reflect the
   * time of creation of a transaction. You can use the dHealth Network API
   * to find out exact timestamp by block height.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop()
  public readonly creationBlock?: number;

  /**
   * The document's discovery timestamp. This field **does not** reflect the
   * date of creation of a transaction but rather the date of creation of the
   * cached database entry.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop()
  public readonly discoveredAt?: number;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of update of a transaction but rather the date of creation of the
   * cached database entry.
   * <br /><br />
   * This field is added for consistency with the other database schema.
   *
   * @access public
   * @readonly
   * @var {Date}
   */
  @Prop({ index: true })
  public readonly createdAt: Date;

  /**
   * The document's update timestamp. This field **does not** reflect the
   * date of update of a transaction but rather the date of update of the
   * cached database entry.
   *
   * @access public
   * @readonly
   * @var {Date}
   */
  @Prop()
  public readonly updatedAt?: Date;

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `transactions`.
   *
   * @access public
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, any> {
    const query: Record<string, any> = {};

    if (undefined !== this.signerAddress)
      query["signerAddress"] = this.signerAddress;

    if (undefined !== this.recipientAddress)
      query["recipientAddress"] = this.recipientAddress;

    if (undefined !== this.transactionHash)
      query["transactionHash"] = this.transactionHash;

    if (undefined !== this.transactionMessage)
      query["transactionMessage"] = this.transactionMessage;

    return query;
  }

  /**
   *
   */
  public toSDK(): SdkTransaction {
    //XXX this assumes "encodedBody" contains the *full* payload.
    return TransactionMapping.createFromPayload(this.encodedBody, false); // false for `isEmbedded`
  }

  /**
   * This *static* method populates a {@link TransactionDTO} object from the
   * values of a {@link TransactionDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {TransactionDocument}   doc   The document as received from mongoose.
   * @param   {TransactionDTO}        dto   The DTO object that will be populated with values.
   * @returns {TransactionDTO}        The `dto` object with fields set.
   */
  public static fillDTO(
    doc: TransactionDocument,
    dto: TransactionDTO,
  ): TransactionDTO {
    dto.signerAddress = doc.signerAddress;
    dto.recipientAddress = doc.recipientAddress;
    dto.transactionHash = doc.transactionHash;
    dto.creationBlock = doc.creationBlock;
    return dto;
  }
}

/**
 * @type TransactionDocument
 * @description This type is used to interface entities of the
 * `transactions` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link TransactionSchema}, we also define
 * `TransactionDocument` which is a mixin that comprises of
 * {@link Transaction} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type TransactionDocument = Transaction & Documentable;

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
export class TransactionModel extends Model<TransactionDocument> {}

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

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Transaction} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
TransactionSchema.loadClass(Transaction, true);
