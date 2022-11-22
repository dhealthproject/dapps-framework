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
import {
  Inject,
  Injectable,
  LoggerService,
  LogLevel,
  Optional,
} from "@nestjs/common";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";
import * as WinstonTransport from "winston-transport";
import "winston-mongodb";
import "winston-daily-rotate-file";
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import { StorageOptions } from "../models/StorageOptions";
import { DappConfig } from "../models/DappConfig";
import { MonitoringConfig } from "../models/MonitoringConfig";
import { AlertEvent } from "../events/AlertEvent";

// configuration resources
import dappConfigLoader from "../../../config/dapp";
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
  /**
   * The main logger of this class.
   * This will utilizes the {@link winston} logger
   * instance by default.
   *
   * @access private
   * @var {LoggerService}
   */
  private logger: LoggerService;

  /**
   * An instance of {@link DappConfig} that will be used
   * to get necessary dapp information for this class.
   *
   * @access private
   * @readonly
   * @var {DappConfig}
   */
  private readonly dappConfig: DappConfig;

  /**
   * An instance of {@link DappConfig} that will be used
   * to get necessary monitoring information for this class.
   *
   * @access private
   * @readonly
   * @var {MonitoringConfig}
   */
  private readonly monitoringConfig: MonitoringConfig;

  /**
   * The constructor implementation of this class.
   *
   * @param {string}        context       The optional identified context of this instance.
   */
  public constructor();
  public constructor(context: string);
  public constructor(context: string, eventEmitter: EventEmitter2);
  public constructor(
    @Optional() protected context?: string,
    @Optional() protected eventEmitter?: EventEmitter2,
  ) {
    // @todo should use AppConfiguration
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
   * Set the optional context which is prepended to the log
   * message for any level.
   *
   * @param   {string}    context
   * @returns {LogService}
   */
  public setContext(context: string) {
    this.context = context;
    return this;
  }

  /**
   * Write a 'log' level log. This method prints a log
   * message with level `"info"`.
   *
   * @access public
   * @param {string} message The log message.
   * @param {string} context The log context.
   * @return {void}
   */
  public log(message: string, ...optionalParams: any[]): void {
    this.logger.log(message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log. This method prints a log
   * message with level `"debug"`.
   *
   * @access public
   * @param {string} message The debug message.
   * @param {string} context The debug context.
   * @return {void}
   */
  public debug(message: string, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  /**
   * Write an 'error' level log. This method prints a log
   * message with level `"error"`.
   *
   * @access public
   * @param {string} message  The error message.
   * @param {string} trace    The error trace.
   * @param {string} context  The error context.
   * @return {void}
   */
  public error(message: string, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);

    // do we need an *alert* sent through e-mail?
    if (this.monitoringConfig.enableAlerts && this.eventEmitter) {
      this.logger.debug("Emitting event: notifier.alerts.error");
      const result = this.eventEmitter.emit(
        "notifier.alerts.error",
        AlertEvent.create(
          new Date(),
          "error",
          this.context,
          message,
          optionalParams.length > 0 ? optionalParams[0] : undefined,
          optionalParams.length > 1 ? optionalParams[1] : undefined,
        ),
      );
      this.logger.debug(`Event emitted: ${result ? "1" : "0"}`);
    }
  }

  /**
   * Write a 'warn' level log. This method prints a log
   * message with level `"warn"`.
   *
   * @access public
   * @param {string} message The warn message.
   * @param {string} context The warn context.
   * @return {void}
   */
  public warn(message: string, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);

    // do we need an *alert* sent through e-mail?
    if (this.monitoringConfig.enableAlerts && this.eventEmitter) {
      this.logger.debug("Emitting event: notifier.alerts.warn");
      const result = this.eventEmitter.emit(
        "notifier.alerts.warn",
        AlertEvent.create(
          new Date(),
          "warn",
          this.context,
          message,
          optionalParams.length > 0 ? optionalParams[0] : undefined,
          optionalParams.length > 1 ? optionalParams[1] : undefined,
        ),
      );
      this.logger.debug(`Event emitted: ${result ? "1" : "0"}`);
    }
  }

  /**
   * Write a 'verbose' level log. This method prints a log
   * message with level `"debug"`.
   *
   * @access public
   * @param {string} message The verbose message.
   * @param {string} context The verbose context.
   * @return {void}
   */
  public verbose(message: string, ...optionalParams: any[]): void {
    this.logger.verbose(message, ...optionalParams);
  }

  /**
   * Set log levels.
   *
   * @access public
   * @param {LogLevel[]} levels The log level values.
   * @return {void}
   */
  public setLogLevels(levels: LogLevel[]): void {
    this.logger.setLogLevels(levels);
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

    // database-log-persistence DISABLED for now
    // @todo configure "database" as a 3rd storage option.
    // *always* persist logs in database if they are
    // marked with the value of `config.logPersistLevel`
    // transports.push(
    //   new winston.transports.MongoDB({
    //     level: this.monitoringConfig.logPersistLevel,
    //     // mongo database connection link
    //     // @todo use AppConfiguration.getDatabaseModule
    //     db: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
    //     options: {
    //       useUnifiedTopology: true,
    //     },
    //     // A collection to save json formatted logs
    //     collection: this.monitoringConfig.logPersistCollection,
    //     label: this.context,
    //   }),
    // );

    // uses volume/global /logs folder
    const logFile = `${this.dappConfig.dappName}.log`;
    const errFile = `${this.dappConfig.dappName}-error.log`;
    const logPath = this.monitoringConfig.logDirectoryPath;

    // get storage options from config
    const storages = this.monitoringConfig.storage;
    const storageTypes = storages.map((s) => s.type);

    // do we display logs in the console?
    if (storageTypes.includes(StorageOptions.CONSOLE)) {
      // read console logging options
      const options = storages.find((s) => s.type === StorageOptions.CONSOLE);

      // configure console transport
      transports.push(
        new winston.transports.Console({
          level: options.level,
        }),
      );
    }

    // do we persist logs in /logs?
    if (storageTypes.includes(StorageOptions.FILE_SYSTEM)) {
      // read filesystem logging options
      const options = storages.find(
        (s) => s.type === StorageOptions.FILE_SYSTEM,
      );

      transports.push(
        // filesystem logs use daily rotation with
        // a symbolic link at `logs/ELEVATE.log`
        new winston.transports.DailyRotateFile({
          level: options.level,
          maxSize: this.monitoringConfig.logMaxFileSize,
          // note that we *do not* use date-based rotation
          // and use `g` here so that the filename will
          // use `.log` and not display a date in filename
          datePattern: "YYYYMMDD",
          // filename is built up from configuration
          // and replaces "%DATE%" which `g` from above
          // e.g. /logs/ELEVATE.log-20221117
          dirname: logPath,
          filename: `${logFile}-%DATE%`,
          // we also want the runtime to create a
          // symbolic link that can be "tail'd"
          createSymlink: true,
          symlinkName: `${logFile}`,
        }),
        // error logs are additionally stored in their
        // own `ELEVATE-error.log` file for further use
        new winston.transports.File({
          level: "error",
          dirname: logPath,
          filename: errFile,
        }),
      );
    }

    return transports;
  }
}
