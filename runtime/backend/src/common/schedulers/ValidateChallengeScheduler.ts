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
import { Injectable } from "@nestjs/common";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { AccessTokenRequest } from "../requests/AccessTokenRequest";
import { AccountsService } from "../services/AccountsService";
import {
  Account,
  AccountDocument,
  AccountQuery,
} from "../models/AccountSchema";
import { AuthService } from "../services/AuthService";
import { LogService } from "../services/LogService";
import { OnAuthCompleted } from "../events/OnAuthCompleted";

// configuration resources
import dappConfigLoader from "../../../config/dapp";
const dappConfig = dappConfigLoader();

/**
 * @label COMMON
 * @class ValidateChallengeScheduler
 * @description This class implements dynamic scheduler
 * which can be started dynamically based on
 * available connection. While it's running
 * it validate received challenge. Stops once challenge becomes
 * valid or 30 minutes have been passed.
 *
 * @since v0.2.0
 */
@Injectable()
export class ValidateChallengeScheduler {
  /**
   * This property permits to log information to the console or in files
   * depending on the configuration. This logger instance can be accessed
   * by extending listeners to use a common log process.
   *
   * @access protected
   * @var {LogService}
   */
  protected logger: LogService;

  /**
   * This property contains scheduler time,
   * marks tick time when provided function will be called.
   * Example: call validate() each 10 seconds
   *
   * @access protected
   * @var {string}
   */
  protected cronExpression = "*/10 * * * * *"; // each 10 seconds

  /**
   * This property contains created and stored CronJob.
   *
   * @access protected
   * @var {CronJob}
   */
  protected job: CronJob;

  /**
   * This property stores received
   * challenge. Gets cleared once cron stops.
   *
   * @access protected
   * @var {string}
   */
  protected challenge: string;

  /**
   * This property stores stopCronJobTimeout,
   * inside of it setTimeout() is getting set,
   * when cronJob starts.
   *
   * @access protected
   * @var {string}
   */
  protected stopCronJobTimeout: any;

  /**
   * This property stores amount of time,
   * after which cronJob should be stopped.
   *
   * @access protected
   * @var {number}
   */
  protected stopTimeoutAmount = 1800000;

  /**
   * The list of active authentication registries as configured
   * in the backend runtime.
   *
   * @access protected
   * @var {string[]}
   */
  protected authRegistries: string[];

  /**
   * Construct an instance of the scheduler.
   *
   * @access public
   * @param   {SchedulerRegistry}      schedulerRegistry     Add scheduler to Nest.js schedulers registry.
   * @param   {AuthService}            authService     Contains .validateChallenge method.
   * @param   {AccountsService}        accountsService     Used to read accounts from database.
   * @param   {EventEmitter2}          emitter      Emitting of successfully validated challenge to proper handler.
   * @param   {ConfigService}          configService     The nestjs `ConsigService` instance.
   */
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    protected readonly authService: AuthService,
    protected readonly accountsService: AccountsService,
    protected readonly emitter: EventEmitter2,
    protected readonly configService: ConfigService,
  ) {
    // initialize cronJob with provided params
    this.job = new CronJob(
      this.cronExpression, // cronTime
      this.validate.bind(this), // onTick
      undefined, // empty onComplete
      false, // "startNow" (done with L183)
      undefined, // timeZone
      undefined, // empty resolves to default context
      false, // "runOnInit"
    );

    // add cron to nest scheduler registry
    this.schedulerRegistry.addCronJob(
      `common:cronjobs:validate-challenge`,
      this.job,
    );

    // initialize logger
    this.logger = new LogService(
      `${dappConfig.dappName}/ValidateChallengeScheduler`,
    );

    // prepare challenge validation
    this.authRegistries = this.configService.get<string[]>("auth.registries");
  }

  /**
   * This method implements validation process
   * which runs by scheduler each period of time.
   *
   * @access protected
   * @async
   * @param   {any}  payload       Contains challenge string
   * @returns {Promise<void>}
   * @emits   {@link OnAuthCompleted}     Given a successful challenge validation.
   */
  protected async validate() {
    try {
      // - validates challenge's presence in database
      // - validates challenge's presence on-chain in a transfer
      // - updates the challenge database entry if necessary
      const payload = await this.authService.validateChallenge(
        {
          challenge: this.challenge,
          registry: this.authRegistries[0],
        } as AccessTokenRequest,
        false,
      ); // do not mark as used

      if (null !== payload) {
        // in case the account does not exist yet, create now
        await this.accountsService.getOrCreateForAuth(payload);

        // internal event emission
        // XXX onAuthCompleted should receive a AuthenticationPayload
        this.emitter.emit(
          "auth.complete",
          OnAuthCompleted.create(this.challenge),
        );

        // stop running cronjob and emit completion event
        this.stopCronJob();
      }
    } catch (err) {
      // if challenge isn't on chain, ignore and come back later
      return;
    }
  }

  /**
   * This method stops scheduler cronJob,
   * clears timeout as scheduler has been stopped.
   *
   * @access protected
   * @returns {void}  Stops cronJob, clears challenge, clears timeout.
   */
  protected stopCronJob() {
    this.job.stop();
    this.challenge = "";
    clearTimeout(this.stopCronJobTimeout);
  }

  /**
   * This method starts scheduler cronJob,
   * sets received challenge and sets cronJob timeout.
   *
   * @access protected
   * @returns {void}  Starts cronJob, sets challenge, sets timeout.
   */
  public startCronJob(challenge: string) {
    // prepare and start the internal cronjob
    this.challenge = challenge;
    this.job.start();

    // after 30 minutes, stop validating challenge
    this.stopCronJobTimeout = setTimeout(() => {
      // warn about aborting challenge validation
      this.logger.warn(
        `Challenge validation for "${this.challenge}" failed and aborted.`,
      );

      // stops running the cronjob
      this.stopCronJob();
    }, this.stopTimeoutAmount);
  }
}
