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
   * @var {CookieParameters}
   */
  cookie: {
    name: "dapps.dhealth.universe",
    domain: "localhost",
  },
});
