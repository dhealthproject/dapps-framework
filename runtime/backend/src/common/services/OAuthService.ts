/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// internal dependencies
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { Address } from "@dhealth/sdk";

/**
 * @description enum which defines
 * list of providers available for current app
 */
enum Providers {
  strava = "strava",
  // example of other provider
  // appleHealth = https://www.apple-health.com/oauth/authorize
}

/**
 * @class OAuthService
 * @description This class contains methods
 * for connecting, linking accounts to the providers
 * usage example can be found in OAuthController
 *
 * @since v0.2.0
 */
@Injectable()
export class OAuthService {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {ConfigService} configService
   */
  public constructor(private readonly configService: ConfigService) {}

  /**
   * Returns url & query for redirect to provider page
   *
   * @method GET
   * @param provider
   * @param dhealthAddress
   * @param ref
   *
   * @returns string
   */
  getRedirectURL(provider: string, dhealthAddress: string, ref: string) {
    // check if provider exists
    if (!Object.keys(Providers).includes(provider)) {
      throw new BadRequestException("Provider does not exist");
    }

    // check if provided address is valid
    try {
      const addr = Address.createFromRawAddress(dhealthAddress);
    } catch (e) {
      throw e;
    }

    let providerUrl: string;
    let query: string;

    const client_id = this.configService.get<string>(`${provider}.client_id`);
    const oauth_url = this.configService.get<string>(`${provider}.oauth_url`);
    const redirect_url = this.configService.get<string>(
      `${provider}.redirect_url`,
    );
    providerUrl = oauth_url;
    query =
      `?` +
      `client_id=${client_id}` +
      `&response_type=code` +
      `&approval_prompt=auto` +
      `&scope=activity:read_all` +
      `&redirect_uri=${encodeURIComponent(redirect_url)}` + // should be /link
      `&state=${dhealthAddress}${ref}`; // forwards address and refcode

    return `${providerUrl}${query}`;
  }
}
