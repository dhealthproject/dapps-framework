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
 */
export type AuthParameters = {
  secret: string,
  challengeSize: number,
};

/**
 * 
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
