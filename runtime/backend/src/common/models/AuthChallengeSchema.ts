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
import { AuthChallengeDTO } from "../models/AuthChallengeDTO";

/**
 * @class AuthChallenge
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `authChallenges` collection.
 *
 * @since v0.3.0
 */
@Schema({
  timestamps: true,
})
export class AuthChallenge extends Transferable<AuthChallengeDTO> {
  /**
   * The authentication code that is randomly generated for users
   * to use during authentication. This challenge must be attached
   * to a transfer transaction sent to the dApp's auth autority.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true, unique: true, type: String })
  public challenge: string;

  /**
   * The *address* of the user that used this authentication token.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public usedBy: string;

  /**
   * The timestamp at which this authentication token was used, this
   * may be referred to as the *time of consumption* of a token.
   *
   * @access public
   * @var {number}
   */
  @Prop({ required: true, index: true })
  public usedAt: number;

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
   * individually, as documents, in the collection: `authChallenges`.
   *
   * @access public
   * @returns {Record<string, unknown>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, unknown> {
    return {
      challenge: this.challenge,
    };
  }

  /**
   * This method implements a specialized transport format to restrict
   * the items that are ever returned in HTTP responses (DTOs).
   *
   * @access public
   * @returns {AuthChallengeDTO}    The individual document data that is used transport it.
   */
  public get toDTO(): AuthChallengeDTO {
    const dto = new AuthChallengeDTO();
    dto.challenge = this.challenge;
    return dto;
  }
}

/**
 * @type AuthChallengeDocument
 * @description This type is used to interface entities of the
 * `authChallenges` collection with *mongoose* and permits to
 * create objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link AuthChallengeSchema}, we also define
 * `AuthChallengeDocument` which is a mixin that comprises of
 * {@link AuthChallenge} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type AuthChallengeDocument = AuthChallenge & Documentable;

/**
 * @class AuthChallengeModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `AuthChallengeModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { AuthChallenge, AuthChallengeModel } from "./AuthChallengeSchema";
 *
 *   class MyAuthChallengeService {
 *     public constructor(
 *       @InjectModel(AuthChallenge.name) private readonly model: AuthChallengeModel
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
export class AuthChallengeModel extends Model<AuthChallengeDocument> {}

/**
 * @class AuthChallengeQuery
 * @description This class augments {@link Queryable} objects enabling
 * *state cache documents* to be queried **by `name`**.
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `states` collection.
 *
 * @since v0.3.0
 */
export class AuthChallengeQuery extends Queryable<AuthChallengeDocument> {
  /**
   * Copy constructor for pageable queries in `AuthChallenges` collection.
   *
   * @see Queryable
   * @param   {AuthChallengeDocument|undefined}   document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: AuthChallengeDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export AuthChallengeSchema
 * @description This export creates a mongoose schema using the custom
 * {@link AuthChallenge} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.0
 */
export const AuthChallengeSchema = SchemaFactory.createForClass(AuthChallenge);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link AuthChallenge} class to be called when the model
// is created by `mongoose` directly, e.g. as the result of a query.
AuthChallengeSchema.loadClass(AuthChallenge, true);
