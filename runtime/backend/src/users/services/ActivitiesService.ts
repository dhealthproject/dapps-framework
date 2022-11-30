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
  Activity,
  ActivityDocument,
  ActivityModel,
  ActivityQuery,
} from "../models/ActivitySchema";
import { QueryService } from "../../common/services/QueryService";

/**
 * @class ActivitiesService
 * @description The main service of the activities module.
 *
 * @since v0.3.0
 */
@Injectable()
export class ActivitiesService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {ActivityModel} model
   * @param {QueryService} queryService
   */
  constructor(
    @InjectModel(Activity.name) private readonly model: ActivityModel,
    private readonly queryService: QueryService<
      ActivityDocument,
      ActivityModel
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
   * @param   {ActivityQuery}  query
   * @returns {Promise<number>}   The number of matching transactions.
   */
  async count(query: ActivityQuery): Promise<number> {
    return await this.queryService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `activities` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {ActivityQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: ActivityQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: ActivityDocument = await this.queryService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query `activities` based on query and return as paginated
   * results.
   *
   * @async
   * @param   {ActivityQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<ActivityDocument>>}
   */
  async find(
    query: ActivityQuery,
  ): Promise<PaginatedResultDTO<ActivityDocument>> {
    return await this.queryService.find(query, this.model);
  }

  /**
   * Find one `activities` document in the database and use
   * a query based on the {@link ActivityQuery} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {ActivityQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<ActivityDocument>}  The resulting `transactions` document.
   */
  async findOne(query: ActivityQuery): Promise<ActivityDocument> {
    return await this.queryService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `activities` collection.
   * <br /><br />
   *
   * @async
   * @param   {ActivityQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {ActivityDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<ActivityDocument>}  The *updated* `transactions` document.
   */
  async createOrUpdate(
    query: ActivityQuery,
    data: ActivityModel,
    ops: Record<string, any> = {},
  ): Promise<ActivityDocument> {
    return await this.queryService.createOrUpdate(query, this.model, data, ops);
  }

  /**
   * This method *creates* or *updates* many documents in the
   * `activities` collection.
   *
   * @async
   * @param   {ActivityModel[]} documents
   * @returns {Promise<number>}
   */
  async updateBatch(documents: ActivityModel[]): Promise<number> {
    return await this.queryService.updateBatch(this.model, documents);
  }
}
