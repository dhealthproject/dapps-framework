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
  Get,
  Controller,
  Param,
  Query,
  Res as NestResponse,
  Req as NestRequest,
  HttpException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiMovedPermanentlyResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Request, Response } from "express";

// internal dependencies
import { AuthGuard } from "../traits/AuthGuard";
import { AuthService } from "../services/AuthService";
import { OAuthService } from "../services/OAuthService";
import { AccountDocument } from "../models/AccountSchema";
import { StatusDTO } from "../models/StatusDTO";

// requests
import { OAuthAuthorizeRequest } from "../requests/OAuthAuthorizeRequest";
import { OAuthCallbackRequest } from "../requests/OAuthCallbackRequest";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/auth/token`
  export const OAuthLinkResponseSchema = {
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(StatusDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @class OAuthController
 * @description The OAuth controller of the app. Handles requests
 * about *third-party authentication* using the **OAuth** standard.
 * <br /><br />
 * These request handlers can be used to *link* OAuth-compatible
 * third-party (remote) accounts such as a user's Strava or Apple
 * Health account.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/oauth/:provider/authorize` | **`GET`** | {@link OAuthController.authorize} | Uses the {@link AuthGuard:COMMON} to validate the required **access token** (Server cookie or Bearer authorization header). Redirects the user to the third-party provider OAuth Authorization URL for valid requests. |
 * | `/oauth/:provider/callback` | **`GET`** | {@link OAuthController.callback} | Uses the {@link AuthGuard:COMMON} to validate the required **access token** (Server cookie or Bearer authorization header). Requests an *access token* and *refresh token* from the third-party provider and finalizes the authorization process. |
 *
 * @since v0.3.0
 */
@ApiTags("OAuth")
@Controller("oauth")
export class OAuthController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {OAuthService} oauthService
   */
  public constructor(
    private readonly oauthService: OAuthService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Returns redirect to provider authentication page.
   * This endpoint is used to prompt user info
   * in selected provider.
   *
   * @method GET
   * @param response
   * @param provider
   * @param query
   *
   * @returns
   */
  @UseGuards(AuthGuard)
  @Get(":provider/authorize")
  @ApiOperation({
    summary: "Provider OAuth Authorization (Step 1)",
    description:
      "Request an authorization from a registered OAuth provider by redirecting the user to the provider authorization page.",
  })
  @ApiExtraModels(OAuthAuthorizeRequest, StatusDTO)
  @ApiMovedPermanentlyResponse()
  protected async authorize(
    @NestRequest() req: Request,
    @NestResponse() response: Response,
    @Param("provider") provider: string,
    @Query() query: OAuthAuthorizeRequest,
  ) {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    // read query parameters, `ref` is optional
    // @todo OAuthAuthorizeRequest
    const { ref, dhealthAddress } = query;

    // verify dHealthAddress, must be same for authenticated account
    if (dhealthAddress !== account.address) {
      throw new HttpException(`Forbidden`, 403);
    }

    // build a *remote* authorization URL ("Strava OAuth URL")
    const authorize_url = this.oauthService.getAuthorizeURL(
      provider,
      dhealthAddress,
      ref,
    );

    // stores a copy of the created OAuth authorization
    await this.oauthService.updateIntegration(
      provider,
      account,
      // the following will be hashed
      { authorizeUrl: authorize_url },
    );

    // redirect the browser to the remote authorization URL
    return response.status(301).redirect(authorize_url);
  }

  /**
   *
   * @param req
   * @param provider
   * @param query
   * @returns
   */
  @UseGuards(AuthGuard)
  @Get(":provider/callback")
  @ApiOperation({
    summary: "Provider OAuth Callback (Step 2)",
    description:
      "Request a remote access token and refresh token from an authorized OAuth provider and return a status response.",
  })
  @ApiExtraModels(OAuthCallbackRequest, StatusDTO)
  @ApiOkResponse(HTTPResponses.OAuthLinkResponseSchema)
  protected async callback(
    @NestRequest() req: Request,
    @Param("provider") provider: string,
    @Query() query: OAuthCallbackRequest,
  ) {
    // read and decode access token, then find account in database
    const account: AccountDocument = await this.authService.getAccount(req);

    try {
      // requests an access token from the OAuth provider
      await this.oauthService.oauthCallback(provider, account, query);

      // create a "success" status response
      return StatusDTO.create(200);
    } catch (e) {
      // @todo Add error handling for HTTP exceptions
      throw e;
    }
  }
}
