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
import { ActivityDataDTO } from "./ActivityDataDTO";
import { GeolocationPointDTO } from "./GeolocationPointDTO";

/**
 * @class ActivityData
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `activitydata` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.3.2
 */
@Schema({
  timestamps: true,
})
export class ActivityData extends Transferable<ActivityDataDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link AccountIntegrationDocument} or the model
   * {@link AccountIntegrationModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "activitydata";

  /**
   * The activity slug is composed of the date of the activity,
   * the index of it on a daily basis, the activity identifier
   * and the athlete identifier.
   * <br /><br />
   * Note that this field can be used to fetch a singular data
   * container for a given entry in `activities` using the `slug`
   * field of that collection.
   * <br /><br />
   * This field is **required** and *indexed* and must hold
   * a *unique* value.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly slug: string;

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
   * The activity name as stored by the data provider. This field is
   * not always available.
   * <br /><br />
   * Note that this field *must not* be shared publicly as this data
   * is related to *private information* that the end-user may want
   * to keep private.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: false })
  public readonly name?: string;

  /**
   * The activity's *sport type* as defined by the data provider. This
   * field permits to differentiate the *type of activity* and corresponding
   * intensity of any activity.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @link https://developers.strava.com/docs/reference/#api-models-SportType
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly sport: string;

  /**
   * The UTC timestamp at which the activity was *started*. Note that this
   * time is expressed using the **UTC** timezone and may differ from the
   * end-users actual timezone.
   * <br /><br />
   * Note that this field *must not* be shared publicly as this data
   * is related to *private information* that the end-user may want
   * to keep private.
   * <br /><br />
   * Conversion to the end-users local timezone can be done using the
   * {@link ActivityData.timezone} field and applying it to this field value.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true, index: true })
  public readonly startedAt: number;

  /**
   * The UTC timestamp at which the activity was *started*. Note that this
   * time is expressed using the **UTC** timezone and may differ from the
   * end-users actual timezone.
   * <br /><br />
   * Note that this field *must not* be shared publicly as this data
   * is related to *private information* that the end-user may want
   * to keep private.
   * <br /><br />
   * Conversion to the end-users local timezone can be done using the
   * `timeZone` field and applying it to this field value.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly timezone: string;

  /**
   * The geolocation point's *GeoJSON* object at which the activity
   * was *started*, if available.
   * <br /><br />
   * Note that this field *must not* be shared publicly as this data
   * is related to *private information* that the end-user may want
   * to keep private.
   * <br /><br />
   * The {@link GeolocationPointDTO.coordinates} property requires
   * the array of number to use the `longitude` as the first number
   * and the `latitude` as the second number in the coordinates.
   * <br /><br />
   * This field is **not required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ nullable: true, index: "2dsphere", type: Object })
  public readonly startLocation?: GeolocationPointDTO;

  /**
   * The geolocation point's *GeoJSON* object at which the activity
   * was *ended*, if available.
   * <br /><br />
   * Note that this field *must not* be shared publicly as this data
   * is related to *private information* that the end-user may want
   * to keep private.
   * <br /><br />
   * The {@link GeolocationPointDTO.coordinates} property requires
   * the array of number to use the `longitude` as the first number
   * and the `latitude` as the second number in the coordinates.
   * <br /><br />
   * This field is **not required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ nullable: true, index: "2dsphere", type: Object })
  public readonly endLocation?: GeolocationPointDTO;

  /**
   * This property contains a boolean that determines whether
   * this activity was created using a *trainer device* or
   * *training machine*.
   * <br /><br />
   * This field is **not required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {boolean}
   */
  @Prop({ required: true, default: false })
  public readonly hasTrainerDevice: boolean;

  /**
   * The activity's *elapsed time* as defined by the data provider. This
   * field is used to keep track of the *total elapsed time* covered by an
   * end-user during individual activities.
   * <br /><br />
   * The total elapsed time is always expressed in **seconds**.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true })
  public readonly elapsedTime: number;

  /**
   * The activity's *elapsed time* as defined by the data provider. This
   * field is used to keep track of the *total moving time* covered by an
   * end-user during individual activities. This refers to the total time
   * during which the end-user has been in movement during an activity.
   * <br /><br />
   * The total moving time is always expressed in **seconds**.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true })
  public readonly movingTime: number;

  /**
   * The activity's *covered distance* as defined by the data provider. This
   * field is used to keep track of the *total distance* covered by an
   * end-user during individual activities.
   * <br /><br />
   * The total distance is always expressed in **meters**.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true })
  public readonly distance: number;

  /**
   * The activity's *covered elevation* as defined by the data provider. This
   * field is used to keep track of the *total elevation gain* covered by an
   * end-user during individual activities.
   * <br /><br />
   * The total elevation gain is always expressed in **meters**.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true, index: true })
  public readonly elevation: number;

  /**
   * The activity's *work done in kilojoules* as defined by the data provider.
   * This applies *only to Rides* as defined by Strava. As such, this field is
   * not always present.
   * <br /><br />
   * The total work done is always expressed in **kilojoules**.
   * <br /><br />
   * This field is **optional** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true, index: true, default: 0 })
  public readonly kilojoules: number;

  /**
   * The activity's *calories burned* as defined by the data provider. This
   * field is *transformed* from data providers' output such that it stores
   * the *calories burned*, not as provided the *kilocalories burned*.
   * <br /><br />
   * The calories burned are always expressed in **calories** (not kCal).
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true, index: true })
  public readonly calories: number;

  /**
   * Determines whether the activity was *crafted by hand* or if
   * it is the result of an actual activity.
   * <br /><br />
   * Note that manual activities are not considered for payouts.
   *
   * @access public
   * @var {boolean}
   */
  @Prop({ required: true, index: true, default: true })
  public readonly isManual: boolean;

  /**
   * The suffer score attributed to this activity *by Strava*.
   * We store a copy of this value so that we can evaluate its
   * usage in our formulas.
   * <br /><br />
   * Note that this field is sometimes `null` when received from
   * Strava, in those cases this field is set to `-1`.
   *
   * @access public
   * @var {sufferScore}
   */
  @Prop({ required: true, index: true, default: -1 })
  public readonly sufferScore: number;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an integration but rather the date of creation of the
   * cached database entry.
   * <br /><br />
   * Note that this field's value does not represent the time of creation of
   * an activity but rather the time of creation of it's database entry.
   * <br /><br />
   * This field is **required** and *indexed*.
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
   * <br /><br />
   * This field is **optional** and *not indexed*.
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

    if (undefined !== this.address) query["address"] = this.address;
    if (undefined !== this.slug) query["slug"] = this.slug;
    if (undefined !== this.sport) query["sport"] = this.sport;

    // @todo add `$between`, `$lt`, `$gt`, `$lte`, `$gte`, `$within` operations to support:
    // @todo - querying that field values are *between* a given range (number/dates).
    // @todo - querying that geolocation objects are *within* given coordinates.

    return query;
  }

  /**
   * This *static* method populates a {@link ActivityDataDTO} object from the
   * values of a {@link ActivityDataDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {ActivityDataDocument}   doc   The document as received from mongoose.
   * @param   {ActivityDataDTO}        dto   The DTO object that will be populated with values.
   * @returns {ActivityDataDTO}        The `dto` object with fields set.
   */
  public static fillDTO(
    doc: ActivityDataDocument,
    dto: ActivityDataDTO,
  ): ActivityDataDTO {
    dto.slug = doc.slug;
    dto.sport = doc.sport;
    dto.elapsedTime = doc.elapsedTime;
    dto.distance = doc.distance;
    dto.elevation = doc.elevation;
    dto.calories = doc.calories;
    dto.isManual = doc.isManual;
    return dto;
  }
}

/**
 * @type ActivityDataDocument
 * @description This type is used to interface entities of the
 * `activitydata` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link ActivityDataSchema}, we also define
 * `ActivityDataDocument` which is a mixin that comprises of
 * {@link ActivityData} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type ActivityDataDocument = ActivityData & Documentable;

/**
 * @class ActivityDataModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `ActivityDataModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Account, ActivityDataModel } from "./AccountSchema";
 *
 *   class MyAccountService {
 *     public constructor(
 *       @InjectModel(Account.name) private readonly model: ActivityDataModel
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
export class ActivityDataModel extends Model<ActivityDataDocument> {}

/**
 * @class ActivityDataQuery
 * @description This class augments {@link Queryable} objects enabling
 * *accounts* to be queried **by `address`** and **by `transactionsCount`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `account_integrations` collection.
 *
 * @since v0.3.0
 */
export class ActivityDataQuery extends Queryable<ActivityDataDocument> {
  /**
   * Copy constructor for pageable queries in `account_integrations` collection.
   *
   * @see Queryable
   * @param   {ActivityDataDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: ActivityDataDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export ActivityDataSchema
 * @description This export creates a mongoose schema using the custom
 * {@link ActivityData} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.0
 */
export const ActivityDataSchema = SchemaFactory.createForClass(ActivityData);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link ActivityData} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
ActivityDataSchema.loadClass(ActivityData, true);
