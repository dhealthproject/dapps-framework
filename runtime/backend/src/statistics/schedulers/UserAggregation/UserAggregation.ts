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
import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

// internal dependencies
import { ActivityDataDocument } from "../../../processor/models/ActivityDataSchema";
import {
  StatisticsCommand,
  StatisticsCommandOptions,
} from "../StatisticsCommand";
import { StateService } from "../../../common/services/StateService";

@Injectable()
export abstract class UserAggregation extends StatisticsCommand {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param { SchedulerRegistry } schedulerRegistry
   * @param { StateService } stateService
   * @param { QueryService } queriesService
   * @param { NetworkService } networkService
   * @param { ConfigService } configService
   */
  constructor(
    // protected readonly model: StatisticsModel,
    // protected readonly assetModel: AssetDocument,
    // protected readonly activityModel: ActivityDocument,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly stateService: StateService, // protected readonly queriesService: QueryService<AssetDocument, AssetModel>, // protected readonly networkService: NetworkService, // protected readonly configService: ConfigService,
  ) {
    super(stateService);
    this.lastExecutedAt = new Date().valueOf();
  }
  /**
   * The type of statistics to be saved to the database.
   * Should be defaulted to `"user"`.
   *
   * @access private
   * @readonly
   * @var {string}
   */
  private readonly TYPE: string = "user";

  /**
   * The period format i.e. `"D"`, `"W"` or `"M"`.
   * This field will be overriden by sub-classes during initialization.
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

  public async aggregate(options?: StatisticsCommandOptions): Promise<void> {}

  /**
   * Method to create and run a cronjob automatically. Subclasses will
   * be **required** to call this method in their constructor with the
   * desired cron expression.
   *
   * @access protected
   * @param   {string} cronExpression
   * @returns {void}
   */
  protected addCronJob(cronExpression: string): void {
    // initialize a dynamic cronjob
    const job = new CronJob(
      cronExpression, // cronTime
      this.runAsScheduler.bind(this), // onTick
      undefined, // empty onComplete
      false, // "startNow" (done with L183)
      undefined, // timeZone
      undefined, // empty resolves to default context
      true, // "runOnInit"
    );

    // also register in nestjs schedulers
    this.schedulerRegistry.addCronJob(
      `statistics:cronjobs:users:${this.periodFormat}`,
      job,
    );

    // also, always *schedule* when initialized
    job.start();
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `processor` scope is enabled.
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
  public async runAsScheduler(): Promise<void> {
    // setup debug logger
    this.logger = new Logger(
      `${this.scope}/${this.command}`, // includes /(D|M|W)
    );

    // display starting moment information in debug mode
    this.debugLog(`Starting user aggregation type: ${this.periodFormat}`);

    // executes the actual command logic (this will call aggregate())
    await this.run([this.periodFormat], {
      debug: true,
      quiet: false,
    });
  }
}
