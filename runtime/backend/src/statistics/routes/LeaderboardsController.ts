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
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request as NestRequest,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Request } from "express";

// internal dependencies
import { AccountDocument } from "../../common/models/AccountSchema";
import { AuthService } from "../../common/services/AuthService";
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import { AuthGuard } from "../../common/traits";
import { StatisticsDTO } from "../models/StatisticsDTO";
import {
  Statistics,
  StatisticsDocument,
  StatisticsQuery,
} from "../models/StatisticsSchema";
import { StatisticsService } from "../services/StatisticsService";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/statistics/leaderboard`
  export const StatisticsSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(StatisticsDTO) },
            },
          },
        },
      ],
    },
  };

  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/statistics/leaderboard/:address`
  export const UserStatisticsSearchResponseSchema = {
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(StatisticsDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label STATISTICS
 * @class LeaderboardsController
 * @description The leaderboards controller of the app. Handles requests
 * about *leaderboards* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/statistics/leaderboards` | **`GET`** | {@link LeaderboardsController.find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link StatisticsDTO} objects. |
 * <br /><br />
 *
 * @since v0.3.2
 */
@ApiTags("Leaderboards Statistics")
@Controller("statistics/leaderboards")
export class LeaderboardsController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {AuthService} authService
   * @param {StatisticsService} statisticsService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly statisticsService: StatisticsService,
  ) {}

  /**
   * Handler of the `/statistics/leaderboard` endpoint. Returns all leaderboards that match
   * the request query. If the query is null or not specified, returns
   * all documents in DTO format using {@link StatisticsDTO}.
   * <br /><br />
   * The result of this endpoint can be paginated using query
   * parameters: `pageSize`, `pageNumber`. Also, it can be sorted
   * with query parameters: `sort`, `order`.
   *
   * @method  GET
   * @access protected
   * @async
   * @param   {StatisticsQuery} query
   * @returns {Promise<PaginatedResultDTO<StatisticsDTO>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search leaderboard statistics",
    description:
      "Search for statistics using custom filters. The resulting iterable contains only matching activities.",
  })
  @ApiExtraModels(StatisticsDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.StatisticsSearchResponseSchema)
  protected async find(
    @Query() query: StatisticsQuery,
  ): Promise<PaginatedResultDTO<StatisticsDTO>> {
    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // reads from database (or fills if empty)
    const data = await this.statisticsService.findOrFill(
      new StatisticsQuery(
        {
          ...rest,
          type: "leaderboard",
        } as StatisticsDocument,
        { pageNumber, pageSize, sort, order },
      ),
    );

    // wraps for transport
    return new PaginatedResultDTO<StatisticsDTO>(
      data.data.map((d: StatisticsDocument) => {
        return Statistics.fillDTO(d, new StatisticsDTO());
      }),
      data.pagination,
    );
  }

  /**
   * Requests a user's `leaderboard` entries. This endpoint is protected and a
   * valid access token must be attached in the `Authorization` request
   * header, in signed cookies or in browser cookies.
   * <br /><br />
   * The request is secured using the {@link AuthGuard} guard
   * which attaches a `payload` to the request object.
   *
   * @method GET
   * @access protected
   * @async
   * @param   {Request}  req            An `express` request used to extract the authenticated user payload.
   * @returns {Promise<PaginatedResultDTO<StatisticsDTO>>}       An authenticated user's owned assets.
   */
  @UseGuards(AuthGuard)
  @Get(":address")
  @ApiOperation({
    summary: "Get an authenticated user's owned leaderboard information",
    description:
      "Request an authenticated user's owned leaderboard entry. This request will only succeed given a valid and secure server cookie or an access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(StatisticsDTO)
  @ApiOkResponse(HTTPResponses.UserStatisticsSearchResponseSchema)
  protected async findByUser(
    @NestRequest() req: Request,
    @Query() query: StatisticsQuery,
  ): Promise<StatisticsDTO> {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // make sure to *never* allow querying leaderboards of someone else
    // than the currently logged in user (using `AuthGuard`)
    const safeQuery: StatisticsQuery = new StatisticsQuery(
      {
        ...rest,
        type: "leaderboard",
        address: account.address,
      } as StatisticsDocument,
      { pageNumber, pageSize, sort, order },
    );

    // reads leaderboard statistics from database
    const data = await this.statisticsService.find(safeQuery);

    if (data && data.data && data.data.length > 0) {
      return Statistics.fillDTO(data.data[0], new StatisticsDTO());
    }

    return Statistics.fillDTO(
      {
        address: account.address,
        type: "leaderboard",
        ...rest,
        position: 0,
        amount: 0,
      } as StatisticsDocument,
      new StatisticsDTO(),
    );
  }
}
