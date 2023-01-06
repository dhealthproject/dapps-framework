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
import { OnAuthClosed } from "../events/OnAuthClosed";
import { OnAuthCompleted } from "../events/OnAuthCompleted";
import { OnAuthOpened } from "../events/OnAuthOpened";
import { ValidateChallengeScheduler } from "../schedulers/ValidateChallengeScheduler";
import { BaseGateway } from "./BaseGateway";

/**
 * @label COMMON
 * @class AuthGateway
 * @description This class extends baseGateway and is responsible for
 * handling authentication requests, running challenge validation and
 * finally allowing the frontend to call the `/auth/token` endpoint.
 * <br /><br />
 * This class defines multiple communication flows:
 * - `server to server` using the event emitter (OnEvent)
 * - `client to server` using websocket channel *messages* (SubscribeMessage)
 *
 * @since v0.6.0
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
   * This method handles auth.close event triggered by client.
   *
   * @returns {void}
   */
  @SubscribeMessage("auth.close")
  public onAuthClosed(payload: OnAuthClosed) {
    if (this.options.debug === true) {
      this.logger.debug(
        `Received event "auth.close" with challenge "${payload.challenge}"`,
      );
    }

    // extract challenge from payload
    const { challenge } = payload;
    if (challenge in this.clients) {
      // client has disconnected, remove from storage
      delete this.clients[challenge];
    }
  }

  /**
   * This method handles starting of challenge validation.
   * Gets trigged by "auth.open" emit from handleConnection().
   * Calls .startCronJob from validateChallengeScheduler.
   *
   * @param   {any}  payload       Contains challenge string
   * @returns {void}  Emits "auth.open" event which triggers validating of the received challenge
   */
  @OnEvent("auth.open", { async: true })
  public async onAuthOpened(payload: OnAuthOpened) {
    if (this.options.debug === true) {
      this.logger.debug(
        `Received event "auth.open" with challenge "${payload.challenge}"`,
      );
    }

    // extract challenge from payload
    const { challenge } = payload;
    this.validateChallengeScheduler.startCronJob(challenge);
  }

  /**
   * This method handles auth.close event,
   * which is getting triggered by validateChallengeScheduler when challenge on chain.
   * Sends auth.complete message to the client.
   *
   * @returns {void}  Emits "auth.complete" event which informs client that token may be queried.
   */
  @OnEvent("auth.complete", { async: true })
  public async onAuthCompleted(payload: OnAuthCompleted) {
    if (this.options.debug === true) {
      this.logger.debug(
        `Received event "auth.complete" with challenge "${payload.challenge}"`,
      );
    }

    // extract challenge from payload
    const { challenge } = payload;
    if (challenge in this.clients) {
      // sends completion
      this.clients[challenge].send("auth.complete");
    }
  }
}
