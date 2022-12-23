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
  ) {}

  protected job: CronJob;

  public addCronJob(cronExpression: string, challenge: string) {
    this.job = new CronJob(
      cronExpression, // cronTime
      this.validate.bind(this, challenge), // onTick
      undefined, // empty onComplete
      false, // "startNow" (done with L183)
      undefined, // timeZone
      undefined, // empty resolves to default context
      true, // "runOnInit"
    );

    // add cron to nest scheduler registry
    this.schedulerRegistry.addCronJob(
      `statistics:cronjobs:leaderboards:D`,
      this.job,
    );

    this.job.start();

    console.log("VALIDATION SCHEDULER IS UP AND RUNNING!!!!!!!!!!!!!!!!!!!!!!");
  }

  protected validate(challenge: string) {
    this.authService.validateChallenge(challenge);
  }

  protected stopCronJob() {
    this.job.stop();
  }
}
