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
import {
  AuthenticationPayload,
  AuthService,
  RequestWithUser,
} from "../services/AuthService";
import { AuthGuard } from "../traits/AuthGuard";
import { RefreshGuard } from "../traits/RefreshGuard";
import { AccessTokenDTO } from "../models/AccessTokenDTO";
import { AccessTokenRequest } from "../requests/AccessTokenRequest";
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
  // maps to the HTTP response of `/auth/refresh`
  export const AuthRefreshResponseSchema = {
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
 * | `/auth/token` | **`POST`** | {@link AuthController.getAccessToken} | Accepts a `challenge` in the request body and validates it using {@link AuthService:COMMON} |
 * | `/auth/refresh` | **`GET`** | {@link AuthController.refreshTokens} | Uses the {@link RefreshGuard:COMMON} to validate the required **refresh token** (Bearer authorization header) and *creates* a new access token, extending a session's lifetime. |
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
  public constructor(private readonly authService: AuthService) {}

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
    description:
      "Request an authentication challenge. This challenge must be included in a transaction on dHealth Network for the authentication process to succeed.",
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
   * Creates a JSON Web Token given a valid `challenge` is
   * presented on dHealth Network in a transfer transaction.
   * <br /><br />
   * Note that a token will only be returned given that a
   * `challenge` is present in the request body and given
   * that this authentication challenge was attached as a
   * message in a [possibly encrypted] transfer transaction
   * on dHealth Network.
   * <br /><br />
   * The `passthrough` flag in `NestResponse()` operator permits
   * to instruct *nest* to pass on the response cookie onto the
   * express `Response` object.
   * <br /><br />
   * For details about the *options* passed to the `response.cookie`
   * call, please refer to [the `cookie` documentation](https://www.npmjs.com/package/cookie).
   *
   * @method POST
   * @param   {AccessTokenRequest}  body    A request that contains an *authentication challenge*.
   * @returns Promise<AccessTokenDTO>   An access/refresh token pair or an access token, or HTTP401-Unauthorized.
   * @throws  {HttpException}   Given an *invalid* authentication challenge which could not be found in recent transactions on dHealth Network.
   */
  @Post("auth/token")
  @ApiOperation({
    summary: "Get an authenticated user's access tokens",
    description:
      "Request an authenticated user's access token and refresh token. The access token is short-lived (1 hour) and the refresh token can be used to get a new access token after it expired.",
  })
  @ApiExtraModels(AccessTokenDTO)
  @ApiOkResponse(HTTPResponses.AuthTokenResponseSchema)
  protected async getAccessToken(
    @Body() body: AccessTokenRequest,
    @NestResponse({ passthrough: true }) response: Response,
  ): Promise<AccessTokenDTO> {
    try {
      // generates cookie configuration (depends on dApp)
      const authCookie = this.authService.getCookie();

      // validate the authentication challenge:
      // - make sure it wasn't used before (no multiple usage)
      // - make sure it is present in a recent transaction on-chain
      const payload: AuthenticationPayload =
        await this.authService.validateChallenge(body.challenge);

      if (null !== payload) {
        // fetches or generates currently active accessToken, note that a
        // `refreshToken` will only be attached when it is initially created
        const tokens: AccessTokenDTO = await this.authService.getAccessToken(
          payload,
        );

        // set access token as the value of the cookie,
        // as an end-user is now successfully logged-in.
        // @link https://www.npmjs.com/package/cookie
        response.cookie(authCookie.name, tokens.accessToken, {
          httpOnly: true,
          domain: authCookie.domain,
          signed: true,
        });

        // set refresh token as the value for the Refresh
        // cookie in the response to permit refreshing
        // `refreshToken` will only be attached the first time
        if (undefined !== tokens.refreshToken) {
          response.cookie("Refresh", tokens.refreshToken, {
            httpOnly: true,
            domain: authCookie.domain,
            signed: true,
          });
        }

        return tokens;
      }
    } catch (e: any) {
      console.log("Error during challenge validation: ", e);
      // @todo Add error handling for HTTP exceptions
      throw e;
    }
  }

  /**
   * Creates a JSON Web Token given a valid `refreshToken`
   * is attached to the request headers in the `Authorization`
   * header as a *Bearer* token.
   * <br /><br />
   * Note that a token will only be returned given that a
   * `refreshToken` matches the refresh token hash (SHA3-256)
   * of the given *account address* as attached to the request
   * in the {@link RefreshGuard} middleware/guard.
   * <br /><br />
   * The `passthrough` flag in `NestResponse()` operator permits
   * to instruct *nest* to pass on the response cookie onto the
   * express `Response` object.
   *
   * @method POST
   * @param   {Request}  request    A request that contains an authenticated user's authentication payload.
   * @returns Promise<AccessTokenDTO>   An access token, or HTTP401-Unauthorized.
   * @throws  {HttpException}   Given an *invalid* refresh token or address or an invalid combination of both.
   */
  @UseGuards(RefreshGuard)
  @Get("auth/refresh")
  @ApiOperation({
    summary: "Refresh an authenticated user's expired access token",
    description:
      "Request an authenticated user's access token refresh. The access token is short-lived (1 hour) and thereby needs to be refreshed after it expired.",
  })
  @ApiExtraModels(AccessTokenDTO)
  @ApiOkResponse(HTTPResponses.AuthRefreshResponseSchema)
  protected async refreshTokens(
    @NestRequest() request: RequestWithUser,
    @NestResponse({ passthrough: true }) response: Response,
  ): Promise<AccessTokenDTO> {
    try {
      // generates cookie configuration (depends on dApp)
      const authCookie = this.authService.getCookie();

      // validate the refresh token and get authentication payload
      // - make sure it is a valid `refreshToken` in `accounts`
      const tokens: AccessTokenDTO = await this.authService.refreshAccessToken(
        request.payload.address,
        request.cookies.Refresh,
      );

      // set access token as the value of the cookie,
      // as an end-user is now successfully logged-in.
      response.cookie(authCookie.name, tokens.accessToken, {
        httpOnly: true,
        domain: authCookie.domain,
        signed: true,
      });

      return tokens;
    } catch (e: any) {
      // @todo Add error handling for HTTP exceptions
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
  @Get("me")
  @ApiOperation({
    summary: "Get an authenticated user's profile details",
    description:
      "Request an authenticated user's profile details. This request will only succeed given a valid access token in the bearer authorization header of the request.",
  })
  @ApiExtraModels(AccountDTO)
  @ApiOkResponse(HTTPResponses.MeResponseSchema)
  protected getProfile(@NestRequest() req: Request) {
    return req.user;
  }
}
