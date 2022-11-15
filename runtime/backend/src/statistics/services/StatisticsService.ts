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
import {
  Statistics,
  StatisticsDocument,
  StatisticsModel,
  StatisticsQuery,
} from "../models/StatisticsSchema";

// internal dependencies
import { QueryService } from "../../common/services";
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";

/**
 * @class StatisticsService
 * @description The main service of the Leaderboards module.
 *
 * @since v0.5.0
 */
@Injectable()
export class StatisticsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {StatisticsModel} model
   * @param {QueryService} queriesService
   */
  constructor(
    @InjectModel(Statistics.name) private readonly model: StatisticsModel,
    private readonly queryService: QueryService<
      StatisticsDocument,
      StatisticsModel
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
   * @param   {StatisticsQuery}  query
   * @returns {Promise<number>}   The number of matching transactions.
   */
  async count(query: StatisticsQuery): Promise<number> {
    return await this.queryService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `statistics` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {StatisticsQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: StatisticsQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: StatisticsDocument = await this.queryService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query `statistics` based on query and return as paginated
   * results.
   *
   * @async
   * @param   {StatisticsQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<StatisticsDocument>>}
   */
  async find(
    query: StatisticsQuery,
  ): Promise<PaginatedResultDTO<StatisticsDocument>> {
    return await this.queryService.find(query, this.model);
  }

  /**
   * Find one `statistics` document in the database and use
   * a query based on the {@link StatisticsQuery} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {StatisticsQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<StatisticsDocument>}  The resulting `transactions` document.
   */
  async findOne(query: StatisticsQuery): Promise<StatisticsDocument> {
    return await this.queryService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `statistics` collection.
   * <br /><br />
   *
   * @async
   * @param   {StatisticsQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {StatisticsDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<StatisticsDocument>}  The *updated* `transactions` document.
   */
  async createOrUpdate(
    query: StatisticsQuery,
    data: StatisticsModel,
    ops: Record<string, any> = {},
  ): Promise<StatisticsDocument> {
    return await this.queryService.createOrUpdate(query, this.model, data, ops);
  }

  /**
   * This method *creates* or *updates* many documents in the
   * `statistics` collection.
   *
   * @async
   * @param   {StatisticsModel[]} documents
   * @returns {Promise<number>}
   */
  async updateBatch(documents: StatisticsModel[]): Promise<number> {
    return await this.queryService.updateBatch(this.model, documents);
  }
}
