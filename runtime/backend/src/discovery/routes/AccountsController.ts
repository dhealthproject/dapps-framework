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
import { Account, AccountQuery } from "../models/AccountSchema";
import { AccountDTO } from "../models/AccountDTO";
import { AccountsService } from "../services/AccountsService";

/**
 * @class AccountsController
 * @description The controller of the module. Handles requests
 * from the specified entry points and passes on to the module service.
 *
 * @since v0.1.0
 */
@ApiTags("Accounts Information")
@Controller("accounts")
export class AccountsController {
  /**
   * The constructor of the controller.
   *
   * @constructor
   * @param {AccountsService} accountsService
   */
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Handler of the `/accounts` endpoint.
   * Returns all accounts that match request's query.
   * If request's query is null or not specified, returns all accounts.
   * Result is paginated.
   *
   * @async
   * @method  GET
   * @param   {AccountQueryDTO} query
   * @returns {Promise<PaginatedResultDTO<Account>>}
   */
  @Get()
  @ApiOperation({
    summary: "Search accounts",
    description: "Get an array of accounts.",
  })
  @ApiExtraModels(Account, PaginatedResultDTO)
  @ApiOkResponse({
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
  })
  find(@Query() query: AccountQuery): Promise<PaginatedResultDTO<AccountDTO>> {
    return this.accountsService.find(query).then((result) => ({
      data:
        result.data.length > 0
          ? result.data.map((d) => d.toDTO() as AccountDTO)
          : [],
      pagination: result.pagination,
    }));
  }
}
