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
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import { AlertNotifier } from "../../../../src/notifier/listeners/AlertNotifier";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { NotifierFactory } from "../../../../src/notifier/concerns/NotifierFactory";
import { EmailNotifier } from "../../../../src/notifier/services/EmailNotifier";
import { AlertEvent } from "../../../../src/common/events/AlertEvent";
import { StateService } from "../../../../src/common/services/StateService";
import { MockModel } from "../../../mocks/global";
import { QueryService } from "../../../../src/common/services/QueryService";
import { LogService } from "../../../../src/common/services/LogService";
import { StateDocument, StateQuery } from "../../../../src/common/models/StateSchema";

describe("notifier/AlertNotifier", () => {
  let service: AlertNotifier;
  let configService: ConfigService;
  let notifierFactory: NotifierFactory;
  let stateService: StateService;
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
        NotifierFactory, // requirement from AlertNotifier
        EmailNotifier, // requirement from AlertNotifier
        NetworkService, // requirement from DappHelper
        MailerService, // requirement from EmailNotifier
        StateService, // requirement from AlertNotifier
        QueryService, // requirement from AlertNotifier
        LogService,
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
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        }, // requirement from AlertNotifier
      ],
    }).compile();

    service = module.get<AlertNotifier>(AlertNotifier);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);

    notifierFactory = module.get<NotifierFactory>(NotifierFactory);
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
      const alertEvent: AlertEvent = AlertEvent.create(
        new Date(),
        "warn",
        "test-logger-context",
        "test-message",
        null,
        "test-context"
      );
      const getLastAlertEventCall = jest
        .spyOn((service as any), "getLastAlertEvent")
        .mockResolvedValue({});
      const saveLastAlertEventCall = jest
        .spyOn((service as any), "saveLastAlertEvent")
        .mockResolvedValue(true);

      // act
      await (service as any).handleLogWarnEvent(alertEvent);

      // assert
      expect(getLastAlertEventCall).toHaveBeenCalledTimes(1);
      expect(configServiceGetCall).toHaveBeenCalledTimes(0);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(0);

      expect(saveLastAlertEventCall).toHaveBeenCalledTimes(0);
    });

    it("should run correctly if alertsConfig type includes 'warn' level", async () => {
      // prepare
      jest.clearAllMocks();
      (service as any).alertsConfig = {
        type: ["warn"],
        transport: "mail",
        recipient: "recipient@example.com",
      };
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValueOnce("test-dapp-name")
        .mockReturnValueOnce("test-url");
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
        .mockResolvedValue();
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "warn",
        loggerContext: "test-logger-context",
        message: "test-message",
        context: "test-context",
      };
      const getLastAlertEventCall = jest
        .spyOn((service as any), "getLastAlertEvent")
        .mockResolvedValue({});
      const saveLastAlertEventCall = jest
        .spyOn((service as any), "saveLastAlertEvent")
        .mockResolvedValue(true);

      // act
      await (service as any).handleLogWarnEvent(alertEvent);

      // assert
      expect(getLastAlertEventCall).toHaveBeenCalledTimes(1);
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "dappName");
      expect(notifierSendInternalCall).toHaveBeenNthCalledWith(1, {
        to: "recipient@example.com",
        subject: "[test-dapp-name] WARNING on dApp (test-url) at 1212-02-01 12:00:00",
        context: {
          alertLevel: "WARNING",
          dappUrl: "test-url",
          dateFormat: "1212-02-01 12:00:00",
          details: {
            context: "test-context",
            level: "warn",
            loggerContext: "test-logger-context",
            message: "test-message",
            timestamp: new Date(),
          },
        },
        template: "AlertEmailTemplate",
      });

      expect(saveLastAlertEventCall).toHaveBeenNthCalledWith(1, alertEvent);
    });

    it("should return if event is the same with last notified event", async () => {
      // prepare
      jest.clearAllMocks();
      const configServiceGetCall = jest
        .spyOn(configService, "get")
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "warn",
        loggerContext: "test-logger-context",
        message: "test-message",
        trace: "test-trace",
        context: "test-context",
      } as AlertEvent;
      const getLastAlertEventCall = jest
        .spyOn((service as any), "getLastAlertEvent")
        .mockResolvedValue(alertEvent);
      const saveLastAlertEventCall = jest
        .spyOn((service as any), "saveLastAlertEvent")
        .mockResolvedValue(true);

      // act
      await (service as any).handleLogWarnEvent(alertEvent);

      // assert
      expect(getLastAlertEventCall).toHaveBeenCalledTimes(1);
      expect(configServiceGetCall).toHaveBeenCalledTimes(0);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(0);

      expect(saveLastAlertEventCall).toHaveBeenCalledTimes(0);
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
      const alertEvent: AlertEvent = AlertEvent.create(
        new Date(),
        "error",
        "test-logger-context",
        "test-message",
        "test-trace",
        "test-context"
      );
      const getLastAlertEventCall = jest
        .spyOn((service as any), "getLastAlertEvent")
        .mockResolvedValue({});
      const saveLastAlertEventCall = jest
        .spyOn((service as any), "saveLastAlertEvent")
        .mockResolvedValue(true);

      // act
      await (service as any).handleLogErrorEvent(alertEvent);

      // assert
      expect(getLastAlertEventCall).toHaveBeenCalledTimes(1);
      expect(configServiceGetCall).toHaveBeenCalledTimes(0);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(0);

      expect(saveLastAlertEventCall).toHaveBeenCalledTimes(0);
    });

    it("should run correctly if alertsConfig type includes 'error' level", async () => {
      // prepare
      jest.clearAllMocks();
      (service as any).alertsConfig = {
        type: ["error"],
        transport: "mail",
        recipient: "recipient@example.com",
      };
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue("test-name");
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
        .mockResolvedValue();
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "error",
        loggerContext: "test-logger-context",
        message: "test-message",
        trace: "test-trace",
        context: "test-context",
      } as AlertEvent;
      const getLastAlertEventCall = jest
        .spyOn((service as any), "getLastAlertEvent")
        .mockResolvedValue({});
      const saveLastAlertEventCall = jest
        .spyOn((service as any), "saveLastAlertEvent")
        .mockResolvedValue(true);

      // act
      await (service as any).handleLogErrorEvent(alertEvent);

      // assert
      expect(getLastAlertEventCall).toHaveBeenCalledTimes(1);
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "dappName");
      expect(notifierSendInternalCall).toHaveBeenNthCalledWith(1, {
        to: "recipient@example.com",
        subject: "[test-name] ERROR on dApp (test-name) at 1212-02-01 12:00:00",
        context: {
          alertLevel: "ERROR",
          dappUrl: "test-name",
          dateFormat: "1212-02-01 12:00:00",
          details: {
            context: "test-context",
            level: "error",
            loggerContext: "test-logger-context",
            message: "test-message",
            timestamp: new Date(),
            trace: "test-trace",
          },
        },
        template: "AlertEmailTemplate",
      });

      expect(saveLastAlertEventCall).toHaveBeenNthCalledWith(1, alertEvent);
    });

    it("should return if event is the same with last notified event", async () => {
      // prepare
      jest.clearAllMocks();
      const configServiceGetCall = jest
        .spyOn(configService, "get")
      const notifierSendInternalCall = jest
        .spyOn(notifier, "sendInternal")
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "error",
        loggerContext: "test-logger-context",
        message: "test-message",
        trace: "test-trace",
        context: "test-context",
      } as AlertEvent;
      const getLastAlertEventCall = jest
        .spyOn((service as any), "getLastAlertEvent")
        .mockResolvedValue(alertEvent);
      const saveLastAlertEventCall = jest
        .spyOn((service as any), "saveLastAlertEvent")
        .mockResolvedValue(true);

      // act
      await (service as any).handleLogErrorEvent(alertEvent);

      // assert
      expect(getLastAlertEventCall).toHaveBeenCalledTimes(1);
      expect(configServiceGetCall).toHaveBeenCalledTimes(0);
      expect(notifierSendInternalCall).toHaveBeenCalledTimes(0);

      expect(saveLastAlertEventCall).toHaveBeenCalledTimes(0);
    });
  });

  describe("getLastAlertEvent()", () => {
    it("should return correct result", async () => {
      // prepare
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "error",
        loggerContext: "test-logger-context",
        message: "test-message",
        trace: "test-trace",
        context: "test-context",
      } as AlertEvent;
      const stateData: Record<string, object>[] = [
        undefined,
        null,
        { data: null },
        { data: { lastAlertEvent: null } },
        { data: { lastAlertEvent: alertEvent } },
      ];
      const expectedResults = [
        undefined,
        undefined,
        undefined,
        null,
        alertEvent,
      ];
      for (let i = 0; i < stateData.length; i++) {
        const stateServiceFindOneCall = jest
          .spyOn(stateService, "findOne")
          .mockResolvedValue(stateData[i] as any);

        // act
        const result = await (service as any).getLastAlertEvent();

        // assert
        expect(stateServiceFindOneCall).toHaveBeenNthCalledWith(
          1,
          new StateQuery({ name: AlertNotifier.name } as StateDocument)
        )
        expect(result).toEqual(expectedResults[i]);
      }
    });
  });

  describe("saveLastAlertEvent()", () => {
    it("should run correctly & call updateOne()", async () => {
      // prepare
      const alertEvent: AlertEvent = {
        timestamp: new Date(),
        level: "error",
        loggerContext: "test-logger-context",
        message: "test-message",
        trace: "test-trace",
        context: "test-context",
      } as AlertEvent;
      const stateServiceUpdateOneCall = jest
        .spyOn(stateService, "updateOne")
        .mockResolvedValue({} as StateDocument);

      // act
      await (service as any).saveLastAlertEvent(alertEvent);

      // assert
      expect(stateServiceUpdateOneCall).toHaveBeenNthCalledWith(
        1,
        new StateQuery({ name: AlertNotifier.name } as StateDocument),
        { lastAlertEvent: alertEvent }
      );
    });
  });
});