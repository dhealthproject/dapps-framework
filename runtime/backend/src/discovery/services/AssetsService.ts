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
  Asset,
  AssetDocument,
  AssetModel,
  AssetQuery,
} from "../models/AssetSchema";
import {
  AssetParameters,
  AssetsConfig,
  DiscoverableAssetsMap,
} from "../../common/models/AssetsConfig";
import { QueryService } from "../../common/services/QueryService";

// configuration resources
import assetsConfigLoader from "../../../config/assets";

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
   * Static API
   */
  /**
   * This helper method serves as a *parser* for account
   * public keys and addresses.
   * <br /><br />
   * This *static* method can be used for any inputs that
   * require to *identify* a participant [account]. Accounts
   * can always be referred to by their public key as it can
   * be used to generate the resulting identifier (address).
   *
   * @access public
   * @static
   * @param     {string}  publicKeyOrAddress     Must contain one of an account public key or an account address.
   * @returns   {string}  A mosaic identifier corresponding to a given namespace identifier (if any).
   */
  public static formatMosaicId(mosaicOrNamespaceId: string): string {
    // read assets configuration
    const baseAsset = AssetsService.getAssetParameters("base");

    // required mosaics configuration
    // the following if-else conditions block permits to
    // always work with *mosaic id* instead of *namespace id*
    // BASE asset
    if (
      "namespaceId" in baseAsset &&
      mosaicOrNamespaceId === baseAsset.namespaceId
    ) {
      return (baseAsset as AssetParameters).mosaicId;
    }

    // optional EARN mosaic configuration
    try {
      // EARN asset
      const earnAsset = AssetsService.getAssetParameters("earn");
      if (
        "namespaceId" in earnAsset &&
        mosaicOrNamespaceId === earnAsset.namespaceId
      ) {
        return (earnAsset as AssetParameters).mosaicId;
      }
    } catch (error) {}

    // optional BOOSTERS mosaic configuration
    try {
      // REFERRAL asset
      const referralAssets = AssetsService.getAssetParameters("referral");
      for (const referralAssetId in referralAssets) {
        const referralAsset = (referralAssets as DiscoverableAssetsMap)[
          referralAssetId
        ];
        if (
          "namespaceId" in referralAsset &&
          mosaicOrNamespaceId === referralAsset.namespaceId
        ) {
          return referralAsset.mosaicId;
        }
      }
    } catch (error) {}

    try {
      // PROGRESS asset
      const progressAssets = AssetsService.getAssetParameters("progress");
      for (const progressAssetId in progressAssets) {
        const progressAsset = (progressAssets as DiscoverableAssetsMap)[
          progressAssetId
        ];
        if (
          "namespaceId" in progressAsset &&
          mosaicOrNamespaceId === progressAsset.namespaceId
        ) {
          return progressAsset.mosaicId;
        }
      }
    } catch (error) {}

    // by default, keeps the input value
    return mosaicOrNamespaceId;
  }

  /**
   * This method reads a discoverable asset configuration
   * from the runtime configuration file `config/assets.ts`
   * and returns a {@link AssetParameters} object.
   *
   * @access protected
   * @static
   * @param   {string}    assetType   Contains the type of asset, one of: "base" or "earn".
   * @returns {AssetParameters}
   * @throws  {Error}     Given unknown or invalid `assetType` parameter.
   */
  protected static getAssetParameters(
    assetType: string,
  ): AssetParameters | DiscoverableAssetsMap {
    // reads discoverable asset from configuration
    const assetsConfig = assetsConfigLoader() as AssetsConfig;
    const asset =
      assetsConfig.assets[assetType] ?? assetsConfig.boosters[assetType];

    // throw an error if the asset is unknown
    if (undefined === asset) {
      throw new Error(`Invalid discoverable asset "${assetType}".`);
    }

    // :AssetParameters
    return asset;
  }
}
