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
import { BulkWriteResult, UnorderedBulkOperation } from "mongodb";

// internal dependencies
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import {
  Transaction,
  TransactionDocument,
  TransactionQuery,
} from "../models/TransactionSchema";
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
   * @param {Model<TransactionDocument>} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Transaction.name) private readonly model: Model<TransactionDocument>,
    private readonly queriesService: QueryService<TransactionDocument>,
  ) {}

  /**
   * Method to query `Transactions` based on query and
   * return as paginated results.
   *
   * @async
   * @param   {TransactionQuery} query
   * @returns {Promise<PaginatedResultDTO<Transaction>>}
   */
  async find(query: TransactionQuery): Promise<PaginatedResultDTO<TransactionDocument>> {
    return this.queriesService.find(query, this.model);
  }

  /**
   * Find one `Transactions` document in the database and use
   * a query based on the {@link TransactionQuery} class.
   * <br /><br />
   * 
   * @access public
   * @async
   * @param   {StateQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<StateDocument>}  The resulting `states` document.
   */
  async findOne(query: TransactionQuery): Promise<TransactionDocument> {
    return this.queriesService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `transactions` collection.
   * <br /><br />
   *
   * @async
   * @param   {TransactionQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TransactionDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @returns {Promise<StateDocument>}  The *updated* `states` document.
   */
  async createOrUpdate(
    query: TransactionQuery,
    data: TransactionDocument,
  ): Promise<TransactionDocument> {
    return this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
    );
  }

  /**
   * This method *creates* or *updates* many documents in the
   * `transactions` collection.
   *
   * @async
   * @param   {TransactionDocument[]} documents
   * @returns {Promise<TransactionDocument[]>}
   */
  async updateBatch(
    documents: TransactionDocument[],
  ): Promise<TransactionDocument[]> {
    // get the bulk operation handler
    const bulk: UnorderedBulkOperation =
      this.model.collection.initializeUnorderedBulkOp();

    // prepares create/update query for each
    for (let i = 0, max = documents.length; i < max; i++) {
      const document = documents[i];
      const query = {
        signerAddress: document.signerAddress,
        transactionHash: document.transactionHash,
      };

      // adds query to bulk operation
      bulk.find(query).upsert().update({
        $set: {
          ...document,
          updatedAt: new Date(),
        },
      });
    }

    // execute bulk operation
    bulk.execute();
    return documents;
  }
}
