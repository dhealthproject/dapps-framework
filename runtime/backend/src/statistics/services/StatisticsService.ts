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
   * @access public
   * @constructor
   * @param {StatisticsModel} model
   * @param {QueryService} queriesService
   */
  public constructor(
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
   * @access public
   * @async
   * @param   {StatisticsQuery}  query
   * @returns {Promise<number>}   The number of matching transactions.
   */
  public async count(query: StatisticsQuery): Promise<number> {
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
   * @access public
   * @async
   * @param   {StatisticsQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  public async exists(query: StatisticsQuery): Promise<boolean> {
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
   * @access public
   * @async
   * @param   {StatisticsQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<StatisticsDocument>>}
   */
  public async find(
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
  public async findOne(query: StatisticsQuery): Promise<StatisticsDocument> {
    return await this.queryService.findOne(query, this.model);
  }

  /**
   * Method to query `statistics` documents based on the `query`and return
   * the results in a paginated set. Note that this method *fills* the set
   * with the most recent leaderboards entries given no entries match the
   * provided statistics query.
   *
   * @access public
   * @async
   * @param   {StatisticsQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<StatisticsDocument>>}
   */
  public async findOrFill(
    query: StatisticsQuery,
  ): Promise<PaginatedResultDTO<StatisticsDocument>> {
    // first query using the parameter
    const paginatedResult = await this.queryService.find(query, this.model);

    // given results, done here
    if (paginatedResult.data && paginatedResult.data.length) {
      return paginatedResult;
    }

    // query most recent leaderboard entries
    return await this.queryService.find(
      new StatisticsQuery(
        {
          type: "leaderboard",
        } as StatisticsDocument,
        {
          pageSize: 3,
          pageNumber: 1,
          sort: "position",
          order: "asc",
        },
      ),
      this.model,
    );
  }

  /**
   * This method *creates* or *updates* a document in the
   * `statistics` collection.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {StatisticsQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {StatisticsDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<StatisticsDocument>}  The *updated* `transactions` document.
   */
  public async createOrUpdate(
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
   * @access public
   * @async
   * @param   {StatisticsModel[]} documents
   * @returns {Promise<number>}
   */
  public async updateBatch(documents: StatisticsModel[]): Promise<number> {
    return await this.queryService.updateBatch(this.model, documents);
  }
}
