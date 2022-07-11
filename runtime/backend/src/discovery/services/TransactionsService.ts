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
import { Transaction, TransactionModel, TransactionQuery } from "../models/TransactionSchema";
import { QueryService } from "../../common/services/QueryService";

/**
 * @class TransactionsService
 * @description The main service of the Accounts module.
 *
 * @since v0.2.0
 */
@Injectable()
export class TransactionsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {TransactionModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Transaction.name) private readonly model: TransactionModel,
    private readonly queriesService: QueryService<Transaction, TransactionModel>,
  ) {}

  /**
   * Method to query `Transactions` based on query and
   * return as paginated results.
   *
   * @async
   * @param   {TransactionQuery} query
   * @returns {Promise<PaginatedResultDTO<Transaction>>}
   */
  async find(query: TransactionQuery): Promise<PaginatedResultDTO<Transaction>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * Find one `Transactions` document in the database and use
   * a query based on the {@link TransactionQuery} class.
   * <br /><br />
   * 
   * @access public
   * @async
   * @param   {TransactionQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<Transaction>}  The resulting `states` document.
   */
  async findOne(query: TransactionQuery): Promise<Transaction> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `transactions` collection.
   * <br /><br />
   *
   * @async
   * @param   {TransactionQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TransactionModel}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<StateDocument>}  The *updated* `states` document.
   */
  async createOrUpdate(
    query: TransactionQuery,
    data: TransactionModel,
    ops: Record<string, any> = {},
  ): Promise<Transaction> {
    return await this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
      ops,
    );
  }

  /**
   * This method *creates* or *updates* many documents in the
   * `transactions` collection.
   *
   * @async
   * @param   {TransactionModel[]} documents
   * @returns {Promise<number>}
   */
  async updateBatch(
    documents: TransactionModel[],
  ): Promise<number> {
    return await this.queriesService.updateBatch(
      this.model,
      documents,
    );
  }
}
