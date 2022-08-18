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
 * @since v0.2.0
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
  @Get("authorization/:provider")
  protected async getOAuthToken(
    @NestResponse() response: Response,
    @Param("provider") provider: string,
    @Query() query: any,
  ) {
    const { ref, dhealthAddress } = query;
    console.log("address", dhealthAddress);
    console.log("address", ref);
    const redirect_uri = await this.oauthService.getRedirectURL(
      provider,
      dhealthAddress,
      ref,
    );

    return response.redirect(redirect_uri);
  }
}
