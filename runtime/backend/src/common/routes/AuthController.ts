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
import { Request, Response } from "express";

// internal dependencies
import { AuthenticationToken, AuthService } from "../services/AuthService";
import { AuthGuard } from "../traits/AuthGuard";
import { User } from "../models/User";
import { TokenRequestDTO } from "../models/TokenRequestDTO";

/**
 * @class AuthController
 * @description The auth controller of the app. Handles requests
 * about *authentication*, *access tokens* and basic profile
 * information requests.
 *
 * @since v0.2.0
 */
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
   * 
   * <br /><br />
   * The `passthrough` flag in `NestResponse()` operator permits
   * to instruct *nest* to pass on the response cookie onto the
   * express `Response` object.
   *
   * @param req 
   * @returns 
   */
  @Get("auth/challenge")
  protected async getAuthCode(
    @NestRequest() request: Request,
    @NestResponse({ passthrough: true }) response: Response,
  ): Promise<string> {
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
    return authChallenge;
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
  protected async getAccessToken(
    @NestRequest() req: Request,
    @Ip() ip: string,
    @Body() body: TokenRequestDTO
  ): Promise<AuthenticationToken> {
    try {
      const user: User = await this.authService.validate(
        body.address, // <<<------ XXX address is still UNKNOWN HERE!!!! doesnt work.
        body.authCode,
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
  protected getProfile(@NestRequest() req: Request) {
    return req.user;
  }
}
