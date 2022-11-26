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
import { AppConfiguration } from "../../AppConfiguration";
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
   * The module name used to add more clarity about the
   * log messages that are created.
   *
   * @access private
   * @var {string}
   */
  private module: string;

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

    // set context to avoid emptiness
    if (!this.context || !this.context.length) {
      this.context = this.dappConfig.dappName;
    }

    // create a winston logger instance
    this.setupLogger();
  }

  /**
   * Set the optional context which is prepended to the log
   * message for any level.
   *
   * @param   {string}    context
   * @returns {LogService}
   */
  public setContext(context: string): LogService {
    // update context
    this.context = context;

    // update logger instance
    return this.setupLogger();
  }

  /**
   * Set the optional module which is prepended as well to the
   * log message for any level.
   * <br /><br />
   * The module is used to indicate clearly which combination of
   * scope and command is being executed, e.g. `discovery/DiscoverBlocks`.
   *
   * @param   {string}    module    A module name, e.g. `discovery/DiscoverAccounts`.
   * @returns {LogService}
   */
  public setModule(module: string): LogService {
    this.module = module;
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
    this.logger.log(message, this.getModule(), ...optionalParams);
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
    this.logger.debug(message, this.getModule(), ...optionalParams);
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
    this.logger.error(message, this.getModule(), ...optionalParams);

    // do we need an *alert* sent through e-mail?
    if (this.monitoringConfig.enableAlerts && this.eventEmitter) {
      /*const result = */ this.eventEmitter.emit(
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
    this.logger.warn(message, this.getModule(), ...optionalParams);

    // do we need an *alert* sent through e-mail?
    if (this.monitoringConfig.enableAlerts && this.eventEmitter) {
      /*const result = */ this.eventEmitter.emit(
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
    this.logger.verbose(message, this.getModule(), ...optionalParams);
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
   * This method serves to initialize the logger instance. Note
   * that the {@link LogService.context} field may be changed and
   * requires a reset of the logger instance.
   *
   * @access private
   * @returns {LogService}
   */
  private setupLogger(): LogService {
    // setup the logger instance
    this.logger = WinstonModule.createLogger({
      levels: this.monitoringConfig.logLevels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(this.context, {
          colors: true,
        }),
      ),
      transports: this.createTransports(),
    });

    return this;
  }

  /**
   * Getter method to retrieve either the module or the context.
   *
   * @access private
   * @returns {string}
   */
  private getModule(): string {
    return this.module ?? this.context;
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

      // configure filesystem transport
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

    // do we persist logs in database?
    if (storageTypes.includes(StorageOptions.DATABASE)) {
      // read filesystem logging options
      const options = storages.find((s) => s.type === StorageOptions.DATABASE);

      // configure database transport
      transports.push(
        new winston.transports.MongoDB({
          level: options.level,
          db: AppConfiguration.getDatabaseUrl(),
          options: {
            useUnifiedTopology: true,
          },
          collection: "logs",
          label: this.context,
        }),
      );
    }

    return transports;
  }
}
