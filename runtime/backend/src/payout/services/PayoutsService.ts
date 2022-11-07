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
  Payout,
  PayoutDocument,
  PayoutModel,
  PayoutQuery,
} from "../models/PayoutSchema";
import { QueryService } from "../../common/services/QueryService";

/**
 * @class PayoutsService
 * @description The main service of the payouts module.
 *
 * @since v0.3.0
 */
@Injectable()
export class PayoutsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {PayoutModel} model
   * @param {QueryService} queryService
   */
  constructor(
    @InjectModel(Payout.name) private readonly model: PayoutModel,
    private readonly queryService: QueryService<PayoutDocument, PayoutModel>,
  ) {}

  /**
   * This method executes a *count* query using the {@link model}
   * argument.
   * <br /><br />
   * Caution: Count queries require a considerable amount of RAM
   * to execute. It is preferred to use pro-active statistics with
   * collections that contain one document with a counter.
   *
   * @param   {PayoutQuery}  query
   * @returns {Promise<number>}   The number of matching transactions.
   */
  async count(query: PayoutQuery): Promise<number> {
    return await this.queryService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `payouts` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {PayoutQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: PayoutQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: PayoutDocument = await this.queryService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query `payouts` based on query and return as paginated
   * results.
   *
   * @async
   * @param   {PayoutQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<PayoutDocument>>}
   */
  async find(query: PayoutQuery): Promise<PaginatedResultDTO<PayoutDocument>> {
    return await this.queryService.find(query, this.model);
  }

  /**
   * Find one `payouts` document in the database and use
   * a query based on the {@link PayoutQuery} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {PayoutQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PayoutDocument>}  The resulting `transactions` document.
   */
  async findOne(query: PayoutQuery): Promise<PayoutDocument> {
    return await this.queryService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `payouts` collection.
   * <br /><br />
   *
   * @async
   * @param   {PayoutQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {PayoutDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<PayoutDocument>}  The *updated* `transactions` document.
   */
  async createOrUpdate(
    query: PayoutQuery,
    data: PayoutModel,
    ops: Record<string, any> = {},
  ): Promise<PayoutDocument> {
    return await this.queryService.createOrUpdate(query, this.model, data, ops);
  }

  /**
   * This method *creates* or *updates* many documents in the
   * `payouts` collection.
   *
   * @async
   * @param   {PayoutModel[]} documents
   * @returns {Promise<number>}
   */
  async updateBatch(documents: PayoutModel[]): Promise<number> {
    return await this.queryService.updateBatch(this.model, documents);
  }
}
