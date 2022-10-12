/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependency mock
const configGetCallMock: any = jest.fn().mockReturnValue({
  daily_score: {
    type: "D",
    collection: "assets",
    fields: ["amount"],
  },
  weekly_score: {
    type: "W",
    collection: "assets",
    fields: ["amount"],
  },
  monthly_score: {
    type: "M",
    collection: "assets",
    fields: ["amount"],
  },
});

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
import { getModelToken } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule/dist/scheduler.registry";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { DailyScoreAggregation } from "../../../../src/statistics/schedulers/LeaderboardAggregation/DailyScoreAggregation";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { StatisticsDocument, StatisticsModel } from "../../../../src/statistics/models/StatisticsSchema";

describe("statistics/DailyScoreAggregation", () => {
  let service: DailyScoreAggregation;
  let queriesService: QueryService<StatisticsDocument, StatisticsModel>;
  let statesService: StateService;
  let configService: ConfigService;
  let logger: Logger;

  let mockDate: Date;
  let module: TestingModule;
  beforeEach(async () => {
    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyScoreAggregation,
        SchedulerRegistry,
        StateService,
        QueryService,
        NetworkService,
        ConfigService,
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Asset"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DailyScoreAggregation>(DailyScoreAggregation);
    queriesService = module.get<QueryService<StatisticsDocument, StatisticsModel>>(QueryService);
    statesService = module.get<StateService>(StateService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);

    (service as any).configService = {
      get: configGetCallMock,
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createQueryDates()", () => {
    beforeEach(() => configGetCallMock.mockClear());

    it("should return correct result for normal days in month", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 1, 1, 10, 10, 10, 10)); // 01/02/2022 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 1, 1))); // 01/02/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 1, 2))); // 02/02/2022 at 00:00:00:000
    });

    it("should return correct result for last day of month", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 0, 31, 10, 0)); // 31/01/2022 at 10:00:00:000

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 0, 31))); // 31/01/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 1, 1))); // 01/02/2022 at 00:00:00:000
    });

    it("should return correct result for last day of year", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 11, 31, 10, 0)); // 31/12/2022 at 10:00:00:000

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 11, 31))); // 31/11/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2023, 0, 1))); // 01/01/2023 at 00:00:00:000
    });
  });

  describe("generatePeriod()", () => {
    beforeEach(() => configGetCallMock.mockClear());

    it("should return correct result", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 1, 1, 10, 10, 10, 10)); // 01/02/2022 at 10:10:10:010

      // act
      const result = (service as any).generatePeriod(date);

      // assert
      expect(result).toBe("20220201");
    });
  });
});