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
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { NotifierFactory } from "../../../../src/notifier/concerns/NotifierFactory";
import { EmailNotifier } from "../../../../src/notifier/services/EmailNotifier";
import { NotifierType } from "../../../../src/notifier/models/NotifierType";

describe("notifier/NotifierFactory", () => {
  let service: NotifierFactory;
  let emailNotifier: EmailNotifier;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifierFactory,
        EmailNotifier,
        ConfigService,
        {
          provide: MailerService,
          useValue: MailerService,
        },
      ],
    }).compile();

    service = module.get<NotifierFactory>(NotifierFactory);
    emailNotifier = module.get<EmailNotifier>(EmailNotifier);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getNotifier()", () => {
    it("should return correct instance of Notifier", () => {
      // prepare
      const expectedResults = [ null, emailNotifier ];
      [null, NotifierType.MAIL].forEach((transport, index) => {
        // act
        const result = service.getNotifier(transport);

        // assert
        expect(result).toBe(expectedResults[index]);
      });
    });
  });
});