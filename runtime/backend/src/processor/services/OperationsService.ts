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
import { QueryService } from "../../common/services/QueryService";
import {
  Operation,
  OperationDocument,
  OperationModel,
  OperationQuery,
} from "../models/OperationSchema";

/**
 * @class OperationsService
 * @description The main service of the Accounts module.
 *
 * @since v0.2.0
 */
@Injectable()
export class OperationsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {OperationModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Operation.name) private readonly model: OperationModel,
    private readonly queriesService: QueryService<
      OperationDocument,
      OperationModel
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
   * @param   {OperationQuery}  query
   * @returns {Promise<number>}   The number of matching transactions.
   */
  async count(query: OperationQuery): Promise<number> {
    return await this.queriesService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `operations` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {OperationQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: OperationQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: OperationDocument = await this.queriesService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query `operations` based on query and
   * return as paginated results.
   *
   * @async
   * @param   {OperationQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<OperationDocument>>}
   */
  async find(
    query: OperationQuery,
  ): Promise<PaginatedResultDTO<OperationDocument>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * Find one `operations` document in the database and use
   * a query based on the {@link OperationQuery} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {OperationQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<OperationDocument>}  The resulting `operations` document.
   */
  async findOne(query: OperationQuery): Promise<OperationDocument> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `operations` collection.
   * <br /><br />
   *
   * @async
   * @param   {OperationQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {OperationDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<OperationDocument>}  The *updated* `operations` document.
   */
  async createOrUpdate(
    query: OperationQuery,
    data: OperationModel,
    ops: Record<string, any> = {},
  ): Promise<OperationDocument> {
    return await this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
      ops,
    );
  }

  /**
   * This method *creates* or *updates* many documents in the
   * `operations` collection.
   *
   * @async
   * @param   {OperationModel[]} documents The documents to be *created* or *update*.
   * @returns {Promise<number>} The number of documents *created* or *updated*.
   */
  async updateBatch(documents: OperationModel[]): Promise<number> {
    return await this.queriesService.updateBatch(this.model, documents);
  }
}
