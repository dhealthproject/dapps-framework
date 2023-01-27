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
import { OnEvent } from "@nestjs/event-emitter";

/**
 * @class UserNotifier
 * @description The main service of the UserNotifier module.
 *
 * @since v0.3.2
 */
@Injectable()
export class UserNotifier {
  /**
   * This method handles starting of challenge validation.
   * Gets trigged by "auth.open" emit from handleConnection().
   * Calls .startCronJob from validateChallengeScheduler.
   *
   * @param   {any}  payload       Contains challenge string
   * @returns {void}  Emits "auth.open" event which triggers validating of the received challenge
   */
  @OnEvent("notifier.users.notify", { async: true })
  public async createNotification(notification: UserNotificationBody) {}
}
