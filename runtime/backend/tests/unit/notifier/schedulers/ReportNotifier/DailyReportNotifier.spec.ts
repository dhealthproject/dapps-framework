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
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { SchedulerRegistry } from "@nestjs/schedule/dist/scheduler.registry";
import { MailerService } from "@nestjs-modules/mailer";

// internal dependencies
import { DailyReportNotifier } from "../../../../../src/notifier/schedulers/ReportNotifier/DailyReportNotifier";
import { MockModel } from "../../../../../tests/mocks/global";
import { LogService } from "../../../../../src/common/services/LogService";
import { QueryService } from "../../../../../src/common/services/QueryService";
import { StateService } from "../../../../../src/common/services/StateService";
import { NotifierFactory } from "../../../../../src/notifier/concerns/NotifierFactory";
import { DappHelper } from "../../../../../src/common/concerns/DappHelper";
import { EmailNotifier } from "../../../../../src/notifier/services/EmailNotifier";
import { NetworkService } from "../../../../../src/common/services/NetworkService";

describe("notifier/ReportNotifier", () => {
  let service: DailyReportNotifier;

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(Date.UTC(2022, 1, 1));
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyReportNotifier,
        {
          provide: getModelToken("Log"),
          useClass: MockModel,
        },
        {
          provide: getModelToken("State"),
          useClass: MockModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              type: ["warn", "error"],
              transport: "mail",
              period: "D",
              recipient: "recipient@example.com",
            })
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        },
        QueryService,
        StateService,
        SchedulerRegistry,
        NotifierFactory,
        DappHelper,
        EmailNotifier,
        NetworkService,
        LogService,
      ],
    }).compile();

    service = module.get<DailyReportNotifier>(DailyReportNotifier);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("runAsScheduler()", () => {
    it("should call runScheduler()", async () => {
      // prepare
      const runSchedulerCall = jest
        .spyOn(service, "runScheduler")
        .mockResolvedValue();

      // act
      await service.runAsScheduler();

      // assert
      expect(runSchedulerCall).toHaveBeenCalledTimes(1);
    });
  });
});