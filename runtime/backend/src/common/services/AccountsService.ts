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
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

// internal dependencies
import { PaginatedResultDTO } from "../models/PaginatedResultDTO";
import { QueryService } from "../services/QueryService";
import { Account, AccountDocument, AccountModel, AccountQuery } from "../models/AccountSchema";

/**
 * @class AccountsService
 * @description The main service of the Accounts module.
 *
 * @todo The updateBatch method should accept a **query** not a list of DTOs.
 * @todo This class should not handle *DTOs* as it does not **transfer** data, it should handle only **models** and queries (repository pattern).
 * @since v0.1.0
 */
@Injectable()
export class AccountsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {AccountModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Account.name) private readonly model: AccountModel,
    private readonly queriesService: QueryService<AccountDocument, AccountModel>,
  ) {}

  /**
   * This method executes a *count* query using the {@link model}
   * argument.
   * <br /><br />
   * Caution: Count queries require a considerable amount of RAM
   * to execute. It is preferred to use pro-active statistics with
   * collections that contain one document with a counter.
   *
   * @param   {AccountQuery}  query 
   * @returns {Promise<number>}   The number of matching accounts.
   */ 
  async count(query: AccountQuery): Promise<number> {
    return await this.queriesService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `accounts` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {AccountQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: AccountQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: AccountDocument = await this.queriesService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query accounts based on query and returns as paginated result.
   *
   * @async
   * @param   {AccountQuery} query
   * @returns {Promise<PaginatedResultDTO<AccountDocument>>}
   */
  async find(query: AccountQuery): Promise<PaginatedResultDTO<AccountDocument>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * Find one `AccountDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   * 
   * @access public
   * @async
   * @param   {AccountQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<AccountDocument>}  The resulting `accounts` document.
   */
  async findOne(query: AccountQuery): Promise<AccountDocument> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method updates *exactly one document* in a collection.
   * <br /><br />
   *
   * @async
   * @param   {AccountQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {AccountModel}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<AccountDocument>}  The *updated* `accounts` document.
   */
  async createOrUpdate(
    query: AccountQuery,
    data: AccountModel,
    ops: Record<string, any> = {},
  ): Promise<AccountDocument> {
    return await this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
      ops,
    );
  }

  /**
   * Method to update a batch of accounts.
   *
   * @async
   * @param   {AccountModel[]} accountDocuments
   * @returns {Promise<number>}
   */
  async updateBatch(accountDocuments: AccountModel[]): Promise<number> {
    return await this.queriesService.updateBatch(
      this.model,
      accountDocuments,
    );
  }
}
