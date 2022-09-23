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
import { sha3_256 } from "js-sha3";

// internal dependencies
import { AuthenticationPayload, AuthService } from "../services/AuthService";
import { AuthGuard } from "../traits/AuthGuard";
import { RefreshGuard } from "../traits/RefreshGuard";
import { AccessTokenDTO } from "../models/AccessTokenDTO";
import { AccessTokenRequest } from "../requests/AccessTokenRequest";
import { AuthChallengeDTO } from "../models/AuthChallengeDTO";
import { StatusDTO } from "../models/StatusDTO";
import { AccountsService } from "../services/AccountsService";
import { AccountDocument, AccountQuery } from "../models/AccountSchema";

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
  // maps to the HTTP response of `/auth/logout`
  export const AuthLogoutResponseSchema = {
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
 * | `/auth/logout` | **`GET`** | {@link AuthController.logout} | Uses the {@link AuthGuard:COMMON} to validate the required **access token** (Server cookie or Bearer authorization header). Revokes a user's access token (invalidate). The access token cannot be used anymore, a new access token must be requested instead. |
 * <br /><br />
 *
 * @since v0.2.0
 */
@ApiTags("Authentication")
@Controller("auth")
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
    private readonly accountsService: AccountsService,
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
   * @todo Should accept an authorized registry in the /auth/challenge request
   * @method GET
   * @access protected
   * @async
   * @returns Promise<AuthChallengeDTO>   A freshly-created authentication challenge.
   */
  @Get("challenge")
  @ApiOperation({
    summary: "Get an authentication challenge",
    description:
      "Request an authentication challenge. This challenge must be included in a transaction on dHealth Network for the authentication process to succeed.",
  })
  @ApiExtraModels(AuthChallengeDTO)
  @ApiOkResponse(HTTPResponses.AuthChallengeResponseSchema)
  protected async getAuthCode(): Promise<AuthChallengeDTO> {
    // generates cookie configuration (depends on dApp)
    //const authCookie = this.authService.getCookie();

    // generates a *random* authentication challenge
    const authChallenge = this.authService.getChallenge();

    // set authentication challenge as the value of the
    // cookie. This will be replaced by the accessToken
    // and refreshToken when authentication is successful.
    // response.cookie(authCookie.name, authChallenge, {
    //   httpOnly: true,
    //   domain: authCookie.domain,
    //   signed: true,
    // });

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
   * @access protected
   * @async
   * @param   {AccessTokenRequest}  body    A request that contains an *authentication challenge*.
   * @param   {Response}            response    An `express` response object that will be used to attach signed cookies.
   * @returns Promise<AccessTokenDTO>   An access/refresh token pair or an access token, or HTTP401-Unauthorized.
   * @throws  {HttpException}   Given an *invalid* authentication challenge which could not be found in recent transactions on dHealth Network.
   */
  @Post("token")
  @ApiOperation({
    summary: "Get an authenticated user's access tokens",
    description:
      "Request an authenticated user's access token and refresh token. The access token is short-lived (1 hour) and the refresh token can be used to get a new access token after it expired.",
  })
  @ApiExtraModels(AccessTokenRequest, AccessTokenDTO)
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
          // @todo This should permit multi-devices at some point
          // @todo It is currently not possible to *refresh* on multi devices
          response.cookie(`${authCookie.name}:Refresh`, tokens.refreshToken, {
            httpOnly: true,
            domain: authCookie.domain,
            signed: true,
          });
        }

        return tokens;
      }
    } catch (e: any) {
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
   * @access protected
   * @async
   * @param   {Request}  request        An `express` request that contains an authenticated user's authentication payload.
   * @param   {Response} response       An `express` response object that will be used to attach signed cookies.
   * @returns Promise<AccessTokenDTO>   An access token, or HTTP401-Unauthorized.
   * @throws  {HttpException}   Given an *invalid* refresh token or address or an invalid combination of both.
   */
  @UseGuards(RefreshGuard)
  @Get("refresh")
  @ApiOperation({
    summary: "Refresh an authenticated user's expired access token",
    description:
      "Request an authenticated user's access token refresh. The access token is short-lived (1 hour) and thereby needs to be refreshed after it expired.",
  })
  @ApiExtraModels(AccessTokenDTO)
  @ApiOkResponse(HTTPResponses.AuthRefreshResponseSchema)
  protected async refreshTokens(
    @NestRequest() request: Request,
    @NestResponse({ passthrough: true }) response: Response,
  ): Promise<AccessTokenDTO> {
    try {
      // generates cookie configuration (depends on dApp)
      const authCookie = this.authService.getCookie();

      // read and decode refresh token
      const token: string = AuthService.extractToken(
        request,
        `${authCookie.name}:Refresh`,
      );

      // find profile information in database
      const account = await this.accountsService.findOne(
        new AccountQuery({
          refreshTokenHash: sha3_256(token),
        } as AccountDocument),
      );

      // validate the refresh token and get authentication payload
      // - make sure it is a valid `refreshToken` in `accounts`
      const tokens: AccessTokenDTO = await this.authService.refreshAccessToken(
        account.address,
        token,
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
   * Revokes an end-user's access token and refresh token. This
   * request should be executed to sign-out users in a frontend.
   * <br /><br />
   * The request is secured using the {@link AuthGuard} guard
   * which attaches a `payload` to the request object.
   * <br /><br />
   * The `passthrough` flag in `NestResponse()` operator permits
   * to instruct *nest* to pass on the response cookie onto the
   * express `Response` object.
   * <br /><br />
   * For details about the *options* passed to the `response.cookie`
   * call, please refer to [the `cookie` documentation](https://www.npmjs.com/package/cookie).
   *
   * @todo should invalidate accessToken+refreshToken also in database
   * @method POST
   * @access protected
   * @async
   * @param   {Response} response       An `express` response object that will be used to attach signed cookies.
   * @returns Promise<StatusDTO>        An execution *status* DTO. Contains a HTTP status code and a `status` boolean property.
   */
  @UseGuards(AuthGuard)
  @Post("logout")
  @ApiOperation({
    summary: "Sign-out a user to invalidate access token",
    description:
      "Revokes a user's access token (invalidate). The access token cannot be used anymore, a new access token must be requested instead.",
  })
  @ApiExtraModels(StatusDTO)
  @ApiOkResponse(HTTPResponses.AuthLogoutResponseSchema)
  protected async logout(
    @NestResponse({ passthrough: true }) response: Response,
  ): Promise<StatusDTO> {
    // generates cookie configuration (depends on dApp)
    const authCookie = this.authService.getCookie();

    // removes accessToken from signed cookies
    response.cookie(authCookie.name, "", {
      httpOnly: true,
      domain: authCookie.domain,
      signed: true,
    });

    // removes refreshToken from signed cookies
    response.cookie(`${authCookie.name}:Refresh`, "", {
      httpOnly: true,
      domain: authCookie.domain,
      signed: true,
    });

    // @todo should invalidate accessToken+refreshToken also in database

    // Create a "success" status response
    return StatusDTO.create(200);
  }
}
