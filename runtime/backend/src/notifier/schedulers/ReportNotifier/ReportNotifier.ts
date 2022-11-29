/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Injectable, LogLevel } from "@nestjs/common";
import { CronJob } from "cron";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PipelineStage } from "mongoose";
import moment from "moment";

// internal dependencies
import { NotifierCommand, NotifierCommandOptions } from "../NotifierCommand";
import { StateService } from "../../../common/services/StateService";
import { ReportNotifierStateData } from "../../models/ReportNotifierStateData";
import { NotifierFactory } from "../../../notifier/concerns/NotifierFactory";
import { NotifierType } from "../../../notifier/models/NotifierType";
import { Notifier } from "../../../notifier/models/Notifier";
import { Log, LogDocument, LogModel } from "../../../common/models/LogSchema";
import { QueryService } from "../../../common/services/QueryService";
import { DappHelper } from "../../../common/concerns/DappHelper";
import { ReportsConfig } from "../../../common/models/MonitoringConfig";
import { LogService } from "../../../common/services/LogService";

/**
 * @abstract
 * @class ReportNotifier
 * @description The concrete implementation for the report notifier
 * scheduler. Contains source code for the execution logic of a
 * command with name: `notifier:ReportNotifier/(D|M|W)`.
 *
 * @since v0.3.2
 */
export abstract class ReportNotifier extends NotifierCommand {
  /**
   * The period format i.e. `"D"`, `"W"` or `"M"`.
   *
   * @access protected
   * @var {string}
   */
  protected periodFormat: string;

  /**
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

  /**
   * The main {@link Notifier} instance of this class.
   * This is used to notifies recipients based on the configured
   * transport method and will be provider by the injected
   * {@link NotifierFactory} instance.
   *
   * @access private
   * @var {Notifier}
   */
  private notifier: Notifier;

  /**
   * The {@link ReportsConfig} instance that will be extracted from
   * the injected {@link ConfigService} instance.
   *
   * @access private
   * @readonly
   * @var {ReportsConfig}
   */
  private readonly reportsConfig: ReportsConfig;

  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {LogDocument} model
   * @param {ConfigService} configService
   * @param {QueryService} queryService
   * @param {StateService} stateService
   * @param {SchedulerRegistry} schedulerRegistry
   * @param {NotifierFactory} notifierFactory
   * @param {DappHelper} dappHelper
   * @param {LogService} logService
   */
  constructor(
    protected readonly model: LogModel,
    protected readonly configService: ConfigService,
    protected readonly queryService: QueryService<LogDocument, LogModel>,
    protected readonly stateService: StateService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly notifierFactory: NotifierFactory,
    protected readonly dappHelper: DappHelper,
    protected readonly logService: LogService,
  ) {
    super(logService, stateService);
    this.lastExecutedAt = new Date().valueOf();
    this.reportsConfig = this.configService.get<ReportsConfig>("reports");
    this.notifier = notifierFactory.getNotifier(
      this.reportsConfig.transport as NotifierType,
    );
  }

  /**
   *
   */
  protected initLogger() {
    // prepares execution logger
    this.logger.setModule(`${this.scope}/${this.command}`);
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   * <br /><br />
   * This property is required through the extension of
   * {@link NotifierCommand}.
   *
   * @see NotifierCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `ReportNotifier/${this.periodFormat}`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   * <br /><br />
   * This property is required through the extension of
   * {@link NotifierCommand}.
   *
   * @see NotifierCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `ReportNotifier/(D|W|M)`;
  }

  /**
   * This helper method should return the latest execution state
   * such that it can be saved.
   * <br /><br />
   * Execution states refer to one module's required state data,
   * potentially necessary during execution, and which is fetched
   * in {@link run} before execution and updated in {@link run}
   * after execution.
   *
   * @access protected
   * @returns {ReportNotifierStateData}
   */
  protected getStateData(): ReportNotifierStateData {
    return {
      lastExecutedAt: this.lastExecutedAt,
    } as ReportNotifierStateData;
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `notifier` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--collection` option.
   * <br /><br />
   * This method must be implemented in sub-classes with a proper
   * cron expression value.
   *
   * @see BaseCommand
   * @access public
   * @abstract
   * @returns {void}
   */
  public abstract runAsScheduler(): void;

  /**
   * This method is the **second entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `notifier` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--collection` option.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  public async runScheduler(): Promise<void> {
    // make sure we have a logger instance
    this.initLogger();

    // display starting moment information in debug mode
    this.debugLog(`Starting notifier report type: ${this.periodFormat}`);

    // validate notifier
    if (!this.notifier)
      throw new Error("Report notifer transport is not defined");

    // executes the actual command logic (this will call aggregate())
    await this.run([this.periodFormat], {
      debug: true,
    });
  }

  /**
   * This method implements the notifier logic for this command
   * that will aggregate and notifies configured recipient(s) about
   * the relevant *subjects*. Subjects in this command are persisted
   * logs in the database.
   *
   * @access public
   * @async
   * @param   {NotifierCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async report(options?: NotifierCommandOptions): Promise<void> {
    // make sure we have a logger instance
    this.initLogger();

    // keep track of last execution
    this.lastExecutedAt = new Date().valueOf();

    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog(`Starting notifier report type: ${this.periodFormat}`);
    }

    // get the latest blocks page number
    let lastTimeExecutedAt;
    if (
      !!this.state &&
      !!this.state.data &&
      "lastExecutedAt" in this.state.data
    ) {
      lastTimeExecutedAt = this.state.data.lastExecutedAt;
    }

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Last notifier report executed at: "${lastTimeExecutedAt}"`,
      );
    }

    // query warn/error logs in db within time range
    const { startDate, endDate } = this.dappHelper.getTimeRange(
      this.periodFormat,
    );
    const results = await this.queryService.aggregate(
      this.createLogQuery(
        this.reportsConfig.type as LogLevel[],
        startDate,
        endDate,
      ),
      this.model,
    );

    // debug information about upcoming database operations
    if (options.debug && !options.quiet && results.length > 0) {
      this.debugLog(`Found ${results.length} log subjects`);
    }
    // also display debug message when no operations are executed
    else if (options.debug && !options.quiet && !results.length) {
      this.debugLog(`No log subjects found`);

      // do not send e-mail if empty
      return;
    }

    // send notifications using configured transport method
    const dappName = this.configService.get<string>("dappName");
    const dappUrl = this.configService.get<string>("frontendApp.url");
    const dateStart = moment(startDate).format("YYYY-MM-DD");
    const dateEnd = moment(endDate).format("YYYY-MM-DD");
    this.notifier.sendInternal({
      to: this.reportsConfig.recipient,
      subject: `[${dappName}] LOGS REPORT for dApp (${dappUrl}) from ${dateStart} to ${dateEnd}`,
      text: `The production logs for ${dappName} (${dappUrl}) from ${dateStart} to ${dateEnd} can be found as an attachment to this email.`,
      html: `The production logs for ${dappName} (${dappUrl}) from <b>${dateStart}</b> to <b>${dateEnd}</b> can be found as an attachment to this email.`,
      attachments: [
        {
          // binary buffer as an attachment
          filename: "logs.html",
          content: Buffer.from(
            `<b>Logs for ${dappUrl} between ${dateStart} - ${dateEnd}: </b><br /><br /> ${this.dappHelper.createDetailsTableHTML(
              results,
            )}`,
            "utf-8",
          ),
        },
      ],
    });
  }

  /**
   * Method to create a {@link QueryService}'s log query.
   * Returns all {@link LogModel} between the timerange of
   * `startDate` and `endDate`.
   *
   * @access private
   * @param {LogLevel[]} levels The log levels to query from.
   * @param {Date} startDate The timerange's start {@link Date} instance.
   * @param {Date} endDate The timerange's end {@link Date} instance.
   * @returns {PipelineStage[]} All {@link LogModel} inside the timerange.
   */
  private createLogQuery(
    levels: LogLevel[],
    startDate: Date,
    endDate: Date,
  ): PipelineStage[] {
    return [
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lt: endDate,
          },
          level: {
            $in: levels,
          },
        },
      },
    ];
  }
}
