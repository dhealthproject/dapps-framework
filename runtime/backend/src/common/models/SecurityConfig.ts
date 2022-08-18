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
 * @type AuthParameters
 * @description This type consists of a list of dHealth Account
 * Addresses or Public Keys that are used for authentication
 * purposes (registry), as well as an authentication secret
 * which is used for signing access tokens.
 * <br /><br />
 * @example Using the `AuthParameters` type to configure authentication
 * ```json
 * {
 *   registries: ["NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY"],
 *   secret: "ThisIsASecretThatYouShouldNotUseAndThatShouldNotLeak",
 *   challengeSize: 8,
 * }
 * ```
 *
 * @link SecurityConfig:COMMON
 * @since v0.3.0
 */
export type AuthParameters = {
  registries: string[],
  secret: string,
  challengeSize: number,
};

/**
 * @label COMMON
 * @type CookieParameters
 * @description This type consists of a **cookie name** that can
 * be any human readable ("friendly") name, as well as a domain
 * name (or IP) that is used to secure the cookie.
 * <br /><br />
 * @example Using the `CookieParameters` type to configure cookies
 * ```json
 * {
 *   name: "accounts-of-dHealthverse",
 *   domain: "elevate.dhealth.com",
 * }
 * ```
 *
 * @link SecurityConfig:COMMON
 * @since v0.3.0
 */
export type CookieParameters = {
  name: string,
  domain: string,
};

/**
 * @label COMMON
 * @interface SecurityConfig
 * @description The dApp security configuration. This configuration
 * object is used to determine communication, transport and process
 * that are used in security-critical scopes.
 *
 * @link SecurityConfig:CONFIG
 * @since v0.3.0
 */
export interface SecurityConfig {
  /**
   * An authentication configuration object. This consists of parameters
   * that are necessary to process *authentication* for end-users.
   * This configuration option uses the {@link AuthParameters:COMMON}
   * type and consists of a list of dHealth Account Addresses or Public
   * Keys that are used for authentication purposes (registry), as well
   * as an authentication secret which is used for signing access tokens.
   * <br /><br />
   * @example Example authentication configuration object
   * ```json
   * {
   *   registries: ["NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY"],
   *   secret: "ThisIsASecretThatYouShouldNotUseAndThatShouldNotLeak",
   *   challengeSize: 8,
   * }
   * ```
   *
   * @link AuthParameters:COMMON
   * @access public
   * @var {AuthParameters}
   */
  auth: AuthParameters;

  /**
   * A cookies configuration object. This consists of parameters
   * that are necessary to persist *sessions* (securely) for end-users.
   * This configuration option uses the {@link CookieParameters:COMMON}
   * type and consists of a **cookie name** that can be any human
   * readable ("friendly") name, as well as a domain name (or IP)
   * that is used to secure the cookie.
   * <br /><br />
   * @example Example cookies configuration object
   * ```json
   * {
   *   name: "accounts-of-dHealthverse",
   *   domain: "elevate.dhealth.com",
   * }
   * ```
   *
   * @link CookieParameters:COMMON
   * @access public
   * @var {CookieParameters}
   */
  cookie: CookieParameters;

}
