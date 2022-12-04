/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mock cron dependency
const jobStartCall = jest.fn();
jest.mock('cron', () => {
  return {
    CronJob: jest.fn().mockImplementation(() => {
      return { start: jobStartCall };
    })
  };
});

// external dependencies
import { EventEmitter2 } from "@nestjs/event-emitter";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { SchedulerRegistry } from "@nestjs/schedule/dist/scheduler.registry";
import { MailerService } from "@nestjs-modules/mailer";
import moment from "moment";

// internal dependencies
import { MockModel } from "../../../../../tests/mocks/global";
import { ReportNotifier } from "../../../../../src/notifier/schedulers/ReportNotifier/ReportNotifier";
import { LogService } from "../../../../../src/common/services/LogService";
import { QueryService } from "../../../../../src/common/services/QueryService";
import { LogDocument, LogModel } from "../../../../../src/common/models/LogSchema";
import { StateService } from "../../../../../src/common/services/StateService";
import { NotifierFactory } from "../../../../../src/notifier/concerns/NotifierFactory";
import { DappHelper } from "../../../../../src/common/concerns/DappHelper";
import { EmailNotifier } from "../../../../../src/notifier/services/EmailNotifier";
import { NetworkService } from "../../../../../src/common/services/NetworkService";
import { ReportNotifierStateData } from "../../../../../src/notifier/models/ReportNotifierStateData";
import { WeeklyReportNotifier } from "../../../../../src/notifier/schedulers/ReportNotifier/WeeklyReportNotifier";
import { Notifier } from "../../../../../src/notifier/models/Notifier";

describe("notifier/ReportNotifier", () => {
  let service: ReportNotifier;
  let logger: LogService;
  let configService: ConfigService;
  let queryService: QueryService<LogDocument, LogModel>;
  let stateService: StateService;
  let notifierFactory: NotifierFactory;
  let dappHelper: DappHelper;
  let emailNotifier: Notifier;

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(Date.UTC(2022, 1, 1));
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeeklyReportNotifier,
        {
          provide: getModelToken("Log"),
          useClass: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        EventEmitter2,
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            setModule: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              type: ["warn", "error"],
              transport: "mail",
              period: "W",
              recipient: "recipient@example.com",
            })
          },
        },
        QueryService,
        StateService,
        SchedulerRegistry,
        NotifierFactory,
        DappHelper,
        EmailNotifier,
        NetworkService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<ReportNotifier>(WeeklyReportNotifier);
    logger = module.get<LogService>(LogService);
    configService = module.get<ConfigService>(ConfigService);
    queryService = module.get<QueryService<LogDocument, LogModel>>(QueryService);
    stateService = module.get<StateService>(StateService);
    dappHelper = module.get<DappHelper>(DappHelper);
    emailNotifier = module.get<EmailNotifier>(EmailNotifier);
    notifierFactory = module.get<NotifierFactory>(NotifierFactory);

    (service as any).notifier = emailNotifier;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("get signature()", () => {
    it("should return correct string", () => {
      // act
      const result = (service as any).signature;

      // assert
      expect(result).toBe("ReportNotifier/(D|W|M)");
    });
  });

  describe("getStateData()", () => {
    it("should return correct object", () => {
      // prepare
      const expectedResut = new ReportNotifierStateData();
      expectedResut.lastExecutedAt = new Date().valueOf();

      // act
      const result = (service as any).getStateData();

      // assert
      expect(result).toEqual({
        lastExecutedAt: mockDate.getTime(),
      });
    });
  });

  describe("runScheduler()", () => {
    it("should run correctly and print correct logs", async () => {
      // prepare
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog")
        .mockReturnThis();
      const serviceRunCall = jest
        .spyOn(service, "run")
        .mockResolvedValue();

      // act
      await service.runScheduler();

      // assert
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(
        1,
        "Starting notifier report type: W"
      );
      expect(serviceRunCall).toHaveBeenNthCalledWith(
        1,
        [ "W" ],
        {
          debug: true,
        }
      )
    });

    it("should throw error if notifier is null/undefined", async () => {
      // prepare
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog")
        .mockReturnThis();
      const serviceRunCall = jest
        .spyOn(service, "run")
        .mockResolvedValue();
      (service as any).notifier = null;
      const expectedError = new Error("Report notifer transport is not defined");

      // act
      const result = service.runScheduler();

      // assert
      expect(result).rejects.toThrow(expectedError);
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(
        1,
        "Starting notifier report type: W"
      );
      expect(serviceRunCall).toHaveBeenCalledTimes(0);
    });
  });

  describe("report()", () => {
    it("should use correct configuration and logging", async () => {
      // prepare
      (service as any).state = {
        data: {
          lastExecutedAt: new Date().valueOf()
        }
      }
      jest.spyOn(configService, "get",).mockReturnValue("test-dapp-name");
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog");
      jest.spyOn(dappHelper, "getTimeRange")
        .mockReturnValue({ startDate: new Date(), endDate: new Date()});
      jest.spyOn((service as any), "createLogQuery")
        .mockReturnValue({});
      jest.spyOn(queryService, "aggregate")
        .mockResolvedValue([{
          _id: "test-id",
          timestamp: new Date(),
          level: "warn",
          message: "test-message",
          meta: { key: "value" },
          label: "test-label",
        }] as LogModel);

      // act
      await service.report(
        {
          periodFormat: "W",
          debug: true,
        }
      );

      // assert
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(1, "Starting notifier report type: W");
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(2, `Last notifier report executed at: "1643673600000"`);
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(3, "Found 1 log subjects");
    });

    it("should use correct configuration and logging when if no leaderboard found", async () => {
      // prepare
      (service as any).state = {
        data: {
          lastExecutedAt: new Date().valueOf()
        }
      }
      jest.spyOn(configService, "get",).mockReturnValue("test-dapp-name");
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog");
      jest.spyOn(dappHelper, "getTimeRange")
        .mockReturnValue({ startDate: new Date(), endDate: new Date()});
      jest.spyOn((service as any), "createLogQuery")
        .mockReturnValue({});
      jest.spyOn(queryService, "aggregate")
        .mockResolvedValue([] as any);

      // act
      await service.report(
        {
          periodFormat: "W",
          debug: true,
          quiet: false,
        }
      );

      // assert
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(1, "Starting notifier report type: W");
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(2, `Last notifier report executed at: "1643673600000"`);
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(3, "No log subjects found");
    });

    it("should run correctly", async () => {
      // prepare
      jest.clearAllMocks();
      (service as any).model = MockModel;
      (service as any).state = {
        data: {
          lastExecutedAt: new Date().valueOf()
        }
      }
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValueOnce("test-dapp-name")
        .mockReturnValueOnce("test-url");
      jest.spyOn((service as any), "debugLog");
      const startDate = new Date();
      const endDate = new Date();
      const dappHelperGetTimeRangeCall = jest
        .spyOn(dappHelper, "getTimeRange")
        .mockReturnValue({ startDate, endDate});
      const createLogQueryCall = jest
        .spyOn((service as any), "createLogQuery")
        .mockReturnValue({});
      const results = [{
        _id: "test-id",
        timestamp: new Date(),
        level: "warn",
        message: "test-message",
        meta: { key: "value" },
        label: "test-label",
      }] as LogModel;
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue(results);
      const dappHelperCreateDetailsTableHTMLCall = jest
        .spyOn(dappHelper, "createDetailsTableHTML")
        .mockReturnValue("test-html-content");
      const dateStart = moment(startDate).format("YYYY-MM-DD");
      const dateEnd = moment(endDate).format("YYYY-MM-DD");
      const emailNotifierSendInternalCall = jest
        .spyOn(emailNotifier, "sendInternal")
        .mockResolvedValue(true);

      // act
      await service.report(
        {
          periodFormat: "W",
          debug: true,
          quiet: false,
        }
      );

      // assert
      expect(dappHelperGetTimeRangeCall).toHaveBeenNthCalledWith(1, "W");
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(
        1,
        {},
        MockModel,
      )
      expect(createLogQueryCall).toHaveBeenNthCalledWith(
        1,
        ["warn", "error"],
        startDate,
        endDate,
      )
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "dappName");
      expect(emailNotifierSendInternalCall).toHaveBeenNthCalledWith(
        1,
        {
          to: "recipient@example.com",
          subject: `[test-dapp-name] LOGS REPORT for dApp (test-url) from ${dateStart} to ${dateEnd}`,
          text: `The production logs for test-dapp-name (test-url) from ${dateStart} to ${dateEnd} can be found as an attachment to this email.`,
          html: `The production logs for test-dapp-name (test-url) from <b>${dateStart}</b> to <b>${dateEnd}</b> can be found as an attachment to this email.`,
          attachments: [
            {
              // binary buffer as an attachment
              filename: "logs.html",
              content: Buffer.from(
                `<b>Logs for test-url between ${dateStart} - ${dateEnd}: </b><br /><br /> test-html-content`,
                "utf-8",
              ),
            },
          ],
        }
      );
      expect(dappHelperCreateDetailsTableHTMLCall).toHaveBeenNthCalledWith(1, results);
    });
  });

  describe("createLogQuery()", () => {
    it("should return correct result", () => {
      // prepare
      const levels = ["warn", "error"];
      const startDate = new Date();
      const endDate = new Date();

      // act
      const result = (service as any).createLogQuery(levels, startDate, endDate);

      // assert
      expect(result).toEqual([
        {
          $match: {
            timestamp: {
              $gte: startDate,
              $lt: endDate,
            },
            level: {
              $in: levels,
            }
          },
        },
      ]);
    });
  });

  describe("parseCollection", () => {
    it("should return correct resullt", () => {
      // act
      const result = (service as any).parseCollection("test-collection-options");

      // assert
      expect(result).toBe("test-collection-options");
    });
  });

  describe("runWithOptions", () => {
    it("should call report()", async () => {
      // prepare
      const reportCall = jest
        .spyOn((service as any), "report")
      const notifierCommandOptions = {
        periodFormat: "W",
      }

      // act
      await (service as any).runWithOptions(notifierCommandOptions);

      // assert
      expect(reportCall).toHaveBeenNthCalledWith(1, notifierCommandOptions);
    });
  });
});