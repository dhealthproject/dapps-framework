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
import { Transferable } from "../../common/concerns/Transferable";
import { Queryable } from "../../common/concerns/Queryable";
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
 * @since v0.1.0
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
}

/**
 * @type AccountDocument
 * @description This type merges the mongoose base `Document` object with
 * specialized state document objects such that this document can be used
 * directly in `mongoose` queries for `accounts` documents.
 *
 * @since v0.1.0
 */
export type AccountDocument = Account & Document;

/**
 * @class AccountQuery
 * @description This class augments {@link Queryable} objects enabling
 * *accounts* to be queried **by `address`** and **by `transactionsCount`.
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `accounts` collection.
 *
 * @since v0.1.0
 */
export class AccountQuery extends Queryable {
  /**
   * This field can be used to query documents in the `accounts` mongo
   * collection by their `address` field value.
   *
   * @access public
   * @var {string}
   */
  public address?: string;

  /**
   * This field can be used to query documents in the `accounts` mongo
   * collection by their `transactionsCount` field value.
   *
   * @access public
   * @var {number}
   */
  public transactionsCount?: number;

  /**
   * Copy constructor for pageable queries in `states`collection.
   * The `StateQuery` parameter that is optionally passed to this
   * method is then destructured to mimic a copy construction logic.
   *
   * @param   {string|undefined}    identifier   The *document* identifier (value of the field "_id").
   * @param   {string|undefined}    address         The query's `address` field value (optional).
   * @param   {number|undefined}    transactionsCount  The query's `transactionsCount` field value (optional).
   * @param   {number|undefined}    pageNumber   The page number of the query (defaults to `1`).
   * @param   {number|undefined}    pageSize     The number of entities/documents in one page (defaults to `20`).
   * @param   {string|undefined}    sort         The field used for sorting (defaults to `"_id"`).
   * @param   {string|undefined}    order        The sorting direction, must be one of `"asc"` and `"desc"` (defaults to `"asc"`)
   */
  public constructor(
    id?: string,
    address?: string,
    transactionsCount?: number,
    pageNumber?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
  ) {
    super(id, pageNumber, pageSize, sort, order);

    if (undefined !== address) this.address = address;
    if (undefined !== transactionsCount)
      this.transactionsCount = transactionsCount;
  }
}

/**
 * @export AccountSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Account} class and should be used mainly when *inferring* the
 * type of fields in a document for the corresponding collection.
 *
 * @since v0.1.0
 */
export const AccountSchema = SchemaFactory.createForClass(Account);
