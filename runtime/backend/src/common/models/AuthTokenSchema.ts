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
export class AuthToken extends Documentable /* not transferable */ {
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
  public get toQuery(): Record<string, any> {
    return {
      authCode: this.authCode,
    };
  }

  /**
   * This method implements the document columns list as defined
   * for the collection `authTokens`.
   *
   * @returns {Record<string, any>}    The individual data fields that belong to the document.
   */
  public get toDocument(): Record<string, any> {
    return {
      id: this._id,
      authCode: this.authCode,
      usedBy: this.usedBy,
      usedAt: this.usedAt,
    }
  }
}

/**
 * @class AuthTokenModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `AuthTokenModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { AuthToken, AuthTokenModel } from "./AuthTokenSchema";
 *
 *   class MyAuthTokenService {
 *     public constructor(
 *       @InjectModel(AuthToken.name) private readonly model: AuthTokenModel
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
export class AuthTokenModel extends Model<AuthToken> {}

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
export class AuthTokenQuery extends Queryable<AuthToken> {
  /**
   * Copy constructor for pageable queries in `authTokens` collection.
   *
   * @see Queryable
   * @param   {AuthToken|undefined}   document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: AuthToken,
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

// This call to **loadClass** on the schema object enables instance
// methods on the {@link AuthToken} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
AuthTokenSchema.loadClass(AuthToken, true);
