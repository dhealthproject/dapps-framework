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

/**
 * @label COMMON
 * @class AuthGateway
 * @description This class extends baseGateway. It's
 * responsible for handling authentication requests,
 * running validation scheduler, permitting to frontend to call get /token.
 * <br /><br />
 * This class can be used by adding different
 * @SubscribeMessage handlers.
 *
 * @since v0.2.0
 */
@Injectable()
export class AuthGateway extends BaseGateway {
  /**
   * Construct an instance of class.
   *
   * @access public
   * @param   {ValidateChallengeScheduler}      validateChallengeScheduler     start validation of the challenge
   * @param   {EventEmitter2}                   clients     Required by base gateway dependency.
   */
  constructor(
    private readonly validateChallengeScheduler: ValidateChallengeScheduler,
    protected readonly emitter: EventEmitter2,
  ) {
    super(emitter);
  }

  /**
   * This method handles starting of challenge validation.
   * Gets trigged by "auth.open" emit from handleConnection().
   * Calls .startCronJob from validateChallengeScheduler.
   *
   * @param   {any}  payload       Contains challenge string
   * @returns {void}  Emits "auth.open" event which triggers validating of the received challenge
   */
  @OnEvent("auth.open")
  handleEvent(payload: any) {
    this.validateChallengeScheduler.startCronJob(payload.challenge);
  }

  /**
   * This method handles auth.close event triggered by client.
   *
   * @returns {void}
   */
  @SubscribeMessage("auth.close")
  close() {
    this.logger.log("AUTHGATEWAY: Client disconnected");
  }

  /**
   * This method handles auth.close event,
   * which is getting triggered by validateChallengeScheduler when challenge on chain.
   * Sends auth.complete message to the client.
   *
   * @returns {void}  Emits "auth.complete" event which informs client that token may be queried.
   */
  @OnEvent("auth.complete")
  complete() {
    this.ws.send("auth.complete");
    this.logger.log("AUTHGATEWAY: Complete");
  }
}
