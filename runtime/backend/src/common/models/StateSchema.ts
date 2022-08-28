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
 * Note that this class uses the generic {@link Transferable:COMMON} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo The {@link State} model does not need fields to be **public**.
 * @since v0.2.0
 */
@Schema({
  timestamps: true,
})
export class State extends Transferable<StateDTO> {
  /**
   * The state cache document's **name**. Note that this field must
   * contain dynamic module names, e.g. `"discovery"` or `"payout",
   * such that state cache for each individual module can be tracked
   * accordingly.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true, unique: true, type: String })
  public name: string;

  /**
   * The state cache document's actual **data**. Note that this field
   * is *poorly* typed and can contain any *object*, the reason for
   * this is to be flexible about state caches for the beginning, in a
   * later iteration of the framework it is possible that this field
   * would be updated to a strictly typed alternative.
   *
   * @access public
   * @var {StateData}
   */
  @Prop({ required: true, type: Object })
  public data: StateData;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an account but rather the date of creation of the
   * cached database entry.
   *
   * @access public
   * @var {Date}
   */
  @Prop({ index: true })
  public createdAt?: Date;

  /**
   * The document's update timestamp. This field **does not** reflect the
   * date of update of an account but rather the date of update of the
   * cached database entry.
   *
   * @access public
   * @var {Date}
   */
  @Prop()
  public updatedAt?: Date;

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
   * This method implements a specialized transport format to restrict
   * the items that are ever returned in HTTP responses (DTOs).
   *
   * @access public
   * @returns {StateDTO}    The individual document data that is used transport it.
   */
  public get toDTO(): StateDTO {
    const dto = new StateDTO();
    dto.name = this.name;
    dto.data = this.data;
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
 * In class {@link Queryable:COMMON}, the first generic accepted
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
