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
import { Model } from "mongoose";

// internal dependencies
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import {
  Account,
  AccountDocument,
  AccountQuery,
} from "../models/AccountSchema";
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
   * @param {Model<AccountDocument>} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Account.name) private readonly model: Model<AccountDocument>,
    private readonly queriesService: QueryService<AccountDocument>,
  ) {}

  /**
   * Find one `AccountDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   * 
   * @access public
   * @async
   * @param   {StateQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<StateDocument>}  The resulting `states` document.
   */
  async findOne(query: AccountQuery): Promise<AccountDocument> {
    return this.queriesService.findOne(query, this.model);
  }

  /**
   * Method to query accounts based on query and returns as paginated result.
   *
   * @async
   * @param   {AccountQuery} query
   * @returns {Promise<PaginatedResultDTO<Account>>}
   */
  async find(query: AccountQuery): Promise<PaginatedResultDTO<AccountDocument>> {
    return this.queriesService.find(query, this.model);
  }

  /**
   * This method updates *exactly one document* in a collection.
   * <br /><br />
   *
   * @async
   * @param   {AccountQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {StateData}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @returns {Promise<StateDocument>}  The *updated* `states` document.
   */
  async updateOne(
    query: AccountQuery,
    data: AccountDocument,
  ): Promise<AccountDocument> {
    return this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
    );
  }

  /**
   * Method to update a batch of accounts.
   *
   * @async
   * @param   {AccountDocument[]} accountDocuments
   * @returns {Promise<number>}
   */
  async updateBatch(accountDocuments: AccountDocument[]): Promise<number> {
    return this.queriesService.updateBatch(
      this.model,
      accountDocuments,
    );
  }
}
