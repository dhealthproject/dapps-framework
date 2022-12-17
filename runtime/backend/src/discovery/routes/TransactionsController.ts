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
import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";

// internal dependencies
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import {
  Transaction,
  TransactionDocument,
  TransactionQuery,
} from "../../common/models/TransactionSchema";
import { TransactionDTO } from "../models/TransactionDTO";
import { TransactionsService } from "../services/TransactionsService";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/transactions`
  export const TransactionSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(TransactionDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label DISCOVERY
 * @class TransactionsController
 * @description The transactions controller of the app. Handles requests
 * about *transactions* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/transactions` | **`GET`** | {@link find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link TransactionDTO} objects. |
 * <br /><br />
 *
 * @since v0.3.0
 */
@ApiTags("Transactions")
@Controller("transactions")
export class TransactionsController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {TransactionsService} transactionsService
   */
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Handler of the `/transactions` endpoint. Returns all transactions
   * that match the request query. If the query is null or not specified,
   * returns all documents.
   * <br /><br />
   * The result of this endpoint can be paginated using query
   * parameters: `pageSize`, `pageNumber`. Also, it can be sorted
   * with query parameters: `sort`, `order`.
   *
   * @async
   * @access public
   * @method  GET
   * @param   {TransactionQuery} query
   * @returns {Promise<PaginatedResultDTO<TransactionDTO>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search transactions",
    description:
      "Search for transactions using custom filters. The resulting iterable contains only matching transactions.",
  })
  @ApiExtraModels(TransactionDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.TransactionSearchResponseSchema)
  public async find(
    @Query() query: TransactionQuery,
  ): Promise<PaginatedResultDTO<TransactionDTO>> {
    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // reads from database
    const data = await this.transactionsService.find(
      new TransactionQuery(
        {
          ...rest,
        } as TransactionDocument,
        { pageNumber, pageSize, sort, order },
      ),
    );

    // wraps for transport
    return PaginatedResultDTO.create<TransactionDTO>(
      data.data.map((d: TransactionDocument) =>
        Transaction.fillDTO(d, new TransactionDTO()),
      ),
      data.pagination,
    );
  }
}
