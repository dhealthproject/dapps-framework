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
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import { AlertNotifier } from "../../../../src/notifier/listeners/AlertNotifier";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { NotifierFactory } from "../../../../src/notifier/concerns/NotifierFactory";
import { DappHelper } from "../../../../src/common/concerns/DappHelper";
import { EmailNotifier } from "../../../../src/notifier/services/EmailNotifier";
import { AlertEvent } from "../../../../src/common/events/AlertEvent";

describe("notifier/AlertNotifier", () => {
  let service: AlertNotifier;
  let configService: ConfigService;
  let notifierFactory: NotifierFactory;
  let dappHelper: DappHelper;
  let notifier = { sendInternal: () => Promise.resolve()};

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertNotifier,
        EventEmitter2, // requirement from AlertNotifier
        DappHelper, // requirement from AlertNotifier
        NotifierFactory, // requirement from AlertNotifier
        EmailNotifier, // requirement from AlertNotifier
        ConfigService, // requirement from DappHelper
        NetworkService, // requirement from DappHelper
        MailerService, // requirement from EmailNotifier
        {
          provide: NotifierFactory,
          useValue: {
            getNotifier: jest.fn().mockReturnValue(notifier)
          },
        }, // requirement from AlertNotifier
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              type: ["warn", "error"],
              transport: "mail",
              recipient: "recipient@example.com",
            })
          },
        }, // overwrite of ConfigService
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        }, // overwrite of MailerService
      ],
    }).compile();

    service = module.get<AlertNotifier>(AlertNotifier);
    configService = module.get<ConfigService>(ConfigService);
    notifierFactory = module.get<NotifierFactory>(NotifierFactory);
    dappHelper = module.get<DappHelper>(DappHelper);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("handleLogWarnEvent()", () => {
    it("should run correctly if alertsConfig type doesn't include 'warn' level", async () => {
      // prepare
      jest.clearAllMocks();
      (service as any).alertsConfig = {
        type: ["error"],
      };
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue("test-name");
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
        .mockResolvedValue();
      const dappHelperCreateDetailsTableHTMLCall = jest
        .spyOn(dappHelper, "createDetailsTableHTML")
        .mockReturnValue("test-html-content");
      const alertEvent: AlertEvent = AlertEvent.create(
        new Date(),
        "warn",
        "test-logger-context",
        "test-message",
        null,
        "test-context"
      );

      // act
      await (service as any).handleLogWarnEvent(alertEvent);

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(0);
      expect(dappHelperCreateDetailsTableHTMLCall).toHaveBeenCalledTimes(0);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(0);
    });

    it("should run correctly if alertsConfig type includes 'warn' level", async () => {
      // prepare
      jest.clearAllMocks();
      (service as any).alertsConfig = {
        type: ["warn"],
      };
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue("test-name");
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
        .mockResolvedValue();
      const dappHelperCreateDetailsTableHTMLCall = jest
        .spyOn(dappHelper, "createDetailsTableHTML")
        .mockReturnValue("test-html-content");
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "warn",
        loggerContext: "test-logger-context",
        message: "test-message",
        context: "test-context",
      };

      // act
      await (service as any).handleLogWarnEvent(alertEvent);

      // assert
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "dappName");
      expect(dappHelperCreateDetailsTableHTMLCall).toHaveBeenNthCalledWith(1, [alertEvent]);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleLogErrorEvent()", () => {
    it("should run correctly if alertsConfig type doesn't include 'error' level", async () => {
      // prepare
      jest.clearAllMocks();
      (service as any).alertsConfig = {
        type: ["warn"],
      };
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue("test-name");
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
        .mockResolvedValue();
      const dappHelperCreateDetailsTableHTMLCall = jest
        .spyOn(dappHelper, "createDetailsTableHTML")
        .mockReturnValue("test-html-content");
      const alertEvent: AlertEvent = AlertEvent.create(
        new Date(),
        "error",
        "test-logger-context",
        "test-message",
        "test-trace",
        "test-context"
      );

      // act
      await (service as any).handleLogErrorEvent(alertEvent);

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(0);
      expect(dappHelperCreateDetailsTableHTMLCall).toHaveBeenCalledTimes(0);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(0);
    });

    it("should run correctly if alertsConfig type includes 'error' level", async () => {
      // prepare
      jest.clearAllMocks();
      (service as any).alertsConfig = {
        type: ["error"],
      };
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue("test-name");
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
        .mockResolvedValue();
      const dappHelperCreateDetailsTableHTMLCall = jest
        .spyOn(dappHelper, "createDetailsTableHTML")
        .mockReturnValue("test-html-content");
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "error",
        loggerContext: "test-logger-context",
        message: "test-message",
        trace: "test-trace",
        context: "test-context",
      } as AlertEvent;

      // act
      await (service as any).handleLogErrorEvent(alertEvent);

      // assert
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "dappName");
      expect(dappHelperCreateDetailsTableHTMLCall).toHaveBeenNthCalledWith(1, [alertEvent]);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(1);
    });
  });
});