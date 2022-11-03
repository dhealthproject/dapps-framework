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
import { LogLevel } from "@nestjs/common";

// internal dependencies
import { Documentable } from "../concerns/Documentable";
import { Transferable } from "../concerns/Transferable";
import { Queryable, QueryParameters } from "../concerns/Queryable";
import { LogDTO } from "./LogDTO";

/**
 * @class Log
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `system-logs` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.3.2
 */
@Schema({
  timestamps: true,
  collection: "system-logs",
})
export class Log extends Transferable<LogDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link LogDocument} or the model
   * {@link LogModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "system-logs";

  /**
   * The timestamp in which the log occurred and was persisted.
   *
   * @access public
   * @readonly
   * @var {Date}
   */
  @Prop({ required: true, index: true, type: Date })
  public readonly timestamp: Date;

  /**
   * The level of the log.
   *
   * @access public
   * @readonly
   * @see LogLevel
   * @var {LogLevel}
   */
  @Prop({ required: true, index: true, type: String })
  public readonly level: LogLevel;

  /**
   * The message content of the log.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, type: String })
  public readonly message: string;

  /**
   * The meta object content of the log.
   *
   * @access public
   * @readonly
   * @var {object}
   */
  @Prop({ required: true, type: Object })
  public readonly meta: object;

  /**
   * The label content of the log.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, type: String })
  public readonly label: string;

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `system-logs`.
   *
   * @access public
   * @returns {Record<string, unknown>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, unknown> {
    return {
      timestamp: this.timestamp,
      level: this.level,
      message: this.message,
      meta: this.meta,
      label: this.label,
    };
  }

  /**
   * This *static* method populates a {@link LogDTO} object from the
   * values of a {@link LogDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {LogDocument}   doc   The document as received from mongoose.
   * @param   {LogDTO}        dto   The DTO object that will be populated with values.
   * @returns {LogDTO}        The `dto` object with fields set.
   */
  public static fillDTO(doc: LogDocument, dto: LogDTO): LogDTO {
    dto.timestamp = doc.timestamp;
    dto.level = doc.level;
    dto.message = doc.message;
    dto.meta = doc.meta;
    dto.label = doc.label;
    return dto;
  }
}

/**
 * @type LogDocument
 * @description This type is used to interface entities of the
 * `system-logs` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link LogSchema}, we also define
 * `LogDocument` which is a mixin that comprises of
 * {@link Log} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.2
 */
export type LogDocument = Log & Documentable;

/**
 * @class LogModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `LogModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Log, LogModel } from "./LogSchema";
 *
 *   class MyLogService {
 *     public constructor(
 *       @InjectModel(Log.name) private readonly model: LogModel
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
export class LogModel extends Model<LogDocument> {}

/**
 * @class LogQuery
 * @description This class augments {@link Queryable} objects enabling
 * *system-logs* to be queried **by `address`** and **by `transactionsCount`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `system-logs` collection.
 *
 * @since v0.3.2
 */
export class LogQuery extends Queryable<LogDocument> {
  /**
   * Copy constructor for pageable queries in `system-logs` collection.
   *
   * @see Queryable
   * @param   {LogDocument|undefined}       document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}   queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: LogDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export LogSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Log} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.2
 */
export const LogSchema = SchemaFactory.createForClass(Log);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Log} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
LogSchema.loadClass(Log, true);
