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
import { Cron, SchedulerRegistry } from "@nestjs/schedule";

// internal dependencies
import {
  StatisticsCommand,
  StatisticsCommandOptions,
} from "../StatisticsCommand";
import { StateService } from "../../../common/services/StateService";
import { UserAggregationStateData } from "../../models/UserAggregationStateData";

@Injectable()
export class UserAggregation extends StatisticsCommand {
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
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

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
   * @returns {StateData}
   */
  protected getStateData(): UserAggregationStateData {
    return {
      lastExecutedAt: this.lastExecutedAt,
    } as UserAggregationStateData;
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   * <br /><br />
   * This property is required through the extension of
   * {@link StatisticsCommand}.
   *
   * @see StatisticsCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `UserAggregation`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   * <br /><br />
   * This property is required through the extension of
   * {@link StatisticsCommand}.
   *
   * @see StatisticsCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `UserAggregation`;
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
  @Cron("*/30 * * * * *", { name: "statistics:cronjobs:user-aggregation" })
  public async runAsScheduler(): Promise<void> {
    // setup debug logger
    this.logger = new Logger(
      `${this.scope}/${this.command}`, // includes /(D|M|W)
    );

    // display starting moment information in debug mode
    this.debugLog(`Starting user aggregation type: ${this.TYPE}`);

    // executes the actual command logic (this will call aggregate())
    await this.run([this.TYPE], {
      debug: true,
      quiet: false,
    });
  }

  /**
   * This method implements the statistics logic for this command
   * that will aggregate relevant users.
   *
   * @access public
   * @async
   * @param   {ProcessOperationsCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async aggregate(options?: StatisticsCommandOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
