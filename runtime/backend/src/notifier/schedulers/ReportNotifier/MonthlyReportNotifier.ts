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
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import { NotifierFactory } from "../../../notifier/concerns/NotifierFactory";
import { Log, LogDocument, LogModel } from "../../../common/models/LogSchema";
import { QueryService } from "../../../common/services/QueryService";
import { DappHelper } from "../../../common/concerns/DappHelper";
import { LogService } from "../../../common/services/LogService";
import { ReportNotifier } from "./ReportNotifier";
import { Injectable } from "@nestjs/common";

/**
 * @class MonthlyReportNotifier
 * @description The concrete implementation for the report notifier
 * scheduler. Contains source code for the execution logic of a
 * command with name: `notifier:ReportNotifier/M`.
 *
 * @since v0.5.3
 */
@Injectable()
export class MonthlyReportNotifier extends ReportNotifier {
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
    @InjectModel(Log.name) protected readonly model: LogModel,
    protected readonly configService: ConfigService,
    protected readonly queryService: QueryService<LogDocument, LogModel>,
    protected readonly stateService: StateService,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly notifierFactory: NotifierFactory,
    protected readonly dappHelper: DappHelper,
    protected readonly logService: LogService,
  ) {
    super(
      model,
      configService,
      queryService,
      stateService,
      schedulerRegistry,
      notifierFactory,
      dappHelper,
      logService,
    );
    this.periodFormat = "M";
    this.initLogger();
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
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
   * @returns {Promise<void>}
   */
  @Cron("0 0 0 1 * *", { name: `notifier:cronjobs:reportNotifier:M` })
  public async runAsScheduler(): Promise<void> {
    this.runScheduler();
  }
}
