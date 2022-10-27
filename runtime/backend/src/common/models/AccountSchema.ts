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
import { AccountDTO } from "./AccountDTO";

/**
 * @class Account
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `accounts` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.3.0
 */
@Schema({
  timestamps: true,
})
export class Account extends Transferable<AccountDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link AccountDocument} or the model
   * {@link AccountModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "accounts";

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
  @Prop({ required: true, index: true, unique: true, type: String })
  public readonly address: string;

  /**
   * The account's **referrer address**. An address typically refers to a
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
  @Prop({ index: true })
  public readonly referredBy?: string;

  /**
   * The account's total **transactions count**. Typically, this field
   * will contain the number of transactions an account has done with
   * a particular dApp.
   * <br /><br />
   * Caution: This field **does not** represent the *total* number of
   * transactions that an account has done during its entire lifecycle.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop()
  public readonly transactionsCount?: number;

  /**
   * The account's first identified **transaction date**. Typically, this
   * field will contain the timestamp of the first transaction *to the dApp*
   * that was issued with this account.
   * <br /><br />
   * This field is **optional** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ index: true, nullable: true })
  public readonly firstTransactionAt?: number;

  /**
   * The account's identified referral code.
   * This field should contain randomly generated unique referral code.
   * <br /><br />
   * This field is required.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ index: true, unique: true })
  public readonly refCode: string;

  /**
   * The account's first identified **transaction block**. Typically, this
   * field will contain the block height of the first transaction *to the dApp*
   * that was issued with this account.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop()
  public readonly firstTransactionAtBlock?: number;

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
   * individually, as documents, in the collection: `accounts`.
   *
   * @access public
   * @returns {Record<string, unknown>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, unknown> {
    return {
      address: this.address,
      refCode: this.refCode,
      referredBy: this.referredBy,
    };
  }

  /**
   * This *static* method populates a {@link AccountDTO} object from the
   * values of a {@link AccountDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {AccountDocument}   doc   The document as received from mongoose.
   * @param   {AccountDTO}        dto   The DTO object that will be populated with values.
   * @returns {AccountDTO}        The `dto` object with fields set.
   */
  public static fillDTO(doc: AccountDocument, dto: AccountDTO): AccountDTO {
    dto.address = doc.address;
    dto.transactionsCount = doc.transactionsCount;
    dto.firstTransactionAt = doc.firstTransactionAt;
    dto.firstTransactionAtBlock = doc.firstTransactionAtBlock;
    dto.refCode = doc.refCode;
    return dto;
  }
}

/**
 * @type AccountDocument
 * @description This type is used to interface entities of the
 * `accounts` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link AccountSchema}, we also define
 * `AccountDocument` which is a mixin that comprises of
 * {@link Account} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type AccountDocument = Account & Documentable;

/**
 * @class AccountModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `AccountModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Account, AccountModel } from "./AccountSchema";
 *
 *   class MyAccountService {
 *     public constructor(
 *       @InjectModel(Account.name) private readonly model: AccountModel
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
export class AccountModel extends Model<AccountDocument> {}

/**
 * @class AccountQuery
 * @description This class augments {@link Queryable} objects enabling
 * *accounts* to be queried **by `address`** and **by `transactionsCount`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `accounts` collection.
 *
 * @since v0.3.0
 */
export class AccountQuery extends Queryable<AccountDocument> {
  /**
   * Copy constructor for pageable queries in `accounts` collection.
   *
   * @see Queryable
   * @param   {AccountDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: AccountDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export AccountSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Account} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.0
 */
export const AccountSchema = SchemaFactory.createForClass(Account);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Account} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
AccountSchema.loadClass(Account, true);
