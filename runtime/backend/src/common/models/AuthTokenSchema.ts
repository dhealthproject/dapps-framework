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

// internal dependencies
import { Documentable } from "../concerns/Documentable";
import { Queryable } from "../concerns/Queryable";

/**
 * @class AuthToken
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `authTokens` collection.
 *
 * @since v0.2.0
 */
@Schema({
  timestamps: true,
})
export class AuthToken /* not transferable */ {
  /**
   * The document identifier. This field is automatically populated
   * if it does not exist (mongoose) and **cannot be updated**.
   *
   * @access public
   * @var {string}
   */
  public _id?: string;

  /**
   * The authentication code that is randomly generated for users
   * to use during authentication.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true })
  public authCode: string;

  /**
   * The state cache document's actual **data**. Note that this field
   * is *poorly* typed and can contain any *object*, the reason for
   * this is to be flexible about state caches for the beginning, in a
   * later iteration of the framework it is possible that this field
   * would be updated to a strictly typed alternative.
   *
   * @access public
   * @var {number}
   */
  @Prop({ required: true })
  public usedAt: number;
}

/**
 * @type AuthTokenDocument
 * @description This type merges the mongoose base `Document` object with
 * specialized authentication token objects such that this document can be
 * used directly in `mongoose` queries for `authTokens` documents.
 *
 * @since v0.1.0
 */
export type AuthTokenDocument = AuthToken & Documentable;

/**
 * @class AuthTokenQuery
 * @description This class augments {@link Queryable} objects enabling
 * *state cache documents* to be queried **by `name`**.
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `states` collection.
 *
 * @since v0.1.0
 */
export class AuthTokenQuery extends Queryable {
  /**
   * This field can be used to query documents in the `authTokens` mongo
   * collection by their `authCode` field value.
   *
   * @access public
   * @var {string}
   */
  public authCode?: string;

  /**
   * Copy constructor for pageable queries in `authTokens` collection.
   * The `AuthTokenQuery` parameter that is optionally passed to this
   * method is then destructured to mimic a copy construction logic.
   *
   * @param   {string|undefined}    identifier   The *document* identifier, this is the value of the field "_id" (optional).
   * @param   {string|undefined}    authCode     The query's `authCode` field value (optional).
   * @param   {number|undefined}    pageNumber   The page number of the query (defaults to `1`).
   * @param   {number|undefined}    pageSize     The number of entities/documents in one page (defaults to `20`).
   * @param   {string|undefined}    sort         The field used for sorting (defaults to `"_id"`).
   * @param   {string|undefined}    order        The sorting direction, must be one of `"asc"` and `"desc"` (defaults to `"asc"`)
   */
  public constructor(
    id?: string,
    authCode?: string,
    pageNumber?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
  ) {
    super(id, pageNumber, pageSize, sort, order);

    if (undefined !== authCode) this.authCode = authCode;
  }
}

/**
 * @export AuthTokenSchema
 * @description This export creates a mongoose schema using the custom
 * {@link AuthToken} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.1.0
 */
export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
