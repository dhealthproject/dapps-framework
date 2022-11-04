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
import { MailerService } from "@nestjs-modules/mailer";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { EmailNotifier } from "../../../../src/notifier/services/EmailNotifier";


describe("notifier/EmailNotifier", () => {
  let service: EmailNotifier;

  let sendMailCall = jest.fn().mockResolvedValue(true);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailNotifier,
        {
          provide: MailerService,
          useValue: {
            sendMail: sendMailCall,
          },
        },
      ],
    }).compile();

    service = module.get<EmailNotifier>(EmailNotifier);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sendInternal()", () => {
    it("should call sendMail() from mailerService", async () => {
      // act
      await service.sendInternal({});

      // assert
      expect(sendMailCall).toHaveBeenNthCalledWith(1, {});
    });
  });

  describe("sendInternal()", () => {
    it("should call sendMail() from mailerService", async () => {
      // act
      await service.sendPublic({});

      // assert
      expect(sendMailCall).toHaveBeenNthCalledWith(1, {});
    });
  });
});