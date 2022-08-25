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
  AuthChallenge,
  AuthChallengeDocument,
  AuthChallengeModel,
  AuthChallengeQuery,
} from "../models/AuthChallengeSchema";

/**
 * @class ChallengesService
 * @description The main service to handle documents in the
 * `authChallenges` collection.
 *
 * @since v0.3.0
 */
@Injectable()
export class ChallengesService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {AuthChallengeModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(AuthChallenge.name)
    private readonly model: AuthChallengeModel,
    private readonly queriesService: QueryService<
      AuthChallengeDocument,
      AuthChallengeModel
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
   * @param   {AuthChallengeQuery}  query
   * @returns {Promise<number>}   The number of matching challenges.
   */
  async count(query: AuthChallengeQuery): Promise<number> {
    return await this.queriesService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `authChallenges` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {AuthChallengeQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  public async exists(query: AuthChallengeQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: AuthChallengeDocument = await this.queriesService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query challenges based on query and returns
   * as paginated result.
   *
   * @async
   * @param   {AuthChallengeQuery} query
   * @returns {Promise<PaginatedResultDTO<AuthChallengeDocument>>}
   */
  public async find(
    query: AuthChallengeQuery,
  ): Promise<PaginatedResultDTO<AuthChallengeDocument>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * Find one `AuthChallengeDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {AuthChallengeQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<AuthChallengeDocument>}  The resulting `authChallenges` document.
   */
  public async findOne(
    query: AuthChallengeQuery,
  ): Promise<AuthChallengeDocument> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method updates *exactly one document* in a collection
   * and uses an *upsert* operation if it doesn't exist yet.
   * <br /><br />
   *
   * @async
   * @param   {AuthChallengeQuery}    query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {AuthChallengeModel}    data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<AuthChallengeDocument>}  The *updated* `authChallenges` document.
   */
  public async createOrUpdate(
    query: AuthChallengeQuery,
    data: AuthChallengeModel,
    ops: Record<string, any> = {},
  ): Promise<AuthChallengeDocument> {
    return await this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
      ops,
    );
  }

  /**
   * Method to update a batch of challenges.
   *
   * @async
   * @param   {AuthChallengeModel[]} AuthChallengeDocuments
   * @returns {Promise<number>}
   */
  public async updateBatch(
    AuthChallengeDocuments: AuthChallengeModel[],
  ): Promise<number> {
    return await this.queriesService.updateBatch(
      this.model,
      AuthChallengeDocuments,
    );
  }

  /**
   * Static API
   */
  /**
   * This method generates a random authentication challenge.
   * <br /><br />
   * The size of the generated authentication challenges can be changed
   * in the configuration file `config/security.ts`.
   * <br /><br />
   * Note that by modifying the default *challenge size*, you may
   * affect the operations processor and thereby the data that is
   * returned by the backend.
   *
   * @param   {number}    challengeSize   (Optional) The size of the generated authentication challenge, defaults to `8`.
   * @returns {string}   An authentication challenge that can be attached on-chain.
   */
  public static generateChallenge(challengeSize = 8): string {
    // generates random number using greatest radix (36)
    // which serves numbers's representation in ASCII
    const size: number = challengeSize;
    return Math.random().toString(36).slice(-size);
  }
}
