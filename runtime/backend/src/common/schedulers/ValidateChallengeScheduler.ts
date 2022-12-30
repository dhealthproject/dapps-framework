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

// internal dependencies
import { AuthService } from "../services";
import { LogService } from "../services";
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
   * Construct an instance of the scheduler.
   *
   * @access public
   * @param   {SchedulerRegistry}      schedulerRegistry     Add scheduler to Nest.js schedulers registry.
   * @param   {AuthService}            authService     Contains .validateChallenge method.
   * @param   {EventEmitter2}          emitter      Emitting of successfully validated challenge to proper handler.
   */
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    protected readonly authService: AuthService,
    protected readonly emitter: EventEmitter2,
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
      `statistics:cronjobs:leaderboards:D`,
      this.job,
    );

    // initialize logger
    this.logger = new LogService(
      `${dappConfig.dappName}/ValidateChallengeScheduler`,
    );
  }

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
   * This method implements validation process
   * which runs by scheduler each period of time.
   *
   * @param   {any}  payload       Contains challenge string
   * @returns {void}  Emits "auth.open" event which triggers validating of the received challenge
   */
  protected async validate() {
    try {
      const payload = await this.authService.validateChallenge(
        this.challenge,
        false,
      );

      if (null !== payload) {
        // after challenge validated successfully - stop running cron
        this.stopCronJob();
        this.emitter.emit("auth.complete");
        this.logger.log("successfully validated challenge", this.challenge);
      }
    } catch (err) {
      // if challenge isn't on chain - print info to the console
      this.logger.error("failed to validate challenge", err);
      throw err;
    }
  }

  /**
   * This method stops scheduler cronJob,
   * clears timeout as scheduler has been stopped.
   *
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
   * @returns {void}  Starts cronJob, sets challenge, sets timeout.
   */
  public startCronJob(challenge: string) {
    this.challenge = challenge;

    this.job.start();

    // stop cronjob in case if challenge wasn't validated during 30 minutes
    this.stopCronJobTimeout = setTimeout(() => {
      this.stopCronJob();
    }, this.stopTimeoutAmount);
  }
}
