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
  Body,
  Controller,
  Ip,
  Get,
  Post,
  Request as NestRequest,
  Res as NestResponse,
  UseGuards,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Request, Response } from "express";

// internal dependencies
import { AccountDTO } from "../../common/models/AccountDTO";
import { AuthService } from "../services/AuthService";
import { AuthGuard } from "../traits/AuthGuard";
import { AccessTokenDTO } from "../models/AccessTokenDTO";
import { AccessTokenRequest } from "../requests/AccessTokenRequest";
import { Account } from "../models/AccountSchema";
import { AuthChallengeDTO } from "../models/AuthChallengeDTO";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/auth/challenge`
  export const AuthChallengeResponseSchema = {
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(AuthChallengeDTO) },
            },
          },
        },
      ],
    },
  };

  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/auth/token`
  export const AuthTokenResponseSchema = {
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(AccessTokenDTO) },
            },
          },
        },
      ],
    },
  };

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
              items: { $ref: getSchemaPath(AccountDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label COMMON
 * @class AuthController
 * @description The auth controller of the app. Handles requests
 * about *authentication*, *access tokens* and basic profile
 * information requests.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/auth/challenge` | **`GET`** | {@link AuthController.getAuthCode} | Responds with an *authentication challenge* that **MUST** be attached on-chain for a successful authentication. |
 * | `/auth/token` | **`POST`** | {@link AuthController.getAccessToken} | Accepts a `authCode` in the request body and validates it using {@link AuthService:COMMON} |
 * | `/me` | **`GET`** | {@link AuthController.getProfile} | Uses the {@link AuthGuard:COMMON} to validate the required **access token** (Bearer authorization header) and displays the authenticated user information for valid (authenticated) requests. |
 * <br /><br />
 * 
 * @todo Add `refreshToken` logic in method {@link AuthController.getAccessToken}.
 * @todo Add request parameters documentation, see {@link AccountsController}.
 * @todo Add response documentation, see {@link AccountsController}.
 * @since v0.2.0
 */
@ApiTags("Authentication")
@Controller()
export class AuthController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {ConfigService} configService
   * @param {AppService} appService
   */
  public constructor(
    private readonly authService: AuthService,
  ) {}

  /**
   * This method generates an *authentication cookie* depending
   * on the runtime configuration (dApp), i.e. the cookie will
   * include a [sub-]*domain name* and a name that are used to
   * *secure the cookie content*.
   * <br /><br />
   * A **cookie** is attached to the response which is signed
   * using the **authentication secret** from the runtime and
   * which is restricted to the dApp's domain name. Also, the
   * cookie is a **HTTP-only** cookie to prevent *cross-site
   * scripting* exploits.
   * Note that reading the cookie using *frontends* requires
   * an additional parameter, often named `withCredentials`
   * that will permit to decipher the secure cookie.
   * <br /><br />
   * The `passthrough` flag in `NestResponse()` operator permits
   * to instruct *nest* to pass on the response cookie onto the
   * express `Response` object.
   *
   * @param req 
   * @returns 
   */
  @Get("auth/challenge")
  @ApiOperation({
    summary: "Get an authentication challenge",
    description: "Request an authentication challenge. This challenge must be included in a transaction on dHealth Network for the authentication process to succeed.",
  })
  @ApiExtraModels(AuthChallengeDTO)
  @ApiOkResponse(HTTPResponses.AuthChallengeResponseSchema)
  protected async getAuthCode(
    @NestRequest() request: Request,
    @NestResponse({ passthrough: true }) response: Response,
  ): Promise<AuthChallengeDTO> {
    // generates cookie configuration (depends on dApp)
    const authCookie = this.authService.getCookie();

    // generates a *random* authentication challenge
    const authChallenge = this.authService.getChallenge();

    // set authentication challenge as the value of the
    // cookie. This will be replaced by the accessToken
    // and refreshToken when authentication is successful.
    response.cookie(authCookie.name, authChallenge, {
      httpOnly: true,
      domain: authCookie.domain,
      signed: true,
    });

    // serves the authentication challenge
    return { challenge: authChallenge } as AuthChallengeDTO;
  }

  /**
   * Creates a JSON Web Token for the `address` that is
   * specified in the request body. Note that a token will
   * only be returned if an `authCode` is present in the
   * request body and if this authentication code was used
   * in an encrypted transfer transaction on dHealth Network.
   *
   * @method POST
   * @param req 
   * @param ip 
   * @param body 
   * @returns Promise<AuthenticationToken>
   */
  @Post('auth/token')
  @ApiOperation({
    summary: "Get an authenticated user's access tokens",
    description: "Request an authenticated user's access token and refresh token. The access token is short-lived (1 hour) and the refresh token can be used to get a new access token after it expired.",
  })
  @ApiExtraModels(AccessTokenDTO)
  @ApiOkResponse(HTTPResponses.AuthTokenResponseSchema)
  protected async getAccessToken(
    @NestRequest() req: Request,
    @Ip() ip: string,
    @Body() body: AccessTokenRequest
  ): Promise<AccessTokenDTO> {
    try {
      const user: Account = await this.authService.validate(
        body.challenge,
      );

      if (null !== user) {
        return this.authService.getAccessToken(user);
      }
    }
    catch (e: any) {
      // Caution: this is dangerous (just a first draft ;())
      throw e;
    }
  }

  /**
   * Requests a user's profile information. This endpoint is
   * protected and a valid access token must be attached in
   * the `Authorization` request header.
   *
   * @see AuthGuard
   * @method GET
   * @param req 
   * @returns 
   */
  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({
    summary: "Get an authenticated user's profile details",
    description: "Request an authenticated user's profile details. This request will only succeed given a valid access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(AccountDTO)
  @ApiOkResponse(HTTPResponses.MeResponseSchema)
  protected getProfile(@NestRequest() req: Request) {
    return req.user;
  }
}
