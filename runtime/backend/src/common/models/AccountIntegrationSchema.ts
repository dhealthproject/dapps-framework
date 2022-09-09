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
import { AccountIntegrationDTO } from "./AccountIntegrationDTO";

/**
 * @class AccountIntegration
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `account_integrations` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo The {@link AccountIntegration} model does not need fields to be **public**.
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.3.0
 */
@Schema({
  timestamps: true,
})
export class AccountIntegration extends Transferable<AccountIntegrationDTO> {
  /**
   * The account's **address**. An address typically refers to a
   * human-readable series of 39 characters, starting either with
   * a `T`, for TESTNET addresses, or with a `N`, for MAINNET addresses.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public address: string;

  /**
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public name: string;

  /**
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public authorizationHash: string;

  /**
   *
   * @access public
   * @var {string}
   */
  @Prop({ index: true })
  public remoteIdentifier?: string;

  /**
   *
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @access public
   * @var {Date}
   */
  @Prop({ nullable: true })
  public encAccessToken?: string;

  /**
   *
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @var {number}
   */
  @Prop({ nullable: true })
  public encRefreshToken?: string;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an integration but rather the date of creation of the
   * cached database entry.
   *
   * @access public
   * @var {Date}
   */
  @Prop({ index: true })
  public createdAt?: Date;

  /**
   * The document's update timestamp. This field **does not** reflect the
   * date of update of an integration but rather the date of update of the
   * cached database entry.
   *
   * @access public
   * @var {Date}
   */
  @Prop()
  public updatedAt?: Date;

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `account_integrations`.
   *
   * @access public
   * @returns {Record<string, unknown>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, unknown> {
    const query: Record<string, any> = {
      address: this.address, // always present
    };

    if (undefined !== this.name) query["name"] = this.name;

    return query;
  }

  /**
   * This *static* method populates a {@link AccountIntegrationDTO} object from the
   * values of a {@link AccountIntegrationDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {AccountIntegrationDocument}   doc   The document as received from mongoose.
   * @param   {AccountIntegrationDTO}        dto   The DTO object that will be populated with values.
   * @returns {AccountIntegrationDTO}        The `dto` object with fields set.
   */
  public static fillDTO(
    doc: AccountIntegrationDocument,
    dto: AccountIntegrationDTO,
  ): AccountIntegrationDTO {
    dto.address = doc.address;
    dto.name = doc.name;
    return dto;
  }
}

/**
 * @type AccountIntegrationDocument
 * @description This type is used to interface entities of the
 * `account_integrations` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link AccountIntegrationSchema}, we also define
 * `AccountIntegrationDocument` which is a mixin that comprises of
 * {@link AccountIntegration} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type AccountIntegrationDocument = AccountIntegration & Documentable;

/**
 * @class AccountIntegrationModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `AccountIntegrationModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Account, AccountIntegrationModel } from "./AccountSchema";
 *
 *   class MyAccountService {
 *     public constructor(
 *       @InjectModel(Account.name) private readonly model: AccountIntegrationModel
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
export class AccountIntegrationModel extends Model<AccountIntegrationDocument> {}

/**
 * @class AccountIntegrationQuery
 * @description This class augments {@link Queryable} objects enabling
 * *accounts* to be queried **by `address`** and **by `transactionsCount`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `account_integrations` collection.
 *
 * @since v0.3.0
 */
export class AccountIntegrationQuery extends Queryable<AccountIntegrationDocument> {
  /**
   * Copy constructor for pageable queries in `account_integrations` collection.
   *
   * @see Queryable
   * @param   {AccountIntegrationDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: AccountIntegrationDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export AccountIntegrationSchema
 * @description This export creates a mongoose schema using the custom
 * {@link AccountIntegration} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.3.0
 */
export const AccountIntegrationSchema =
  SchemaFactory.createForClass(AccountIntegration);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link AccountIntegration} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
AccountIntegrationSchema.loadClass(AccountIntegration, true);
