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
 * @since v0.2.0
 */
export interface DatabaseConfig {
  /**
   * The database's host name.
   *
   * @access public
   * @var {string}
   */
  host: string;

  /**
   * The database's port number. This value can either be a string or a number.
   * E.g. `27017` or `"27017"`.
   *
   * @access public
   * @var {number | string}
   */
  port: number | string;

  /**
   * The database name to connect to.
   *
   * @access public
   * @var {string}
   */
  name: string;

  /**
   * The username used to login to the database.
   *
   * @access public
   * @var {string}
   */
  user: string;
}
