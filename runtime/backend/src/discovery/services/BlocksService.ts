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
import { QueryService } from "../../common/services/QueryService";
import { Queryable } from "../../common/concerns/Queryable";
import {
  Block,
  BlockDocument,
  BlockModel,
  BlockQuery,
} from "../models/BlockSchema";

/**
 * @class BlocksService
 * @description The main service of the Blocks module.
 *
 * @since v0.3.2
 */
@Injectable()
export class BlocksService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {BlockModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Block.name) private readonly model: BlockModel,
    private readonly queriesService: QueryService<BlockDocument, BlockModel>,
  ) {}

  /**
   * Method to query the *existence* of a document in the
   * `blocks` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {BlockQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}    Whether a document exists which validates the passed query.
   */
  async exists(query: BlockQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: BlockDocument = await this.queriesService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to update a batch of blocks.
   *
   * @async
   * @param   {BlockModel[]} blockDocuments
   * @returns {Promise<number>}
   */
  public async createOrUpdateBatch(
    blockDocuments: BlockModel[],
  ): Promise<number> {
    return await this.queriesService.updateBatch(this.model, blockDocuments);
  }
}
