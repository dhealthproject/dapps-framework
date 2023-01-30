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

// internal dependencies
import { UserNotificationDTO } from "../models/UserNotificationDTO";
import { QueryService } from "../../common/services/QueryService";
import {
  UserNotificationModel,
  UserNotificationQuery,
  UserNotificationSchema,
  UserNotificationDocument,
  Notification,
} from "../models";
import { InjectModel } from "@nestjs/mongoose";

/**
 * @class UserNotifier
 * @description The main service of the UserNotifier module.
 *
 * @since v0.3.2
 */
@Injectable()
export class UserNotifier {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {UserNotificationModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Notification.name)
    private readonly model: UserNotificationModel,
    private readonly queryService: QueryService<
      UserNotificationDocument,
      UserNotificationModel
    >,
  ) {}
  /**
   * This method handles starting of challenge validation.
   * Gets trigged by "auth.open" emit from handleConnection().
   * Calls .startCronJob from validateChallengeScheduler.
   *
   * @param   {any}  payload       Contains challenge string
   * @returns {void}  Emits "auth.open" event which triggers validating of the received challenge
   */
  @OnEvent("notifier.users.notify", { async: true })
  public async createNotification(notification: UserNotificationDTO) {
    this.queryService.createOrUpdate(
      new UserNotificationQuery({
        address: notification.address,
        subjectId: notification.subjectId,
        subjectType: notification.subjectType,
        title: notification.title,
        description: notification.description,
        shortDescription: notification.shortDescription,
        readAt: notification.readAt,
      } as UserNotificationDocument),
      this.model,
      {},
    );
  }
}
