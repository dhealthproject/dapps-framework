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
import { SchedulerRegistry } from "@nestjs/schedule/dist/scheduler.registry";
import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "@nestjs/common";

// mock cron dependency
const jobStartCall = jest.fn();
jest.mock('cron', () => {
  return {
    CronJob: jest.fn().mockImplementation(() => {
      return { start: jobStartCall };
    })
  };
});

// internal dependencies
import { LeaderboardAggregation } from "../../../../src/statistics/schedulers/LeaderboardAggregation/LeaderboardAggregation";
import { DailyScoreAggregation } from "../../../../src/statistics/schedulers/LeaderboardAggregation/DailyScoreAggregation";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { ConfigService } from "@nestjs/config";
import { MockModel } from "../../../mocks/global";
import { StatisticsDocument, StatisticsModel } from "../../../../src/statistics/models/StatisticsSchema";
import { WeeklyScoreAggregation } from "../../../../src/statistics/schedulers/LeaderboardAggregation/WeeklyScoreAggegation";
import { MonthlyScoreAggregation } from "../../../../src/statistics/schedulers/LeaderboardAggregation/MonthlyScoreAggregation";

describe("statistics/LeaderboardAggregation", () => {
  let service: LeaderboardAggregation;
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

    module = await Test.createTestingModule({
      providers: [
        DailyScoreAggregation,
        WeeklyScoreAggregation,
        MonthlyScoreAggregation,
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

    service = module.get<LeaderboardAggregation>(DailyScoreAggregation);
    queriesService = module.get<QueryService<StatisticsDocument, StatisticsModel>>(QueryService);
    statesService = module.get<StateService>(StateService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get command()", () => {
    it("should return correct string", () => {
      // act
      const result = (service as any).command;

      // assert
      expect(result).toBe("LeaderboardAggregation");
    });
  });

  describe("get signature()", () => {
    it("should return correct string", () => {
      // act
      const result = (service as any).signature;

      // assert
      expect(result).toBe("LeaderboardAggregation D|W|M");
    });
  });

  describe("getStateData()", () => {
    it("should return correct object", () => {
      // act
      const result = (service as any).getStateData();

      // assert
      expect(result).toEqual({
        lastExecutedAt: mockDate.getTime(),
      });
    });
  });

  describe("addCronJob()", () => {
    it("should run correctly", () => {
      // prepare
      // clear calls from constructor in test initialization
      jest.clearAllMocks();
      const serviceRunAsSchedulerCall = jest
        .spyOn(Function.prototype, "bind")
        .mockReturnValue(jest.fn());
      const schedulerRegistryAddCronJobCall = jest.fn();
      (service as any).schedulerRegistry = {
        addCronJob: schedulerRegistryAddCronJobCall
      };

      // act
      (service as any).addCronJob("*/1 * * * *");

      // assert
      expect(serviceRunAsSchedulerCall).toHaveBeenCalledTimes(1);
      expect(schedulerRegistryAddCronJobCall).toHaveBeenCalledTimes(1);
      expect(jobStartCall).toHaveBeenCalledTimes(1);
    });
  });

  describe("runAsScheduler()", () => {
    it("should run correctly and print correct logs", async () => {
      // prepare
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog")
        .mockReturnThis();
      const serviceRunCall = jest
        .spyOn(service, "run")
        .mockResolvedValue();

      // act
      await service.runAsScheduler();

      // assert
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(
        1,
        "Starting leaderboard aggregation type: D"
      );
      expect(serviceRunCall).toHaveBeenNthCalledWith(
        1,
        [ "D" ],
        {
          debug: true,
          quiet: false,
        }
      )
    })
  });

  describe("aggregate()", () => {
    it("should use correct configuration and logging", async () => {
      // prepare
      (service as any).logger = logger;
      (service as any).state = {
        data: {
          lastExecutedAt: new Date().valueOf()
        }
      }
      jest.spyOn((service as any), "config", "get").mockReturnValue({
        type: "D",
        collection: "assets",
        fields: ["amount"],
      });
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog");
      jest.spyOn((service as any), "createQueryDates")
        .mockReturnValue({ startDate: new Date(), endDate: new Date()});
      jest.spyOn((service as any), "createAggregationQuery")
        .mockReturnValue({});
      jest.spyOn(queriesService, "aggregate")
        .mockResolvedValue([] as any);
      jest.spyOn((service as any), "generatePeriod")
        .mockReturnValue("test-period-string");

      // act
      await service.aggregate(
        {
          periodFormat: "D",
          debug: true
        }
      );

      // assert
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(1, "Starting leaderboard aggregation");
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(2, `Last leaderboard aggregation executed at: "1643673600000"`);
    });

    it("should run correctly", async () => {
      // prepare
      (service as any).logger = logger;
      (service as any).state = {
        data: {
          lastExecutedAt: new Date().valueOf()
        }
      }
      jest.spyOn((service as any), "config", "get").mockReturnValue({
        type: "D",
        collection: "activities",
        fields: ["amount"],
      });
      const mockDateRange = { startDate: new Date(), endDate: new Date()};
      const serviceCreateQueryDatesCalll = jest
        .spyOn((service as any), "createQueryDates")
        .mockReturnValue(mockDateRange);
      const serviceCreateAggregationQueryCall = jest
        .spyOn((service as any), "createAggregationQuery")
        .mockReturnValue({});
      const queriesServiceAggregateCall = jest
        .spyOn(queriesService, "aggregate")
        .mockResolvedValue([
          { _id: "test-address", amount: 1 }
        ] as any);
      const serviceGeneratePeriodCall = jest
        .spyOn((service as any), "generatePeriod")
        .mockReturnValue("test-period-string");
      const expectedDate = new Date();
      const modelFindOneAndUpdateCall = jest
        .spyOn(MockModel, "findOneAndUpdate")
        .mockReturnValue(Promise.resolve() as any);

      // act
      await service.aggregate(
        {
          periodFormat: "D",
          debug: true
        }
      );

      // assert
      expect(serviceCreateQueryDatesCalll).toHaveBeenNthCalledWith(1, expectedDate);
      expect(serviceCreateAggregationQueryCall).toHaveBeenNthCalledWith(1, expectedDate, expectedDate);
      expect(queriesServiceAggregateCall).toHaveBeenNthCalledWith(1, {}, MockModel);
      expect(serviceGeneratePeriodCall).toHaveBeenNthCalledWith(1, expectedDate);
      expect(modelFindOneAndUpdateCall).toHaveBeenNthCalledWith(
        1,
        {
          type: "leaderboard",
          period: "test-period-string",
          address: "test-address",
        },
        {
          type: "leaderboard",
          periodFormat: "D",
          period: "test-period-string",
          address: "test-address",
          position: 1,
          amount: 1,
        },
        { upsert: true },
      );
    });
  });

  describe("get config", () => {
    it("should return correct config value", () => {
      // prepare
      jest.clearAllMocks();
      const expectedConfig = {
        daily_score: {
          type: "D",
          collection: "daily_collection",
          fields: ["daily_field"],
        },
        weekly_score: {
          type: "W",
          collection: "weekly_collection",
          fields: ["weekly_field"],
        },
        monthly_score: {
          type: "M",
          collection: "monthly_collection",
          fields: ["monthly_field"],
        },
      };
      const types = [
        DailyScoreAggregation,
        WeeklyScoreAggregation,
        MonthlyScoreAggregation,
      ]
      const expectedResults = [
        expectedConfig.daily_score,
        expectedConfig.weekly_score,
        expectedConfig.monthly_score
      ];
      ["D", "W", "M"].forEach((periodFormat, index) => {
        (service as any).periodFormat = periodFormat;
        const configServiceGetCall = jest
          .spyOn(configService, "get")
          .mockReturnValue(expectedConfig);

        // act
        service = module.get<LeaderboardAggregation>(types[index]);
        const result = (service as any).config;

        // assert
        expect(configServiceGetCall).toHaveBeenCalled();
        expect(result).toBe(expectedResults[index]);
      });
    });
  });

  describe("createAggregationQuery()", () => {
    it("should return correct result", () => {
      // prepare
      const config = {
        type: "D",
        collection: "daily_collection",
        fields: ["daily_field"],
      };
      const serviceConfigCall = jest
        .spyOn((service as any), "config", "get")
        .mockReturnValue(config);

      // act
      const result = (service as any).createAggregationQuery(
        mockDate,
        mockDate,
      );

      // assert
      expect(serviceConfigCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          $match: {
            createdAt: {
              $gte: mockDate,
              $lt: mockDate,
            },
          },
        },
        {
          $group: {
            _id: "$userAddress",
            daily_field: { $sum: "$daily_field" },
          },
        },
        { $sort: { daily_field: -1 } },
      ])
    });
  });
});