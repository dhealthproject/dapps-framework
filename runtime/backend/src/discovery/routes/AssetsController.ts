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
import { Account, AccountDocument } from "../../common/models/AccountSchema";
import { AuthService } from "../../common/services/AuthService";
import { AuthGuard } from "../../common/traits/AuthGuard";
import { Asset, AssetDocument, AssetQuery } from "../models/AssetSchema";
import { AssetDTO } from "../models/AssetDTO";
import { AssetsService } from "../services/AssetsService";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/assets`
  export const AssetSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(AssetDTO) },
            },
          },
        },
      ],
    },
  };

  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/assets/:address`
  export const UserAssetSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(AssetDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label DISCOVERY
 * @class AssetsController
 * @description The assets controller of the app. Handles requests
 * about *assets* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/assets` | **`GET`** | {@link AssetsController.find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link AssetDTO} objects. |
 * | `/assets/:address` | **`GET`** | {@link AssetsController.findByUser} | Uses the {@link AuthGuard:COMMON} to validate the required **access token** (Server cookie or Bearer authorization header). Responds with a pageable {@link PaginatedResultDTO} that contains {@link AssetDTO} objects. |
 * <br /><br />
 *
 * @since v0.3.0
 */
@ApiTags("Assets")
@Controller("assets")
export class AssetsController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {AuthService} authService
   * @param {AssetsService} assetsService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly assetsService: AssetsService,
  ) {}

  /**
   * Handler of the `/assets` endpoint. Returns all assets  that match
   * the request query. If the query is null or not specified, returns
   * all documents in DTO format using {@link AssetDTO}.
   * <br /><br />
   * The result of this endpoint can be paginated using query
   * parameters: `pageSize`, `pageNumber`. Also, it can be sorted
   * with query parameters: `sort`, `order`.
   *
   * @async
   * @access public
   * @method  GET
   * @param   {AssetQuery} query
   * @returns {Promise<PaginatedResultDTO<AssetDTO>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search assets",
    description:
      "Search for assets using custom filters. The resulting iterable contains only matching assets.",
  })
  @ApiExtraModels(AssetDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.AssetSearchResponseSchema)
  public async find(
    @Query() query: AssetQuery,
  ): Promise<PaginatedResultDTO<AssetDTO>> {
    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // reads from database
    const data = await this.assetsService.find(
      new AssetQuery(
        {
          ...rest,
        } as AssetDocument,
        { pageNumber, pageSize, sort, order },
      ),
    );

    // wraps for transport
    return new PaginatedResultDTO<AssetDTO>(
      data.data.map((d: AssetDocument) => Asset.fillDTO(d, new AssetDTO())),
      data.pagination,
    );
  }

  /**
   * Requests a user's profile information. This endpoint is
   * protected and a valid access token must be attached in
   * the `Authorization` request header, in signed cookies or
   * in browser cookies.
   * <br /><br />
   * The request is secured using the {@link AuthGuard} guard
   * which attaches a `payload` to the request object.
   *
   * @method GET
   * @access protected
   * @async
   * @param   {Request}  req            An `express` request used to extract the authenticated user payload.
   * @returns Promise<AccountDTO>       An authenticated user's profile information ("account" information).
   */
  @UseGuards(AuthGuard)
  @Get(":address")
  @ApiOperation({
    summary: "Get an authenticated user's owned assets",
    description:
      "Request an authenticated user's owned assets. This request will only succeed given a valid and secure server cookie or an access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(AssetDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.UserAssetSearchResponseSchema)
  protected async findByUser(
    @NestRequest() req: Request,
    @Query() query: AssetQuery,
  ): Promise<PaginatedResultDTO<AssetDTO>> {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // make sure to *never* allow querying assets of someone else
    // than the currently logged in user (using `AuthGuard`)
    const safeQuery: AssetQuery = new AssetQuery(
      {
        ...rest,
        userAddress: account.address,
      } as AssetDocument,
      { pageNumber, pageSize, sort, order },
    );

    // reads assets from database
    const data = await this.assetsService.find(safeQuery);

    // wraps for transport using AssetDTO
    return new PaginatedResultDTO<AssetDTO>(
      data.data.map((d: AssetDocument) => Asset.fillDTO(d, new AssetDTO())),
      data.pagination,
    );
  }
}
