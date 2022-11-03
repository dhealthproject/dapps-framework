/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { StorageOptions } from "../src/common/models/StorageOptions";

/**
 * @label CONFIG
 * @module MonitoringConfig
 * @description The dApp monitoring configuration. This configuration
 * object is used to determine dApp monitoring information as
 * listed below:
 * <br /><br />
 * - A storage option field. This specifies logging transport options
 * that are enabled and to be applied.
 * - A log levels specification. This specifies each log level that the
 * application can use and the score of each one.
 * - A log print level specification. This specifies at which level of
 * the application logs should they be displayed and printed.
 * - A log persistence level specification. This specifies at which level
 * of the application logs should they be persisted into the database.
 * - A log persistence collection specification. This specifies the
 * database collection that will be used to persist logs.
 * - A log rotation period. This specifies the time period in which logs
 * can be rotated if storage options contains `"filesystem"`.
 * - A log directory path. This specifies the path to the directory which
 * logs will be saved to if storage options contains `"filesystem"`.
 * - An alerts configuration options. This specifies the necessary details
 * of which the app will use to send alerts to specific recipient(s).
 * - A reports configuration options. This specifies the necessary details
 * of which the app will use to send reports to specific recipient(s).
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the application log service and may
 * thereby affect the format, location and content of which logging occurs.
 *
 * @since v0.3.0
 */
export default () => ({
  /**
   * A storage option field. This specifies logging transport options
   * that are enabled and to be applied.
   *
   * @example `["console", "filesystem"]`
   * @var {Transport[]}
   */
  storage: [
    StorageOptions.CONSOLE,
    StorageOptions.FILE_SYSTEM
  ],

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
   * @var {Record<string, number>}
   */
  logLevels: {
    none: 0,
    error: 1,
    warn: 2,
    debug: 4,
    info: 8,
  },

  /**
   * A log print level specification. This specifies at which level of
   * the application logs should they be displayed and printed.
   *
   * @example `"debug"`
   * @var {string}
   */
  logPrintLevel: "info",

  /**
   * A log persistence level specification. This specifies at which level
   * of the application logs should they be persisted into the database.
   *
   * @example `"warn"`
   * @var {string}
   */
  logPersistLevel: "warn",

  /**
   * A log persistence collection specification. This specifies the
   * database collection that will be used to persist logs.
   *
   * @example `"system-logs"`
   * @var {string}
   */
  logPersistCollection: "system-logs",

  /**
   * A log directory path. This specifies the path to the directory which
   * logs will be saved to if storage options contains `"filesystem"`.
   *
   * @example `"/example/directory/"`
   * @var {string}
   */
  logDirectoryPath: "./logs/",

  /**
   * The log max file size limit. This specifies the max size in which logging
   * will write to a new file when this limit is reached.
   * <br /><br />
   * Note that this value is in **bytes**. That means a max file size of `50kB`
   * will have value `50000`.
   *
   * @example `256000`
   * @var {number}
   */
  logMaxFileSize: 256000,

  /**
   * The alerts configuration options.
   *
   * @example `{type: ["warn"], transport: "mail", recipient: "dev-alerts@dhealth.foundation"}`
   * @see AlertsConfig
   * @var {AlertsConfig}
   */
  alerts: {
    type: ["warn", "error"], // send mails for ERRORs and WARNs
    transport: "mail", // currently only mail supported
    recipient: "dev-alerts@dhealth.foundation",
  },

  /**
   * The reports configuration options.
   *
   * @example `{type: ["warn"], transport: "mail", period: "W", recipient: "dev-reports@dhealth.foundation"}`
   * @see ReportsConfig
   * @var {ReportsConfig}
   */
  reports: {
    type: ["warn", "error"],
    transport: "mail", // currently only mail supported
    period: "W", // daily, weekly, monthly, yearly
    recipient: "dev-reports@dhealth.foundation",
  },
});