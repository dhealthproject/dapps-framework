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
  Account,
  AccountDocument,
  AccountQuery,
} from "../../common/models/AccountSchema";
import { AccountDTO } from "../../common/models/AccountDTO";
import { AccountsService } from "../../common/services/AccountsService";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/accounts`
  export const AccountSearchResponseSchema = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDTO) },
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(AccountDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label DISCOVERY
 * @class AccountsController
 * @description The accounts controller of the app. Handles requests
 * about *accounts* that are available in the database.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/accounts` | **`GET`** | {@link find} | Responds with a pageable {@link PaginatedResultDTO} that contains {@link AccountDTO} objects. |
 * <br /><br />
 *
 * @since v0.1.0
 */
@ApiTags("Accounts")
@Controller("accounts")
export class AccountsController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {AccountsService} accountsService
   */
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Handler of the `/accounts` endpoint. Returns all account
   * that match the request query. If the query is null or not
   * specified returns all documents.
   * <br /><br />
   * The result of this endpoint can be paginated using query
   * parameters: `pageSize`, `pageNumber`. Also, it can be sorted
   * with query parameters: `sort`, `order`.
   *
   * @async
   * @access public
   * @method  GET
   * @param   {AccountQuery} query
   * @returns {Promise<PaginatedResultDTO<AccountDTO>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search accounts",
    description:
      "Search for accounts using custom filters. The resulting iterable contains only matching accounts.",
  })
  @ApiExtraModels(AccountDTO, PaginatedResultDTO)
  @ApiOkResponse(HTTPResponses.AccountSearchResponseSchema)
  public async find(
    @Query() query: AccountQuery,
  ): Promise<PaginatedResultDTO<AccountDTO>> {
    // reads from database
    const data: PaginatedResultDTO<AccountDocument> =
      await this.accountsService.find(query);

    // wraps for transport
    return new PaginatedResultDTO<AccountDTO>(
      data.data.map((d: AccountDocument) =>
        Account.fillDTO(d, new AccountDTO()),
      ),
      data.pagination,
    );
  }
}
