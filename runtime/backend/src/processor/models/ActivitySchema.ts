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
import { Model } from "mongoose";

// internal dependencies
import { Documentable } from "../../common/concerns/Documentable";
import { Transferable } from "../../common/concerns/Transferable";
import { Queryable, QueryParameters } from "../../common/concerns/Queryable";
import { ActivityDTO } from "./ActivityDTO";

/**
 * @class Activity
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `activities` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.3.0
 */
@Schema({
  timestamps: true,
})
export class Activity extends Transferable<ActivityDTO> {
  /**
   * The account's **address**. An address typically refers to a
   * human-readable series of 39 characters, starting either with
   * a `T`, for TESTNET addresses, or with a `N`, for MAINNET addresses.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly address: string;

  /**
   * The activity slug is composed of the date of the activity,
   * the index of it on a daily basis, and the athlete identifier.
   * <br /><br />
   * This field is **required** and *indexed* and must hold
   * a *unique* value.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true, unique: true, type: String })
  public readonly slug: string;

  /**
   * The activity's *date slug* consists of a `YYYYMMDD` formatted
   * date and is used to *prefix* individual activity slugs.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly dateSlug: string;

  /**
   * The OAuth provider name. This is usually the name of the
   * platform of which an account has completed an activity.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly provider: string;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an integration but rather the date of creation of the
   * cached database entry.
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
    const query: Record<string, any> = {
      address: this.address, // always present
    };

    if (undefined !== this.slug) query["slug"] = this.slug;
    if (undefined !== this.dateSlug) query["dateSlug"] = this.dateSlug;

    return query;
  }

  /**
   * This *static* method populates a {@link ActivityDTO} object from the
   * values of a {@link ActivityDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {ActivityDocument}   doc   The document as received from mongoose.
   * @param   {ActivityDTO}        dto   The DTO object that will be populated with values.
   * @returns {ActivityDTO}        The `dto` object with fields set.
   */
  public static fillDTO(doc: ActivityDocument, dto: ActivityDTO): ActivityDTO {
    dto.address = doc.address;
    dto.slug = doc.slug;
    return dto;
  }
}

/**
 * @type ActivityDocument
 * @description This type is used to interface entities of the
 * `account_integrations` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link ActivitySchema}, we also define
 * `ActivityDocument` which is a mixin that comprises of
 * {@link Activity} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type ActivityDocument = Activity & Documentable;

/**
 * @class ActivityModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `ActivityModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Account, ActivityModel } from "./AccountSchema";
 *
 *   class MyAccountService {
 *     public constructor(
 *       @InjectModel(Account.name) private readonly model: ActivityModel
 *     )
 *
 *     public addEntry(data: Record<string, any>) {
 *       return this.model.create(data);
 *     }
 *   }
 * ```
 *
 * @since v0.3.0
 */
export class ActivityModel extends Model<ActivityDocument> {}

/**
 * @class ActivityQuery
 * @description This class augments {@link Queryable} objects enabling
 * *accounts* to be queried **by `address`** and **by `transactionsCount`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `account_integrations` collection.
 *
 * @since v0.3.0
 */
export class ActivityQuery extends Queryable<ActivityDocument> {
  /**
   * Copy constructor for pageable queries in `account_integrations` collection.
   *
   * @see Queryable
   * @param   {ActivityDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: ActivityDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export ActivitySchema
 * @description This export creates a mongoose schema using the custom
 * {@link Activity} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.0
 */
export const ActivitySchema = SchemaFactory.createForClass(Activity);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Activity} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
ActivitySchema.loadClass(Activity, true);
