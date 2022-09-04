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
 * @module SecurityConfig
 * @description The dApp security configuration. This configuration
 * object is used to determine communication, transport and process
 * that are used in security-critical scopes, as listed below:
 * <br /><br />
 * - A list of *authentication registries*, which are accounts owned
 *   by the dApp and that are used to *authenticate* users on-chain.
 * - An authentication secret that is used for signing access tokens.
 * - A custom challenge size, changing this has no effect on the
 *   validity of *previously created* authentication attempts.
 * - A cookie configuration object that consists of a label and
 *   the *domain name* that must be used for the user cookie. Cookies
 *   are always HTTP-only to provide with an added layer of security.
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur to the security systems in place and may
 * thereby affect the integrity of data loaded by the backend runtime.
 *
 * @since v0.3.0
 */
export default () => ({
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
   * @var {AuthParameters}
   */
  auth: {
    registries: [
      "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
    ],
    secret: process.env.AUTH_TOKEN_SECRET,
    challengeSize: 8,
  },

  /**
   * A CORS configuration object. This consists of parameters
   * that are necessary to secure API Requests of this backend runtime.
   * This configuration option uses the {@link CrossOriginParameters:COMMON}
   * type and consists of an **origin** configuration to enable/disable
   * CORS and restrict the originators of requests to the API.
   * <br /><br />
   * @example Example backend CORS configuration object
   * ```json
   * { origin: "*" }
   * ```
   * <br /><br />
   * @example Example backend CORS configuration object for a frontend
   * ```json
   * { origin: process.env.FRONTEND_URL }
   * ```
   *
   * @link CrossOriginParameters:COMMON
   * @var {CrossOriginParameters}
   */
  cors: {
    origin: process.env.FRONTEND_URL,
  }
});
