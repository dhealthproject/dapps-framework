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
 *
 * @todo Add relevant type documentation
 */
export type AuthParameters = {
  secret: string,
  challengeSize: number,
};

/**
 *
 * @todo Add relevant type documentation
 */
export type CookieParameters = {
  name: string,
  domain: string,
};

/**
 * @interface SecurityConfig
 * @description This interface defines the required configuration of dApps
 * security guards.
 *
 * @todo Add relevant property documentation for {@link auth}
 * @todo Add relevant property documentation for {@link cookie}
 * @since v0.2.0
 */
export interface SecurityConfig {
  /**
   * 
   *
   * @access public
   * @var {AuthParameters}
   */
  auth: AuthParameters;

  /**
   * 
   *
   * @access public
   * @var {AuthConfig}
   */
  cookie: CookieParameters;

}
