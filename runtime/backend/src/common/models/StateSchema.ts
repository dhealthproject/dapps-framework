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
import { sha3_256 } from "js-sha3";

// internal dependencies
import { Documentable } from "../concerns/Documentable";
import { Transferable } from "../concerns/Transferable";
import { Queryable, QueryParameters } from "../concerns/Queryable";
import { StateDTO } from "../models/StateDTO";
import type { StateData } from "./StateData";

/**
 * @class State
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `states` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.2.0
 */
@Schema({
  timestamps: true,
})
export class State extends Transferable<StateDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link StateDocument} or the model
   * {@link StateModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "states";

  /**
   * The state cache document's **name**. Note that this field must
   * contain dynamic module names, e.g. `"discovery"` or `"payout",
   * such that state cache for each individual module can be tracked
   * accordingly.
   * <br /><br />
   * This field is **required**, *indexed* and values are expected
   * to be *unique*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true, unique: true, type: String })
  public readonly name: string;

  /**
   * The state cache document's actual **data**. Note that this field
   * is *poorly* typed and can contain any *object*, the reason for
   * this is to be flexible about state caches for the beginning, in a
   * later iteration of the framework it is possible that this field
   * would be updated to a strictly typed alternative.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {StateData}
   */
  @Prop({ required: true, type: Object })
  public readonly data: StateData;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an account but rather the date of creation of the
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
   * date of update of an account but rather the date of update of the
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
   * individually, as documents, in the collection: `states`.
   *
   * @access public
   * @returns {Record<string, unknown>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, unknown> {
    return {
      name: this.name,
    };
  }

  /**
   * This *static* method populates a {@link StateDTO} object from the
   * values of a {@link StateDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {StateDocument}   doc   The document as received from mongoose.
   * @param   {StateDTO}        dto   The DTO object that will be populated with values.
   * @returns {StateDTO}        The `dto` object with fields set.
   */
  public static fillDTO(doc: StateDocument, dto: StateDTO): StateDTO {
    dto.name = doc.name;
    // hash the actual state data in the dto to prevent its exposure to the client.
    dto.data = sha3_256(JSON.stringify(doc.data));
    return dto;
  }
}

/**
 * @type StateDocument
 * @description This type is used to interface entities of the
 * `states` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link StateSchema}, we also define
 * `StateDocument` which is a mixin that comprises of
 * {@link State} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type StateDocument = State & Documentable;

/**
 * @class StateModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `StateModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { State, StateModel } from "./StateSchema";
 *
 *   class MyStateService {
 *     public constructor(
 *       @InjectModel(State.name) private readonly model: StateModel
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
export class StateModel extends Model<StateDocument> {}

/**
 * @class StateQuery
 * @description This class augments {@link Queryable} objects enabling
 * *state cache documents* to be queried **by `name`**.
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `states` collection.
 *
 * @since v0.2.0
 */
export class StateQuery extends Queryable<StateDocument> {
  /**
   * Copy constructor for pageable queries in `authTokens` collection.
   *
   * @see Queryable
   * @param   {StateDocument|undefined}       document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: StateDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export StateSchema
 * @description This export creates a mongoose schema using the custom
 * {@link State} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.2.0
 */
export const StateSchema = SchemaFactory.createForClass(State);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link State} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
StateSchema.loadClass(State, true);
