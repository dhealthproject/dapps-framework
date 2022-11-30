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
  Request as NestRequest,
  UseGuards,
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
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import { AccountDocument } from "../../common/models/AccountSchema";
import { AuthService } from "../../common/services/AuthService";
import { AuthGuard } from "../../common/traits/AuthGuard";
import { ActivitiesService } from "../services/ActivitiesService";
import { ActivityDTO } from "../models/ActivityDTO";
import {
  Activity,
  ActivityDocument,
  ActivityQuery,
} from "../models/ActivitySchema";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/activities`
  export const ActivitySearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(ActivityDTO) },
            },
          },
        },
      ],
    },
  };

  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/activities/:address`
  export const UserActivitySearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(ActivityDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label USERS
 * @class ActivitiesController
 * @description The activities controller of the app. Handles requests
 * about *activities* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/activities` | **`GET`** | {@link ActivitiesController.find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link ActivityDTO} objects. |
 * | `/activities/:address` | **`GET`** | {@link ActivitiesController.findByUser} | Uses the {@link AuthGuard:COMMON} to validate the required **access token** (Server cookie or Bearer authorization header). Responds with a pageable {@link PaginatedResultDTO} that contains {@link ActivityDTO} objects. |
 * <br /><br />
 *
 * @since v0.3.2
 */
@ApiTags("Activities")
@Controller("activities")
export class ActivitiesController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {AuthService} authService
   * @param {ActivitiesService} activitiesService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  /**
   * Handler of the `/activities` endpoint. Returns all activities that match
   * the request query. If the query is null or not specified, returns
   * all documents in DTO format using {@link ActivityDTO}.
   * <br /><br />
   * The result of this endpoint can be paginated using query
   * parameters: `pageSize`, `pageNumber`. Also, it can be sorted
   * with query parameters: `sort`, `order`.
   *
   * @method  GET
   * @access protected
   * @async
   * @param   {ActivityQuery} query
   * @returns {Promise<PaginatedResultDTO<ActivityDTO>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search activities",
    description:
      "Search for activities using custom filters. The resulting iterable contains only matching activities.",
  })
  @ApiExtraModels(ActivityDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.ActivitySearchResponseSchema)
  protected async find(
    @Query() query: ActivityQuery,
  ): Promise<PaginatedResultDTO<ActivityDTO>> {
    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // reads from database
    const data = await this.activitiesService.find(
      new ActivityQuery(
        {
          ...rest,
        } as ActivityDocument,
        { pageNumber, pageSize, sort, order },
      ),
    );

    // wraps for transport
    return new PaginatedResultDTO<ActivityDTO>(
      data.data.map((d: ActivityDocument) =>
        Activity.fillDTO(d, new ActivityDTO()),
      ),
      data.pagination,
    );
  }

  /**
   * Requests a user's `activities` entries. This endpoint is protected and a
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
   * @returns {Promise<PaginatedResultDTO<ActivityDTO>>}       An authenticated user's completed activities.
   */
  @UseGuards(AuthGuard)
  @Get(":address")
  @ApiOperation({
    summary: "Get an authenticated user's completed activities",
    description:
      "Request an authenticated user's completed activities. This request will only succeed given a valid and secure server cookie or an access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(ActivityDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.UserActivitySearchResponseSchema)
  protected async findByUser(
    @NestRequest() req: Request,
    @Query() query: ActivityQuery,
  ): Promise<PaginatedResultDTO<ActivityDTO>> {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // make sure to *never* allow querying assets of someone else
    // than the currently logged in user (using `AuthGuard`)
    const safeQuery: ActivityQuery = new ActivityQuery(
      {
        ...rest,
        address: account.address,
      } as ActivityDocument,
      { pageNumber, pageSize, sort, order },
    );

    // reads assets from database
    const data = await this.activitiesService.find(safeQuery);

    // wraps for transport using ActivityDTO
    return new PaginatedResultDTO<ActivityDTO>(
      data.data.map((d: ActivityDocument) =>
        Activity.fillDTO(d, new ActivityDTO()),
      ),
      data.pagination,
    );
  }
}
