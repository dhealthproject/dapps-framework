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
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";

// internal dependencies
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import {
  Asset,
  AssetDocument,
  AssetModel,
  AssetQuery,
} from "../models/AssetSchema";
import { AssetParameters } from "../../common/models/AssetsConfig";
import { QueryService } from "../../common/services/QueryService";

/**
 * @class AssetsService
 * @description The main service of the Accounts module.
 *
 * @since v0.3.0
 */
@Injectable()
export class AssetsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {AssetModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Asset.name) private readonly model: AssetModel,
    private readonly configService: ConfigService,
    private readonly queriesService: QueryService<AssetDocument, AssetModel>,
  ) {}

  /**
   * This method executes a *count* query using the {@link model}
   * argument.
   * <br /><br />
   * Caution: Count queries require a considerable amount of RAM
   * to execute. It is preferred to use pro-active statistics with
   * collections that contain one document with a counter.
   *
   * @param   {AssetQuery}  query
   * @returns {Promise<number>}   The number of matching transactions.
   */
  async count(query: AssetQuery): Promise<number> {
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
   * @param   {AssetQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: AssetQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: AssetDocument = await this.queriesService.findOne(
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
   * @param   {AssetQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<AssetDocument>>}
   */
  async find(query: AssetQuery): Promise<PaginatedResultDTO<AssetDocument>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * Find one `Transactions` document in the database and use
   * a query based on the {@link AssetQuery} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {AssetQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<AssetDocument>}  The resulting `transactions` document.
   */
  async findOne(query: AssetQuery): Promise<AssetDocument> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method *creates* or *updates* a document in the
   * `transactions` collection.
   * <br /><br />
   *
   * @async
   * @param   {AssetQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {AssetDocument}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<AssetDocument>}  The *updated* `transactions` document.
   */
  async createOrUpdate(
    query: AssetQuery,
    data: AssetModel,
    ops: Record<string, any> = {},
  ): Promise<AssetDocument> {
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
   * @param   {AssetModel[]} documents
   * @returns {Promise<number>}
   */
  async updateBatch(documents: AssetModel[]): Promise<number> {
    return await this.queriesService.updateBatch(this.model, documents);
  }

  /**
   * This method reads a discoverable asset configuration
   * from the runtime configuration file `config/assets.ts`
   * and returns a {@link AssetParameters} object.
   *
   * @access public
   * @param   {string}    assetType   Contains the type of asset, one of: "base" or "earn".
   * @returns {AssetParameters}
   */
  public getAssetParameters(assetType: string): AssetParameters {
    // reads discoverable asset from configuration
    const asset = this.configService.get<AssetParameters>(
      `assets.${assetType}`,
    );

    // throw an error if the asset is unknown
    if (undefined === asset) {
      throw new Error(`Invalid discoverable asset "${assetType}".`);
    }

    // :AssetParameters
    return asset;
  }
}