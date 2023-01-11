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
import {
  Transaction,
  TransactionDocument,
  TransactionModel,
  TransactionQuery,
} from "../../common/models/TransactionSchema";
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
    private readonly queriesService: QueryService<
      TransactionDocument,
      TransactionModel
    >,
  ) {}

  /**
   * This method executes a *count* query using the {@link model}
   * argument.
   * <br /><br />
   * Caution: Count queries require a considerable amount of RAM
   * to execute. It is preferred to use pro-active statistics with
   * collections that contain one document with a counter.
   *
   * @param   {TransactionQuery}  query
   * @returns {Promise<number>}   The number of matching transactions.
   */
  async count(query: TransactionQuery): Promise<number> {
    return await this.queriesService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `transactions` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {TransactionQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: TransactionQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: TransactionDocument = await this.queriesService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query `Transactions` based on query and
   * return as paginated results.
   *
   * @async
   * @param   {TransactionQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<TransactionDocument>>}
   */
  async find(
    query: TransactionQuery,
  ): Promise<PaginatedResultDTO<TransactionDocument>> {
    return await this.queriesService.findWithTotal(query, this.model);
  }

  /**
   * Find one `Transactions` document in the database and use
   * a query based on the {@link TransactionQuery} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {TransactionQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<TransactionDocument>}  The resulting `transactions` document.
   */
  async findOne(query: TransactionQuery): Promise<TransactionDocument> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `transactions` collection.
   * <br /><br />
   *
   * @async
   * @param   {TransactionQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TransactionDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<TransactionDocument>}  The *updated* `transactions` document.
   */
  async createOrUpdate(
    query: TransactionQuery,
    data: TransactionModel,
    ops: Record<string, any> = {},
  ): Promise<TransactionDocument> {
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
  async updateBatch(documents: TransactionModel[]): Promise<number> {
    return await this.queriesService.updateBatch(this.model, documents);
  }
}
