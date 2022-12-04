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
import { AuthService } from "./common/services/AuthService";
import { AuthGuard } from "./common/traits/AuthGuard";
import { AccountDTO } from "./common/models/AccountDTO";
import { Account, AccountDocument } from "./common/models/AccountSchema";
import { ProfileDTO } from "./common/models/ProfileDTO";

// configuration resources
import dappConfigLoader from "../config/dapp";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/me`
  export const MeResponseSchema = {
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(ProfileDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @class AppController
 * @description The main controller of the app. Handles requests
 * from the default entry endpoint and pass on to the app service.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/hello` | **`GET`** | {@link AppController.getHello} | Prints a greeting message with the currently running dApp name. |
 * | `/me` | **`GET`** | {@link AppController.getProfile} | Uses the {@link AuthGuard} to validate the required **access token** (Server cookie or Bearer authorization header). Responds with the authenticated user information for valid (authenticated) requests. |
 *
 * @since v0.1.0
 */
@ApiTags("Base")
@Controller()
export class AppController {
  /**
   * The currently configured dApp that this backend runtime
   * is serving for.
   *
   * @access protected
   * @var {string}
   */
  protected dappName: string;

  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {AuthService} authService
   */
  constructor(private readonly authService: AuthService) {
    // read from configuration fields
    this.dappName = dappConfigLoader().dappName;
  }

  /**
   * The handler of the app's default entry point.
   * It calls the service to return app information.
   *
   * @method GET
   * @returns {string}
   */
  @Get("hello")
  protected getHello(): string {
    return `Hello, world of ${this.dappName}!`;
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
  @Get("me")
  @ApiOperation({
    summary: "Get an authenticated user's profile details",
    description:
      "Request an authenticated user's profile details. This request will only succeed given a valid and secure server cookie or an access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(ProfileDTO)
  @ApiOkResponse(HTTPResponses.MeResponseSchema)
  protected async getProfile(@NestRequest() req: Request): Promise<ProfileDTO> {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    // wrap into a safe transferable DTO
    const accountDto: AccountDTO = Account.fillDTO(account, new ProfileDTO());

    // returns wrapped `ProfileDTO`
    return {
      ...accountDto,
    } as ProfileDTO;
  }
}
