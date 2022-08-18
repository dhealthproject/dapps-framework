/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label COMMON
 * @type OAuthProviderParameters
 * @description This interface consists of a set of configuration
 * fields that must be provided to configure a custom OAuth provider.
 * <br /><br />
 * @example Using the `OAuthProviderParameters` type to configure OAuth providers
 * ```json
 * {
 *   client_id: "123456",
 *   client_secret: "YourSecretFromProvider",
 *   oauth_url: "http://example.com/oauth",
 * }
 * ```
 *
 * @link OAuthConfig:COMMON
 * @since v0.3.0
 */
export interface OAuthProviderParameters {
  client_id: string;
  client_secret: string;
  verify_token?: string;
  oauth_url: string;
  callback_url: string;
  subscribe_url?: string;
  webhook_url?: string;
}

/**
 * @label COMMON
 * @type OAuthProviderType
 * @description This interface consists of a set of configuration
 * fields that must be provided to configure a custom OAuth provider.
 * <br /><br />
 * Note that newly implemented OAuth provider **must** be added to
 * this type such that they are correctly understood and configured
 * for the backend runtime endpoints (`/oauth`).
 *
 * @link OAuthConfig:COMMON
 * @since v0.3.0
 */
export type OAuthProviderType = string | "strava";

/**
 * @label COMMON
 * @type OAuthProvidersMap
 * @description An OAuth Providers configuration object.
 * This configuration field consists of a key as listed
 * in {@link ProviderType} and a parameters object as
 * defined by {@link ProviderParameters}.
 *
 * @link OAuthConfig:COMMON
 * @since v0.3.0
 */
export type OAuthProvidersMap = {
  [key: OAuthProviderType]: OAuthProviderParameters;
};

/**
 * @label COMMON
 * @interface OAuthConfig
 * @description The dApp security configuration. This configuration
 * object is used to determine communication, transport and process
 * that are used in security-critical scopes.
 *
 * @link OAuthConfig:CONFIG
 * @since v0.3.0
 */
export interface OAuthConfig {
  /**
   * An OAuth Providers configuration object. This configuration
   * field consists of a key as listed in {@link ProviderType} and a
   * parameters object as defined by {@link ProviderParameters}.
   * <br /><br />
   * @example Example providers configuration object
   * ```json
   * {
   *   providers: {
   *     strava: { ... }
   *   }
   * }
   * ```
   *
   * @link OAuthProvidersMap:COMMON
   * @access public
   * @var {OAuthProvidersMap}
   */
  providers: OAuthProvidersMap;
}
