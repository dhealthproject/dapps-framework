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
import { Model, FilterQuery } from "mongoose";
import { ObjectLiteral } from "@dhealth/contracts";

// internal dependencies
// common scope
import { Documentable } from "../../common/concerns/Documentable";
import { Transferable } from "../../common/concerns/Transferable";
import { Queryable, QueryParameters } from "../../common/concerns/Queryable";

// processor scope
import { ActivityModel } from "../../processor/models/ActivitySchema";

// payout scope
import { PayoutDTO } from "./PayoutDTO";
import { PayoutState } from "./PayoutStatusDTO";
import { InvalidPayoutSubjectError } from "../errors";

/**
 * @class Payout
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `payouts` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.4.0
 */
@Schema({
  timestamps: true,
})
export class Payout extends Transferable<PayoutDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link PayoutDocument} or the model
   * {@link PayoutModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "payouts";

  /**
   * This is the subject slug. With the currently implemented
   * payout module, the subject is *always* an activity but in
   * future releases of the software, the subject may also be
   * a *profile*, or a *leaderboard update*, etc.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly subjectSlug: string;

  /**
   * This is the subject collection name. This name corresponds
   * to the *origin* database collection in which the above slug
   * can be found to be linked to one unique entity.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly subjectCollection: string;

  /**
   * This is the user's address. The user corresponds to the
   * destination of said **payout** ("recipient").
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly userAddress: string;

  /**
   * This is the transaction hash as defined by dHealth Network. It
   * contains an *immutable* sha3-256 hash created from the transaction
   * body.
   * <br /><br />
   * Due to the usage of sha3-256, this hash is **always** a **32 bytes**
   * transaction hash (64 characters in hexadecimal notation).
   * <br /><br />
   * This field is **required**, *indexed* and values are expected
   * to be *unique*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ nullable: true, index: true, type: String, default: null })
  public readonly transactionHash?: string;

  /**
   * This is the payout's mosaics as defined by dHealth Network. It
   * contains an array of `ObjectLiteral` objects that consist of both
   * a *mosaicId* and *amount* field.
   * <br /><br />
   * This field contains the actual *tokens* that have been paid out
   * to the end-user with this document. It can hold only a single
   * mosaic or up to 10 different mosaics that were sent to the end-
   * user for completing an activity (or other operations).
   * <br /><br />
   * This field is **optional**, *indexed* and defaults to an empty
   * array.
   *
   * @example `[{ "mosaicId": "39E0C49FA322A459", amount: 1 }]`
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: false, type: [Object], index: true, default: [] })
  public readonly payoutAssets?: ObjectLiteral[];

  /**
   * This property is a flag that determines whether the payout has been
   * executed before or not. The execution of said payout happens in multiple
   * stages, with following possible update flows:
   * ```
   * # Success flow
   * 1. Not_Started -> Prepared -> Broadcast -> Confirmed
   *
   * # Failure flows
   * 2. Not_Started -> Prepared -> Failed
   * 3. Not_Started -> Prepared -> Broadcast -> Failed
   * ```
   * <br /><br />
   * Possible values for this field in the database are of type `number` and
   * listed in {@link PayoutState}. Initially, the value will always be
   * `0` as this corresponds to "not-started".
   * <br /><br />
   * This field is **optional**, *indexed* and defaults to `0`.
   *
   * @example `0`
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true, default: 0 })
  public readonly payoutState?: PayoutState;

  /**
   * This field contains the *signed transaction bytes*. This represents
   * the *signed transaction* in a binary payload expressed in hexadecimal
   * format.
   * <br /><br />
   * Note that this field will be *emptied* once the transaction has been
   * *broadcast* and *verified* to be confirmed on dHealth Network.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ nullable: true, default: null })
  public readonly signedBytes?: string;

  /**
   * The document's creation timestamp. This field **does** represent a
   * payout's actual date of creation of the *signed* transaction. This
   * field **does not** represent the date of *confirmation*.
   * <br /><br />
   *
   * @access public
   * @readonly
   * @var {Date}
   */
  @Prop({ index: true })
  public readonly createdAt?: Date;

  /**
   * The document's update timestamp. This field **does not** reflect the
   * date of update of an integration but rather the date of update of the
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
   * individually, as documents, in the collection: `account_integrations`.
   *
   * @access public
   * @returns {Record<string, unknown>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, unknown> {
    const query: Record<string, any> = {};

    if (undefined !== this.userAddress) query["userAddress"] = this.userAddress;
    if (undefined !== this.payoutState) query["payoutState"] = this.payoutState;
    if (undefined !== this.subjectSlug) query["subjectSlug"] = this.subjectSlug;
    if (undefined !== this.subjectCollection)
      query["subjectCollection"] = this.subjectCollection;
    if (undefined !== this.transactionHash)
      query["transactionHash"] = this.transactionHash;

    return query;
  }

  /**
   * This *static* method populates a {@link PayoutDTO} object from the
   * values of a {@link PayoutDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {PayoutDocument}   doc   The document as received from mongoose.
   * @param   {PayoutDTO}        dto   The DTO object that will be populated with values.
   * @returns {PayoutDTO}        The `dto` object with fields set.
   */
  public static fillDTO(doc: PayoutDocument, dto: PayoutDTO): PayoutDTO {
    dto.address = doc.userAddress;
    dto.assets = doc.payoutAssets;
    return dto;
  }
}

/**
 * @type PayoutDocument
 * @description This type is used to interface entities of the
 * `payouts` collection with *mongoose* and permits to create
 * an instance and objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link PayoutSchema}, we also define
 * `PayoutDocument` which is a mixin that comprises of
 * {@link Payout} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.4.0
 */
export type PayoutDocument = Payout & Documentable;

/**
 * @class PayoutModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `PayoutModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Payout, PayoutModel } from "./PayoutSchema";
 *
 *   class MyPayoutService {
 *     public constructor(
 *       @InjectModel(Payout.name) private readonly model: PayoutModel
 *     )
 *
 *     public addEntry(data: Record<string, any>) {
 *       return this.model.create(data);
 *     }
 *   }
 * ```
 *
 * @since v0.4.0
 */
export class PayoutModel extends Model<PayoutDocument> {}

/**
 * @class PayoutQuery
 * @description This class augments {@link Queryable} objects enabling
 * *payouts* to be queried **by `address`** and **by `assets`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `payouts` collection.
 *
 * @since v0.4.0
 */
export class PayoutQuery extends Queryable<PayoutDocument> {
  /**
   * Copy constructor for pageable queries in `payouts` collection.
   *
   * @see Queryable
   * @param   {PayoutDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: PayoutDocument,
    queryParams: QueryParameters = undefined,
    filterQuery?: FilterQuery<PayoutDocument>,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export PayoutSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Activity} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.4.0
 */
export const PayoutSchema = SchemaFactory.createForClass(Payout);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Payout} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
PayoutSchema.loadClass(Payout, true);
