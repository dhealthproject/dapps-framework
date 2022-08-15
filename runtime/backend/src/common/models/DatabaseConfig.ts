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
 * @interface DatabaseConfig
 * @description This interface defines the required configuration of dApps
 * database connections.
 *
 * @todo The {@link port} property should likely be a `number | string`.
 * @todo Add relevant property documentation for {@link host}
 * @todo Add relevant property documentation for {@link port}
 * @todo Add relevant property documentation for {@link name}
 * @todo Add relevant property documentation for {@link user}
 * @since v0.2.0
 */
export interface DatabaseConfig {
  /**
   *
   * @access public
   * @var {string}
   */
  host: string;

  /**
   *
   * @access public
   * @var {string}
   */
  port: string;

  /**
   *
   * @access public
   * @var {string}
   */
  name: string;

  /**
   *
   * @access public
   * @var {string}
   */
  user: string;
}
