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
import { StatisticsDTO } from "./StatisticsDTO";
import { StatisticsDataType } from "./StatisticsDataType";

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
 * @since v0.3.2
 */
@Schema({
  timestamps: true,
})
export class Statistics extends Transferable<StatisticsDTO> {
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
  public collectionName = "statistics";

  /**
   * The type of this statistics schema. Depends on the
   * data type it would take a different
   * specific value.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @example `"leaderboard"`
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly type: string;

  /**
   * The period format of this statistics schema. Depends on the
   * sub-statistics scheduler it would take a different
   * specific value.
   * Currently there are 3 types of periods:
   * | value   | description    |
   * |---------|----------------|
   * | "D"     | occurs daily   |
   * | "W"     | occurs weekly  |
   * | "M"     | occurs monthly |
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @example `"M"`
   * @access public
   * @var {string}
   */
  @Prop({ required: true })
  public readonly periodFormat: "D" | "W" | "M";

  /**
   * The period string representation of this schema.
   * Currently there are 3 types of periods:
   * | name    | description    | example     | example explained
   * |---------|----------------|-------------|--------------------------
   * | daily   | occurs daily   | "20220130"  | period occuring between 0:00 AM 30/01/2022 and 0:00 AM Jan 30 2022
   * | weekly  | occurs weekly  | "202201-02" | period occuring between monday and sunday the second week of Jan 2022
   * | monthly | occurs monthly | "202201"    | period occuring between the 1st and 31st of Jan 2022
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @example `"20220130"`
   * @access public
   * @var {string}
   */
  @Prop({ required: true, type: String, index: true })
  public readonly period: string;

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
  @Prop({ required: true, type: String, index: true })
  public readonly address: string;

  /**
   * The position of the user of this schema. This reflects
   * the position in terms of total rewards (token) amount
   * this user's address has received.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @example `123456`
   * @access public
   * @var {number}
   */
  @Prop({ required: true, index: true, nullable: true })
  public readonly position?: number;

  /**
   * The total amount of tokens that the address of this schema
   * has received. Amount is in absolute format.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @example `123456`
   * @access public
   * @var{number}
   */
  @Prop({ required: true, nullable: true })
  public readonly amount?: number;

  /**
   * The data attached to this statistics document. This can contain
   * any object literal that is defined using one of:
   * - {@link UserStatisticsFields}: Consists of a user statistic fields definition.
   * - `ObjectLiteral`: e.g. `{ just: "a value" }`.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @example `123456`
   * @access public
   * @var {number}
   */
  @Prop({ required: false, nullable: true, type: Object })
  public data?: StatisticsDataType;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an integration but rather the date of creation of the
   * cached database entry.
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
    if (undefined !== this.type) query["type"] = this.type;
    if (undefined !== this.period) query["period"] = this.period;
    if (undefined !== this.address) query["address"] = this.address;
    if (undefined !== this.position) query["position"] = this.position;
    return query;
  }

  /**
   * This *static* method populates a {@link StatisticsDTO} object from the
   * values of a {@link StatisticsDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {StatisticsDocument}   doc   The document as received from mongoose.
   * @param   {StatisticsDTO}        dto   The DTO object that will be populated with values.
   * @returns {StatisticsDTO}        The `dto` object with fields set.
   */
  public static fillDTO(
    doc: StatisticsDocument,
    dto: StatisticsDTO,
  ): StatisticsDTO {
    dto.type = doc.type;
    dto.periodFormat = doc.periodFormat;
    dto.period = doc.period;
    dto.address = doc.address;
    dto.position = doc.position;
    dto.amount = doc.amount;
    dto.data = doc.data;
    return dto;
  }
}

/**
 * @type StatisticsDocument
 * @description This type is used to interface entities of the
 * `statistics` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link StatisticsSchema}, we also define
 * `StatisticsDocument` which is a mixin that comprises of
 * {@link Statistics} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.2
 */
export type StatisticsDocument = Statistics & Documentable;

/**
 * @class StatisticsModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `StatisticsModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Statistics, StatisticsModel } from "./StatisticsSchema";
 *
 *   class MyStatisticsService {
 *     public constructor(
 *       @InjectModel(Statistics.name) private readonly model: StatisticsModel
 *     )
 *
 *     public addEntry(data: Record<string, any>) {
 *       return this.model.create(data);
 *     }
 *   }
 * ```
 *
 * @since v0.3.2
 */
export class StatisticsModel extends Model<StatisticsDocument> {}

/**
 * @class StatisticsQuery
 * @description This class augments {@link Queryable} objects enabling
 * *statistics* to be queried **by any fields.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `statistics` collection.
 *
 * @since v0.3.2
 */
export class StatisticsQuery extends Queryable<StatisticsDocument> {
  /**
   * Copy constructor for pageable queries in `account_integrations` collection.
   *
   * @see Queryable
   * @param   {StatisticsDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}        queryParams       The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: StatisticsDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export StatisticsSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Statistics} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.2
 */
export const StatisticsSchema = SchemaFactory.createForClass(Statistics);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Statistics} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
StatisticsSchema.loadClass(Statistics, true);
