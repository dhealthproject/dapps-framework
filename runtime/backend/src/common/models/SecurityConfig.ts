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
 * @link SecurityConfig
 * @since v0.3.0
 */
export type AuthParameters = {
  registries: string[];
  secret: string;
  challengeSize: number;
};

/**
 * @label COMMON
 * @type CrossOriginParameters
 * @description This type consists of the security configuration
 * related to the backend runtime API. It sets the valid origins
 * to enable/disable CORS and permits to stop accepting requests
 * from unknown locations ("origins").
 * <br /><br />
 * @example Using the `CrossOriginParameters` type with a wildcard origin
 * ```json
 * { origin: "*" }
 * ```
 * <br /><br />
 * @example Using the `CrossOriginParameters` type with a list of origins
 * ```json
 * // this allows both localhost and example.com
 * { origin: ["http://localhost", "http://example.com"] }
 * ```
 * <br /><br />
 * @example Using the `CrossOriginParameters` type to disable CORS
 * ```json
 * // Setting `origin: false` disables CORS
 * { origin: false }
 *
 * // Setting `origin: true` is the equivalent of a wilcard
 * { origin: true }
 * ```
 *
 * @link SecurityConfig
 * @since v0.3.0
 */
export type CrossOriginParameters = {
  origin: string[] | string | boolean;
};

/**
 * @label COMMON
 * @interface SecurityConfig
 * @description The dApp security configuration. This configuration
 * object is used to determine communication, transport and process
 * that are used in security-critical scopes.
 *
 * @link SecurityConfig
 * @since v0.3.0
 */
export interface SecurityConfig {
  /**
   * An authentication configuration object. This consists of parameters
   * that are necessary to process *authentication* for end-users.
   * This configuration option uses the {@link AuthParameters}
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
   * @link AuthParameters
   * @access public
   * @var {AuthParameters}
   */
  auth: AuthParameters;

  /**
   * A CORS configuration object. This consists of parameters
   * that are necessary to secure API Requests of this backend runtime.
   * This configuration option uses the {@link CrossOriginParameters}
   * type and consists of an **origin** configuration to enable/disable
   * CORS and restrict the originators of requests to the API.
   * <br /><br />
   * @example Example backend CORS configuration object
   * ```json
   * { origin: "*" }
   * ```
   *
   * @link CrossOriginParameters
   * @access public
   * @var {CrossOriginParameters}
   */
  cors: CrossOriginParameters;
}
