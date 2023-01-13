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
  Operation,
  OperationDocument,
  OperationQuery,
} from "../models/OperationSchema";
import { OperationDTO } from "../models/OperationDTO";
import { OperationsService } from "../services/OperationsService";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/operations`
  export const OperationSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(OperationDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label PROCESSOR
 * @class OperationsController
 * @description The accounts controller of the app. Handles requests
 * about *accounts* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/operations` | **`GET`** | {@link find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link OperationDTO} objects. |
 * <br /><br />
 *
 * @since v0.1.0
 */
@ApiTags("Operations")
@Controller("operations")
export class OperationsController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {OperationsService} operationsService
   */
  constructor(private readonly operationsService: OperationsService) {}

  /**
   * Handler of the `/operations` endpoint. Returns all operations
   * that match the request query. If the query is null or not
   * specified, returns all documents.
   * <br /><br />
   * The result of this endpoint can be paginated using query
   * parameters: `pageSize`, `pageNumber`. Also, it can be sorted
   * with query parameters: `sort`, `order`.
   *
   * @async
   * @access public
   * @method  GET
   * @param   {OperationQuery} query
   * @returns {Promise<PaginatedResultDTO<OperationDTO>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search operations",
    description:
      "Search for operations using custom filters. The resulting iterable contains only matching operations.",
  })
  @ApiExtraModels(OperationDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.OperationSearchResponseSchema)
  public async find(
    @Query() query: OperationQuery,
  ): Promise<PaginatedResultDTO<OperationDTO>> {
    // destructure to create correct query
    // this permits to skip the `document[]`
    const { pageNumber, pageSize, sort, order, ...rest } = query;

    // reads from database
    const data = await this.operationsService.find(
      new OperationQuery(
        {
          ...rest,
        } as OperationDocument,
        { pageNumber, pageSize, sort, order },
      ),
    );

    // wraps for transport
    return PaginatedResultDTO.create<OperationDTO>(
      data.data.map((d: OperationDocument) =>
        Operation.fillDTO(d, new OperationDTO()),
      ),
      data.pagination,
    );
  }
}
