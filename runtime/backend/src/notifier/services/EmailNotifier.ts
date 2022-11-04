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
import { MailerService, ISendMailOptions } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer";

// internal dependencies
import { Notifier } from "../models/Notifier";

/**
 * @class EmailNotifier
 * @description The main service of the EmailNotifier module.
 *
 * @since v0.3.2
 */
@Injectable()
export class EmailNotifier implements Notifier {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {MailerService} mailerService
   */
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Method to send email notifications internally.
   *
   * @async
   * @param   {ISendMailOptions}    emailDetails     The necessary details for the notification.
   * @returns {Promise<SentMessageInfo>}
   */
  public async sendInternal(
    emailDetails: ISendMailOptions,
  ): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail(emailDetails);
  }

  /**
   * Method to send email notifications publicly.
   *
   * @async
   * @param   {ISendMailOptions}    emailDetails     The necessary details for the notification.
   * @returns {Promise<SentMessageInfo>}
   */
  public async sendPublic(
    emailDetails: ISendMailOptions,
  ): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail(emailDetails);
  }
}
