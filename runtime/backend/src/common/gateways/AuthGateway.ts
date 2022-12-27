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
import { SubscribeMessage } from "@nestjs/websockets";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";

// internal dependencies
import { ValidateChallengeScheduler } from "../schedulers/ValidateChallengeScheduler";
import { BaseGateway } from "./BaseGateway";

@Injectable()
export class AuthGateway
  extends BaseGateway
{
  constructor(
    private readonly validateChallengeScheduler: ValidateChallengeScheduler,
    protected readonly emitter: EventEmitter2,
  ) {
    super(emitter);
  }

  @OnEvent("auth.open")
  handleEvent(payload: any) {
    this.validateChallengeScheduler.startCronJob(payload.challenge);
    return { msg: "You're connected" };
  }

  @SubscribeMessage("auth.close")
  close() {
    console.log("AUTHGATEWAY: Connection closed");
  }

  @SubscribeMessage("auth.complete")
  complete() {
    console.log("AUTHGATEWAY: Complete");
  }
}
