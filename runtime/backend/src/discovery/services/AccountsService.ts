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
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import { Account, AccountModel, AccountQuery } from "../models/AccountSchema";
import { QueryService } from "../../common/services/QueryService";

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
    private readonly queriesService: QueryService<Account, AccountModel>,
  ) {}

  /**
   * Find one `AccountDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   * 
   * @access public
   * @async
   * @param   {AccountQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<StateDocument>}  The resulting `states` document.
   */
  async findOne(query: AccountQuery): Promise<Account> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * Method to query accounts based on query and returns as paginated result.
   *
   * @async
   * @param   {AccountQuery} query
   * @returns {Promise<PaginatedResultDTO<Account>>}
   */
  async find(query: AccountQuery): Promise<PaginatedResultDTO<Account>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * This method updates *exactly one document* in a collection.
   * <br /><br />
   *
   * @async
   * @param   {AccountQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {AccountModel}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<Account>}  The *updated* `states` document.
   */
  async createOrUpdate(
    query: AccountQuery,
    data: AccountModel,
    ops: Record<string, any> = {},
  ): Promise<Account> {
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
