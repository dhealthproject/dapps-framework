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
} from "@nestjs/common";
import { Response } from "express";

// internal dependencies
import { OAuthService } from "../services/OAuthService";

/**
 * @class OAuthController
 * @description The OAuth controller of the app.
 * Performs connection, linking user accounts
 * to fintess apps(appleHealth, Strava, etc.)
 *
 * @since v0.3.0
 */
@Controller()
export class OAuthController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {OAuthService} oauthService
   */
  public constructor(protected readonly oauthService: OAuthService) {}

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
  @Get("oauth/:provider")
  protected async authorize(
    @NestResponse() response: Response,
    @Param("provider") provider: string,
    @Query() query: any,
  ) {
    // read query parameters, `ref` is optional
    const { ref, dhealthAddress } = query;

    // build a *remote* authorization URL ("Strava OAuth URL")
    const authorize_url = await this.oauthService.getAuthorizeURL(
      provider,
      dhealthAddress,
      ref,
    );

    // redirect the browser to the remote authorization URL
    return response.status(301).redirect(authorize_url);
  }
}
