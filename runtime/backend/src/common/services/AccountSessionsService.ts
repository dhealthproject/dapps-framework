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
import { PaginatedResultDTO } from "../models/PaginatedResultDTO";
import { QueryService } from "../services/QueryService";
import {
  AccountSession,
  AccountSessionDocument,
  AccountSessionModel,
  AccountSessionQuery,
} from "../models/AccountSessionSchema";

/**
 * @class AccountsService
 * @description The main service to handle documents in the
 * `accounts` collection.
 *
 * @since v0.1.0
 */
@Injectable()
export class AccountSessionsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {AccountSessionModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(AccountSession.name)
    private readonly model: AccountSessionModel,
    private readonly queriesService: QueryService<
      AccountSessionDocument,
      AccountSessionModel
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
   * @param   {AccountSessionQuery}  query
   * @returns {Promise<number>}   The number of matching accounts.
   */
  async count(query: AccountSessionQuery): Promise<number> {
    return await this.queriesService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `account-sessions` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {AccountSessionQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  public async exists(query: AccountSessionQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: AccountSessionDocument = await this.queriesService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query account sessions based on query and returns as paginated result.
   *
   * @async
   * @param   {AccountSessionQuery} query
   * @returns {Promise<PaginatedResultDTO<AccountDocument>>}
   */
  public async find(
    query: AccountSessionQuery,
  ): Promise<PaginatedResultDTO<AccountSessionDocument>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * Find one `AccountSessionDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {AccountSessionQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<AccountSessionDocument>}  The resulting `accounts` document.
   */
  public async findOne(
    query: AccountSessionQuery,
  ): Promise<AccountSessionDocument> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method updates *exactly one document* in a collection.
   * <br /><br />
   *
   * @async
   * @param   {AccountSessionQuery}           query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {AccountSessionModel}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}           ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<AccountSessionDocument>}  The *updated* `accounts` document.
   */
  public async createOrUpdate(
    query: AccountSessionQuery,
    data: AccountSessionModel,
    ops: Record<string, any> = {},
  ): Promise<AccountSessionDocument> {
    return await this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
      ops,
    );
  }

  /**
   * Method to update a batch of account sessions.
   *
   * @async
   * @param   {AccountSessionModel[]} accountDocuments
   * @returns {Promise<number>}
   */
  public async updateBatch(
    accountSessionDocuments: AccountSessionModel[],
  ): Promise<number> {
    return await this.queriesService.updateBatch(
      this.model,
      accountSessionDocuments,
    );
  }
}
