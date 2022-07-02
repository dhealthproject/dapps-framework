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
import { Documentable } from "../../common/concerns/Documentable";
import { Transferable } from "../../common/traits/Transferable";
import { Queryable, QueryParameters } from "../../common/concerns/Queryable";
import { AccountDTO } from "../models/AccountDTO";

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
 * @todo The {@link Account} model does not need fields to be **public**.
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.2.0
 */
@Schema({
  timestamps: true,
})
export class Account extends Transferable<AccountDTO> {
  /**
   * The document identifier. This field is automatically populated
   * if it does not exist (mongoose) and **cannot be updated**.
   *
   * @access public
   * @var {string}
   */
  public _id: string;

  /**
   * The account's **address**. An address typically refers to a
   * human-readable series of 39 characters, starting either with
   * a `T`, for TESTNET addresses, or with a `N`, for MAINNET addresses.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true })
  public address: string;

  /**
   * The account's total **transactions count**. Typically, this field
   * will contain the number of transactions an account has done with
   * a particular dApp.
   * <br /><br />
   * Caution: This field **does not** represent the *total* number of
   * transactions that an account has done during its entire lifecycle.
   *
   * @access public
   * @var {number}
   */
  @Prop()
  public transactionsCount?: number;

  /**
   * The account's first identified **transaction date**. Typically, this
   * field will contain the timestamp of the first transaction *to the dApp*
   * that was issued with this account.
   *
   * @access public
   * @var {Date}
   */
  @Prop()
  public firstTransactionAt?: Date;

  /**
   * The account's first identified **transaction block**. Typically, this
   * field will contain the block height of the first transaction *to the dApp*
   * that was issued with this account.
   *
   * @access public
   * @var {number}
   */
  @Prop()
  public firstTransactionAtBlock?: number;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of creation of an account but rather the date of creation of the
   * cached database entry.
   *
   * @access public
   * @var {Date}
   */
  @Prop()
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
   * individually, as documents, in the collection: `accounts`.
   *
   * @access public
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public toQuery(): Record<string, any> {
    return {
      address: this.address,
    };
  }
}

/**
 * @type AccountDocument
 * @description This type merges the mongoose base `Document` object with
 * specialized state document objects such that this document can be used
 * directly in `mongoose` queries for `accounts` documents.
 * <br /><br />
 * Due to the implementation of `toQuery` in {@link Account}, the order
 * of creation of this mixin is important such that the implementation of
 * the method inside `Account` overwrites that of `Documentable`.
 *
 * @since v0.2.0
 */
export type AccountDocument = Documentable & Account;

/**
 * @class AccountQuery
 * @description This class augments {@link Queryable} objects enabling
 * *accounts* to be queried **by `address`** and **by `transactionsCount`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `accounts` collection.
 *
 * @since v0.2.0
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
 * @since v0.2.0
 */
export const AccountSchema = SchemaFactory.createForClass(Account);
