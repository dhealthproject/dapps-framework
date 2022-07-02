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
import { Queryable, QueryParameters } from "../concerns/Queryable";

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
   * The *address* of the user that used this authentication token.
   *
   * @access public
   * @var {string}
   */
   @Prop({ required: true })
   public usedBy: string;

  /**
   * The timestamp at which this authentication token was used, this
   * may be referred to as the *time of consumption* of a token.
   *
   * @access public
   * @var {Date}
   */
  @Prop({ required: true })
  public usedAt: Date;

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `authTokens`.
   *
   * @access public
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public toQuery(): Record<string, any> {
    return {
      authCode: this.authCode,
    };
  }
}

/**
 * @type AuthTokenDocument
 * @description This type merges the mongoose base `Document` object with
 * specialized authentication token objects such that this document can be
 * used directly in `mongoose` queries for `authTokens` documents.
 * <br /><br />
 * Due to the implementation of `toQuery` in {@link AuthToken}, the order
 * of creation of this mixin is important such that the implementation of
 * the method inside `AuthToken` overwrites that of `Documentable`.
 *
 * @since v0.2.0
 */
export type AuthTokenDocument = Documentable & AuthToken;

/**
 * @class AuthTokenQuery
 * @description This class augments {@link Queryable} objects enabling
 * *state cache documents* to be queried **by `name`**.
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `states` collection.
 *
 * @since v0.2.0
 */
export class AuthTokenQuery extends Queryable<AuthTokenDocument> {
  /**
   * Copy constructor for pageable queries in `authTokens` collection.
   *
   * @see Queryable
   * @param   {AuthTokenDocument|undefined}   document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: AuthTokenDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export AuthTokenSchema
 * @description This export creates a mongoose schema using the custom
 * {@link AuthToken} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.2.0
 */
export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
