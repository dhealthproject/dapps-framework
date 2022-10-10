/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label CONFIG
 * @module OAuthConfig
 * @description The dApp OAuth configuration. This configuration
 * object is used to determine communication, transport and process
 * that are used to connect and integrate to custom providers.
 *
 * @todo should use pascalCase for configuration fields
 * @since v0.3.2
 */
export default () => ({
  /**
   * An OAuth Providers configuration object. This configuration
   * field consists of a key as listed in {@link ProviderType} and a
   * parameters object as defined by {@link ProviderParameters}.
   *
   * @example Example providers configuration object
   * ```json
   * {
   *   providers: {
   *     strava: { ... }
   *   }
   * }
   * ```
   * @var {OAuthProvidersMap}
   */
  providers: {
    /**
     * The `Strava` provider configuration object. This object consists
     * of the configuration fields that are required for this dApp to
     * connect and integrate to the `Strava` provider.
     *
     * @example Using the `OAuthProviderParameters` type to configure OAuth providers
     * ```json
     * {
     *   client_id: "123456",
     *   client_secret: "YourSecretFromProvider",
     *   oauth_url: "http://example.com/oauth/authorize",
     *   token_url: "http://example.com/oauth/token",
     *   callback_url: "http://localhost:8080/oauth/callback",
     *   scope: "activity:read_all"
     * }
     * ```
     * @var {OAuthProviderParameters}
     */
    strava: {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      verify_token: process.env.STRAVA_VERIFY_TOKEN,
      scope: "activity:read_all",
      oauth_url: "https://www.strava.com/oauth/authorize",
      token_url: "https://www.strava.com/oauth/token",
      callback_url: `${process.env.FRONTEND_URL}/dashboard`,
      subscribe_url: `${process.env.BACKEND_URL}/webhook/strava`,
      webhook_url: `${process.env.BACKEND_URL}/webhook/strava`,
    }
  }
});
