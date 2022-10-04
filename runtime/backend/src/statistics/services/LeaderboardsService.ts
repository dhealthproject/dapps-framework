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
 * @class LeaderboardsService
 * @description The main service of the Leaderboards module.
 *
 * @since v0.2.0
 */
@Injectable()
export class LeaderboardsService {
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
   * Method to query `statistics` based on query and
   * return as paginated results.
   *
   * @async
   * @param   {StatisticsQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<PaginatedResultDTO<StatisticsDocument>>}
   */
  public async find(
    query: StatisticsQuery,
  ): Promise<PaginatedResultDTO<StatisticsDocument>> {
    return this.queryService.find(query, this.model);
  }
}
