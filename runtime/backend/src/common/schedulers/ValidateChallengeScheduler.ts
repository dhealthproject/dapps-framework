/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { Injectable } from "@nestjs/common";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";

import { AuthService } from "../services";

@Injectable()
export class ValidateChallengeScheduler {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    protected readonly authService: AuthService,
  ) {
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
  }

  protected cronExpression = "*/10 * * * * *"; // each 10 seconds

  protected job: CronJob;

  protected challenge: string;

  protected stopCronJobTimeout: any;

  protected stopTimeoutAmount = 1800000;

  protected async validate() {
    try {
      const payload = await this.authService.validateChallenge(this.challenge);
      // after challenge validated successfully - stop running cron
      this.stopCronJob();
      console.log({ payload });
    } catch (err) {
      console.log("Error validate()", err);
    }
  }

  protected stopCronJob() {
    this.job.stop();
    this.challenge = "";
    clearTimeout(this.stopCronJobTimeout);
  }

  public startCronJob(challenge: string) {
    this.challenge = challenge;

    this.job.start();

    // stop cronjob in case if challenge wasn't validated during 30 minutes
    this.stopCronJobTimeout = setTimeout(() => {
      this.stopCronJob();
    }, this.stopTimeoutAmount);
  }
}
