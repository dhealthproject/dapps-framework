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
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import {
  OAuthProvidersMap,
  OAuthProviderParameters,
} from "../models/OAuthConfig";
import { OAuthDriver, BasicOAuthDriver, StravaOAuthDriver } from "../drivers";

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
   *
   * @param providerName
   * @returns
   */
  private driverFactory(providerName: string): OAuthDriver {
    // reads all OAuth providers from configuration
    const providers = this.configService.get<OAuthProvidersMap>("providers");

    if (!(providerName in providers)) {
      throw new Error(`Invalid oauth provider "${providerName}".`);
    }

    // keeps the relevant provider configuration
    const provider: OAuthProviderParameters = providers[providerName];

    // determine which **driver** must be used
    if ("strava" === providerName) {
      return new StravaOAuthDriver(provider);
    }

    return new BasicOAuthDriver(provider);
  }

  /**
   *
   * @param provider
   * @param dhealthAddress
   * @param ref
   * @returns
   */
  async getAuthorizeURL(
    providerName: string,
    dhealthAddress: string,
    referralCode?: string,
  ) {
    // reads OAuth providers from configuration
    const providers = this.configService.get<OAuthProvidersMap>("providers");
    const provider = providers[providerName];
    if (undefined === provider) {
      throw new Error(`Invalid oauth provider "${providerName}".`);
    }

    // get the basic OAuth authorization URL (typically remote)
    const oauth_url = provider.oauth_url;

    // generates the "extras" part that attaches the dHealth
    // address and possibly a referral code to forward.
    const extra: string =
      `${dhealthAddress}` +
      // in case a referral code is present, split with `:`
      (!!referralCode ? `:${referralCode}` : "");

    // creates a `OAuthDriver` depending on the provider name
    // and returns the remote *authorization URL* to link accounts
    return this.driverFactory(providerName).getAuthorizeURL(oauth_url, extra);
  }
}
