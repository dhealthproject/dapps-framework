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
import { PayoutsService } from "../services/PayoutsService";
import { PayoutDTO } from "../models/PayoutDTO";
import { Payout, PayoutDocument, PayoutQuery } from "../models/PayoutSchema";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/payouts`
  export const PayoutSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(PayoutDTO) },
            },
          },
        },
      ],
    },
  };

  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/payouts/:address`
  export const UserPayoutSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(PayoutDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label PAYOUT
 * @class PayoutsController
 * @description The payouts controller of the app. Handles requests
 * about *payouts* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/payouts` | **`GET`** | {@link PayoutsController.find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link PayoutDTO} objects. |
 * | `/payouts/:address` | **`GET`** | {@link PayoutsController.findByUser} | Uses the {@link AuthGuard:COMMON} to validate the required **access token** (Server cookie or Bearer authorization header). Responds with a pageable {@link PaginatedResultDTO} that contains {@link PayoutDTO} objects. |
 * <br /><br />
 *
 * @since v0.3.2
 */
@ApiTags("Activities")
@Controller("activities")
export class PayoutsController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {AuthService} authService
   * @param {PayoutsService} payoutsService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly payoutsService: PayoutsService,
  ) {}

  /**
   * Handler of the `/payouts` endpoint. Returns all payouts that match
   * the request query. If the query is null or not specified, returns
   * all documents in DTO format using {@link PayoutDTO}.
   * <br /><br />
   * The result of this endpoint can be paginated using query
   * parameters: `pageSize`, `pageNumber`. Also, it can be sorted
   * with query parameters: `sort`, `order`.
   *
   * @method  GET
   * @access protected
   * @async
   * @param   {PayoutQuery} query
   * @returns {Promise<PaginatedResultDTO<PayoutDTO>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search payouts",
    description:
      "Search for payouts using custom filters. The resulting iterable contains only matching payouts.",
  })
  @ApiExtraModels(PayoutDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.PayoutSearchResponseSchema)
  protected async find(
    @Query() query: PayoutQuery,
  ): Promise<PaginatedResultDTO<PayoutDTO>> {
    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // reads from database
    const data = await this.payoutsService.find(
      new PayoutQuery(
        {
          ...rest,
        } as PayoutDocument,
        { pageNumber, pageSize, sort, order },
      ),
    );

    // wraps for transport
    return new PaginatedResultDTO<PayoutDTO>(
      data.data.map((d: PayoutDocument) => Payout.fillDTO(d, new PayoutDTO())),
      data.pagination,
    );
  }

  /**
   * Requests a user's `payouts` entries. This endpoint is protected and a
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
   * @returns {Promise<PaginatedResultDTO<PayoutDTO>>}       An authenticated user's received payouts.
   */
  @UseGuards(AuthGuard)
  @Get(":address")
  @ApiOperation({
    summary: "Get an authenticated user's completed activities",
    description:
      "Request an authenticated user's completed activities. This request will only succeed given a valid and secure server cookie or an access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(PayoutDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.UserPayoutSearchResponseSchema)
  protected async findByUser(
    @NestRequest() req: Request,
    @Query() query: PayoutQuery,
  ): Promise<PaginatedResultDTO<PayoutDTO>> {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // make sure to *never* allow querying assets of someone else
    // than the currently logged in user (using `AuthGuard`)
    const safeQuery: PayoutQuery = new PayoutQuery(
      {
        ...rest,
        userAddress: account.address,
      } as PayoutDocument,
      { pageNumber, pageSize, sort, order },
    );

    // reads assets from database
    const data = await this.payoutsService.find(safeQuery);

    // wraps for transport using PayoutDTO
    return new PaginatedResultDTO<PayoutDTO>(
      data.data.map((d: PayoutDocument) => Payout.fillDTO(d, new PayoutDTO())),
      data.pagination,
    );
  }
}
