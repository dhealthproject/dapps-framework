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
import { ConfigService } from "@nestjs/config";
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
   *
   */
  private enableMailer: boolean;

  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {MailerService} mailerService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    // is the mailer enabled?
    this.enableMailer = this.configService.get<boolean>("enableMailer");
  }

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
    if (true === this.enableMailer) {
      return await this.mailerService.sendMail(emailDetails);
    }

    return undefined;
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
    if (true === this.enableMailer) {
      // @todo there is no difference between internal and public...
      // @todo public emails should always use a specific templating
      // @todo public emails should always be correctly signed, etc.
      return await this.mailerService.sendMail(emailDetails);
    }

    return undefined;
  }
}
