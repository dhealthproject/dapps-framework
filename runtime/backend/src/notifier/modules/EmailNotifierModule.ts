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
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";

// internal dependencies
import { EmailNotifier } from "../services/EmailNotifier";

// configuration resources
import { MailerConfig } from "../models/TransportConfig";
import { ConfigModule, ConfigService } from "@nestjs/config";

/**
 * @label NOTIFIER
 * @class EmailNotifierModule
 * @description The main definition for the email notifier module.
 *
 * @since v0.3.2
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mailConfig = configService.get<MailerConfig>("mailer");
        return {
          transport: {
            host: mailConfig.host,
            port: mailConfig.port,
            secure: false,
            auth: {
              type: "login",
              user: mailConfig.user,
              pass: process.env.SMTP_PASSWORD,
            },
            tls: {
              requestCert: false,
              rejectUnauthorized: false,
            },
          } as SMTPTransport.Options,
          defaults: {
            from: mailConfig.from,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailNotifier],
  exports: [EmailNotifier],
})
export class EmailNotifierModule {}
