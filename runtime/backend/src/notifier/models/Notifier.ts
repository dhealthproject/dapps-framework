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
import { ISendMailOptions } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer";

export type MessageDetails = object | ISendMailOptions;

export type NotifierResult = object | SentMessageInfo;

/**
 * @interface Notifier
 * @description An interface specifying the structure of a
 * notifier strategy.
 *
 * @since v0.3.2
 */
export interface Notifier {
  /**
   * Method to send notifications internally.
   *
   * @access public
   * @param {object} details The necessary details for the notification.
   */
  sendInternal(details: MessageDetails): NotifierResult;

  /**
   * Method to send notifications publicly.
   *
   * @access public
   * @param {object} details The necessary details for the notification.
   */
  sendPublic(details: MessageDetails): NotifierResult;
}
