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
import { StorageOptions } from ".";

/**
 * @label COMMON
 * @interface MonitoringConfig
 * @description The dApp monitoring configuration object. This configuration
 * object is used to determine dApp monitoring information.
 * <br /><br />
 * This interface is mainly used **internally** to restrict the configuration
 * values provided to some modules or services and methods.
 *
 * @link MonitoringConfig:CONFIG
 * @since v0.3.2
 */
export interface MonitoringConfig {
  /**
   * A storage option field. This specifies logging transport options
   * that are enabled and to be applied.
   *
   * @example `["console", "filesystem"]`
   * @access public
   * @var {Transport[]}
   */
  storage: StorageOptions[];

  /**
   * A log levels specification. This specifies each log level that the
   * application can use and the score of each one.
   * <br /><br />
   * When processing and printing logs, levels with higher score will consist
   * lower score levels.
   * <br /><br />
   * E.g. printing logs at level `"debug"` will automatically include logs at
   * level `"warn"` and `"error"`.
   *
   * @example `{ none: 0, error: 1, warn: 2, debug: 4, info: 8 }`
   * @access public
   * @var {Record<string, number>}
   */
  logLevels: Record<string, number>;

  /**
   * A log print level specification. This specifies at which level of
   * the application logs should they be displayed and printed.
   *
   * @example `"info"`
   * @access public
   * @var {string}
   */
  logPrintLevel: string;

  /**
   * A log persistence level specification. This specifies at which level
   * of the application logs should they be persisted into the database.
   *
   * @example `"error"`
   * @access public
   * @var {string}
   */
  logPersistLevel: string;

  /**
   * A log persistence collection specification. This specifies the
   * database collection that will be used to persist logs.
   *
   * @example `"system-logs"`
   * @access public
   * @var {string}
   */
  logPersistCollection: string;

  /**
   * A log directory path. This specifies the path to the directory which
   * logs will be saved to if storage options contains `"filesystem"`.
   *
   * @example `"/example/directory/"`
   * @access public
   * @var {string}
   */
  logDirectoryPath: string;

  /**
   * The log max file size limit. This specifies the max size in which logging
   * will write to a new file when this limit is reached.
   * <br /><br />
   * Note that this value is in **bytes**. That means a max file size of `50kB`
   * will have value `50000`.
   *
   * @example `256000`
   * @access public
   * @var {number}
   */
  logMaxFileSize: number;

  /**
   * The alerts configuration options.
   *
   * @example `{type: "warn", transport: "mail", recipient: "dev-alerts@dhealth.foundation"}`
   * @access public
   * @var {AlertsConfig}
   */
  alerts: AlertsConfig;

  /**
   * The reports configuration options.
   *
   * @example `{type: "warn", transport: "mail", period: "W", recipient: "dev-reports@dhealth.foundation"}`
   * @access public
   * @var {ReportsConfig}
   */
  reports: ReportsConfig;
}

/**
 * @label COMMON
 * @interface AlertsConfig
 * @description The dApp monitoring alerts configuration object. This configuration
 * object is used to determine dApp alerts monitoring information.
 * <br /><br />
 * This interface is mainly used **internally** to restrict the configuration
 * values provided to some modules or services and methods.
 *
 * @link AlertsConfig:COMMON
 * @since v0.3.2
 */
export interface AlertsConfig {
  type: string[];
  transport: string;
  recipient: string | string[];
}

/**
 * @label COMMON
 * @interface ReportsConfig
 * @description The dApp monitoring reports configuration object. This configuration
 * object is used to determine dApp reports monitoring information.
 * <br /><br />
 * This interface is mainly used **internally** to restrict the configuration
 * values provided to some modules or services and methods.
 *
 * @link ReportsConfig:COMMON
 * @since v0.3.2
 */
export interface ReportsConfig extends AlertsConfig {
  period: string;
}
