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
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import { AuthService } from "../../common/services/AuthService";
import { AuthGuard } from "../../common/traits/AuthGuard";
import { StatisticsService } from "../services/StatisticsService";
import { StatisticsDTO } from "../models/StatisticsDTO";
import {
  Statistics,
  StatisticsDocument,
  StatisticsQuery,
} from "../models/StatisticsSchema";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/statistics/user/:address`
  export const UserStatisticsSearchResponseSchema = {
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
}

/**
 * @label STATISTICS
 * @class UserController
 * @description The statistics controller of the app. Handles requests
 * about *users* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/statistics/users/:address` | **`GET`** | {@link UserController.find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link StatisticsDTO} objects. |
 * <br /><br />
 *
 * @since v0.5.0
 */
@ApiTags("Users Statistics")
@Controller("statistics/users")
export class UsersController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {StatisticsService} statisticsService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly statisticsService: StatisticsService,
  ) {}

  /**
   * Requests a user's `statistics[TYPE=user]` entries. This endpoint is
   * protected and a valid access token must be attached in the `Authorization`
   * request header, in signed cookies or in browser cookies.
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
    summary: "Get an authenticated user's statistics information",
    description:
      "Request an authenticated user's statistics entries. This request will only succeed given a valid and secure server cookie or an access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(StatisticsDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.UserStatisticsSearchResponseSchema)
  protected async findByUser(
    @NestRequest() req: Request,
    @Query() query: any,
  ): Promise<PaginatedResultDTO<StatisticsDTO>> {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // make sure to *never* allow querying statistics of someone else
    // than the currently logged in user (using `AuthGuard`)
    const safeQuery: StatisticsQuery = new StatisticsQuery(
      {
        ...rest,
        type: "user",
        address: account.address,
      } as StatisticsDocument,
      { pageNumber, pageSize, sort, order },
    );

    // reads leaderboard statistics from database
    const data = await this.statisticsService.find(safeQuery);

    // wraps for transport using StatisticsDTO
    return new PaginatedResultDTO<StatisticsDTO>(
      data.data.map((d: StatisticsDocument) =>
        Statistics.fillDTO(d, new StatisticsDTO()),
      ),
      data.pagination,
    );
  }
}
