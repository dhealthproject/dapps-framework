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
import { AccountSessionDTO } from "./AccountSessionDTO";

/**
 * @class AccountSession
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `account-sessions` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @since v0.3.2
 */
@Schema({
  timestamps: true,
  collection: "account-sessions",
})
export class AccountSession extends Transferable<AccountSessionDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link AccountSessionDocument} or the model
   * {@link AccountSessionModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "account-sessions";

  /**
   * The account's **address**. An address typically refers to a
   * human-readable series of 39 characters, starting either with
   * a `T`, for TESTNET addresses, or with a `N`, for MAINNET addresses.
   * <br /><br />
   * This field is **required**, *indexed* and values are expected
   * to be *unique*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true, type: String })
  public readonly address: string;

  /**
   * The JWT sub value that can be attached in the **bearer
   * authorization header** of HTTP requests to serve as a
   * unique identity of each device.
   * <br /><br />
   * This field is *not indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, type: String })
  public readonly sub: string;

  /**
   * The JWT access token that can be attached in the **bearer
   * authorization header** of HTTP requests to indicate that
   * a user is authenticated.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   * <br /><br />
   * See more details in {@link AccessTokenDTO}.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: false, nullable: true })
  public readonly accessToken?: string;

  /**
   * The JWT refresh token that can be attached in the **bearer
   * authorization header** of HTTP requests to `/auth/token` to
   * indicate that a user's access token must be refreshed.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   * <br /><br />
   * See more details in {@link AccessTokenDTO}.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ index: true, nullable: true })
  public readonly refreshTokenHash?: string;

  /**
   * The transaction hash that is/was attached to the **last**
   * authenticated *session* of this account.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ nullable: true })
  public readonly lastSessionHash?: string;

  /**
   * The account's **referrer address**. This address refers to the
   * account that *invited* the current account to the dApp.
   * <br /><br />
   * This field is **optional** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ index: true })
  public readonly referredBy?: string;

  /**
   * The account's referral code. This code should be used when inviting
   * new users to the dApp. This field contains a unique random string of
   * 8 characters.
   * <br /><br />
   * This field is **required**, *indexed* and values are expected
   * to be *unique*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true, unique: true, type: String })
  public readonly referralCode: string;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an account but rather the date of creation of the
   * cached database entry.
   * <br /><br />
   * This field is **optional** and *indexed*.
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
   * individually, as documents, in the collection: `account-sessions`.
   *
   * @access public
   * @returns {Record<string, unknown>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, unknown> {
    return {
      address: this.address,
    };
  }

  /**
   * This *static* method populates a {@link AccountSessionDTO} object from the
   * values of a {@link AccountSessionDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {AccountSessionDocument}   doc   The document as received from mongoose.
   * @param   {AccountSessionDTO}        dto   The DTO object that will be populated with values.
   * @returns {AccountSessionDTO}        The `dto` object with fields set.
   */
  public static fillDTO(
    doc: AccountSessionDocument,
    dto: AccountSessionDTO,
  ): AccountSessionDTO {
    dto.address = doc.address;
    dto.accessToken = doc.accessToken;
    dto.refreshTokenHash = doc.refreshTokenHash;
    dto.lastSessionHash = doc.lastSessionHash;
    dto.referralCode = doc.referralCode;
    dto.referredBy = doc.referredBy;
    return dto;
  }
}

/**
 * @type AccountSessionDocument
 * @description This type is used to interface entities of the
 * `account-sessions` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link AccountSessionSchema}, we also define
 * `AccountDocument` which is a mixin that comprises of
 * {@link AccountSession} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.2
 */
export type AccountSessionDocument = AccountSession & Documentable;

/**
 * @class AccountSessionModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `AccountSessionModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { AccountSession, AccountSessionModel } from "./AccountSessionSchema";
 *
 *   class MyAccountService {
 *     public constructor(
 *       @InjectModel(AccountSession.name) private readonly model: AccountSessionModel
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
export class AccountSessionModel extends Model<AccountSessionDocument> {}

/**
 * @class AccountSessionQuery
 * @description This class augments {@link Queryable} objects enabling
 * *account-sessions* to be queried **by `address`** and **by `transactionsCount`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `account-sessions` collection.
 *
 * @since v0.3.2
 */
export class AccountSessionQuery extends Queryable<AccountSessionDocument> {
  /**
   * Copy constructor for pageable queries in `account-sessions` collection.
   *
   * @see Queryable
   * @param   {AccountSessionDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}            queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: AccountSessionDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export AccountSessionSchema
 * @description This export creates a mongoose schema using the custom
 * {@link AccountSession} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.2
 */
export const AccountSessionSchema =
  SchemaFactory.createForClass(AccountSession);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link AccountSession} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
AccountSessionSchema.loadClass(AccountSession, true);
