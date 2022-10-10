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
import { AccessTokenDTO } from "../models/AccessTokenDTO";

/**
 * @interface OAuthDriver
 * @description This interface defines the fields and methods of an
 * **OAuth** driver which determines communication, transport and
 * process that are used to connect and integrate to custom providers.
 *
 * @since v0.3.0
 */
export interface OAuthDriver {
  /**
   * Getter of the driver's data field name.
   *
   * @access public
   * @var {string}
   */
  get dataField(): string;

  /**
   * Getter of the driver's code field name.
   *
   * @access public
   * @var {string}
   */
  get codeField(): string;

  /**
   * Method to return the authorize url of this driver's provider.
   *
   * @access public
   * @var {string}
   */
  getAuthorizeURL(extra: string): string;

  /**
   * Method to return the access token from the driver's provider.
   *
   * @access public
   * @var {string}
   */
  getAccessToken(code: string, data?: string): Promise<AccessTokenDTO>;
}
