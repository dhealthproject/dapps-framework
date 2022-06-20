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
import { Document } from "mongoose";

// internal dependencies
import { Transferable } from "../traits/Transferable";
import { Queryable } from "../concerns/Queryable";
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
 * @todo The {@link State} model does not need fields to be **public**.
 * @since v0.1.0
 */
@Schema({
  timestamps: true,
})
export class State extends Transferable<StateDTO> {
  /**
   * The document identifier. This field is automatically populated
   * if it does not exist (mongoose) and **cannot be updated**.
   *
   * @access public
   * @var {string}
   */
  public _id?: string;

  /**
   * The state cache document's **name**. Note that this field must
   * contain dynamic module names, e.g. `"discovery"` or `"payout",
   * such that state cache for each individual module can be tracked
   * accordingly.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true })
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
}

/**
 * @type StateDocument
 * @description This type merges the mongoose base `Document` object with
 * specialized state document objects such that this document can be used
 * directly in `mongoose` queries for `states` documents.
 *
 * @since v0.1.0
 */
export type StateDocument = State & Document;

/**
 * @class StateQuery
 * @description This class augments {@link Queryable} objects enabling
 * *state cache documents* to be queried **by `name`**.
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `states` collection.
 *
 * @since v0.1.0
 */
export class StateQuery extends Queryable {
  /**
   * This field can be used to query documents in the `states` mongo
   * collection by their `name` field value.
   *
   * @access public
   * @var {string}
   */
  public name?: string;

  /**
   * Copy constructor for pageable queries in `states`collection.
   * The `StateQuery` parameter that is optionally passed to this
   * method is then destructured to mimic a copy construction logic.
   *
   * @param   {string|undefined}    identifier   The *document* identifier (value of the field "_id").
   * @param   {string|undefined}    name         The query's `name` field value (optional).
   * @param   {number|undefined}    pageNumber   The page number of the query (defaults to `1`).
   * @param   {number|undefined}    pageSize     The number of entities/documents in one page (defaults to `20`).
   * @param   {string|undefined}    sort         The field used for sorting (defaults to `"_id"`).
   * @param   {string|undefined}    order        The sorting direction, must be one of `"asc"` and `"desc"` (defaults to `"asc"`)
   */
  public constructor(
    id?: string,
    name?: string,
    pageNumber?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
  ) {
    super(id, pageNumber, pageSize, sort, order);

    if (undefined !== name) this.name = name;
  }
}

/**
 * @export StateSchema
 * @description This export creates a mongoose schema using the custom
 * {@link State} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.1.0
 */
export const StateSchema = SchemaFactory.createForClass(State);
