/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Injectable, LoggerService, LogLevel, Optional } from "@nestjs/common";
import path from "path";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";
import * as WinstonTransport from "winston-transport";
import "winston-mongodb";
import "winston-daily-rotate-file";

// internal dependencies
import { StorageOptions } from "../models/StorageOptions";

// configuration resources
import { DappConfig } from "../models/DappConfig";
import dappConfigLoader from "../../../config/dapp";
import { MonitoringConfig } from "../models/MonitoringConfig";
import monitoringConfigLoader from "../../../config/monitoring";

/**
 * @class LogService
 * @description This class serves as a common *logging service* application-wide.
 * <br /><br />
 * @example Initialize and use the LogService in another class
 * ```typescript
 *  import { LogService } from "./LogService";
 *
 *  @Injectable()
 *  export class ExampleService {
 *    logService: LogService;
 *    constructor(
 *      ...
 *    ) {
 *      this.logService = new LogService("example-context");
 *    }
 *
 *    // example usage
 *    printLog(message: string): void {
 *      this.logService.log(message);
 *    }
 *  }
 * ```
 *
 * @since v0.3.2
 */
@Injectable()
export class LogService implements LoggerService {
  private logger: LoggerService;
  private dappConfig: DappConfig;
  private monitoringConfig: MonitoringConfig;

  /**
   * The default constructor of this class.
   */
  constructor();

  /**
   * The constructor of this class with context.
   *
   * @param {string} context The identified context of this instance.
   */
  constructor(context: string);

  /**
   * The constructor implementation of this class.
   *
   * @param {string} context The optional identified context of this instance.
   */
  constructor(
    @Optional()
    protected context?: string,
  ) {
    this.dappConfig = dappConfigLoader();
    this.monitoringConfig = monitoringConfigLoader();
    this.logger = WinstonModule.createLogger({
      levels: this.monitoringConfig.logLevels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(this.context, {
          colors: true,
        }),
        winston.format.metadata(),
      ),
      transports: this.createTransports(),
    });
  }

  /**
   * The setter of this instance's context.
   *
   * @param {string} context The identified name of this instance.
   * @returns {void}
   */
  public setContext(context: string): void {
    this.context = context;
  }

  /**
   * Method to return a list of {@link WinstonsTransport} according to current
   * existing {@link MonitoringConfig} values.
   *
   * @access private
   * @returns {WinstonTransport[]}
   */
  private createTransports(): WinstonTransport[] {
    const transports: winston.transport[] = [];
    // persist error logs
    transports.push(
      new winston.transports.MongoDB({
        level: this.monitoringConfig.logPersistLevel,
        //mongo database connection link
        db: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
        options: {
          useUnifiedTopology: true,
        },
        // A collection to save json formatted logs
        collection: this.monitoringConfig.logPersistCollection,
        label: this.context,
      }),
    );
    // get storage options from config
    const storage = this.monitoringConfig.storage;
    // for each existing value create a WinstonTransport instance
    storage.forEach((option: string) => {
      // common config
      const winstonConfig: Record<string, object | string | number> = {
        level: this.monitoringConfig.logPrintLevel,
      };
      if (option === StorageOptions.CONSOLE) {
        // if storage is "console"
        transports.push(new winston.transports.Console(winstonConfig));
      } else if (option === StorageOptions.FILE_SYSTEM) {
        // if storage is "filesystem"
        // set filename
        winstonConfig.filename = path.join(
          this.monitoringConfig.logDirectoryPath,
          `${this.dappConfig.dappName}.lo%DATE%`,
        );
        // get and set log rotation date pattern
        winstonConfig.datePattern = "g";
        // set max file size
        winstonConfig.maxSize = this.monitoringConfig.logMaxFileSize;
        const transport = new winston.transports.DailyRotateFile(winstonConfig);
        // add to result list
        transports.push(transport);
      }
    });
    return transports;
  }

  /**
   * Write a 'log' level log.
   *
   * @access public
   * @param {string} message The log message.
   * @param {string} context The log context.
   * @return {void}
   */
  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  /**
   * Write an 'error' level log.
   *
   * @access public
   * @param {string} message  The error message.
   * @param {string} trace    The error trace.
   * @param {string} context  The error context.
   * @return {void}
   */
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  /**
   * Write a 'warn' level log.
   *
   * @access public
   * @param {string} message The warn message.
   * @param {string} context The warn context.
   * @return {void}
   */
  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  /**
   * Write a 'debug' level log.
   *
   * @access public
   * @param {string} message The debug message.
   * @param {string} context The debug context.
   * @return {void}
   */
  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  /**
   * Write a 'verbose' level log.
   *
   * @access public
   * @param {string} message The verbose message.
   * @param {string} context The verbose context.
   * @return {void}
   */
  verbose(message: string, context?: string): void {
    this.logger.verbose(message, context);
  }

  /**
   * Set log levels.
   *
   * @access public
   * @param {LogLevel[]} levels The log level values.
   * @return {void}
   */
  setLogLevels(levels: LogLevel[]): void {
    this.logger.setLogLevels(levels);
  }
}
