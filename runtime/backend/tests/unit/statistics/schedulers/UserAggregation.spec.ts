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
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { MockModel } from "../../../mocks/global";
import { StatisticsDocument, StatisticsModel, StatisticsQuery } from "../../../../src/statistics/models/StatisticsSchema";
import { UserAggregation } from "../../../../src/statistics/schedulers/UserAggregation/UserAggregation";
import { StatisticsService } from "../../../../src/statistics/services/StatisticsService";
import { UserAggregationStateData } from "../../../../src/statistics/models/UserAggregationStateData";
import { LogService } from "../../../../src/common/services/LogService";

describe("statistics/UserAggregation", () => {
  let service: UserAggregation;
  let queryService: QueryService<StatisticsDocument, StatisticsModel>;
  let statesService: StateService;
  let statisticsService: StatisticsService;
  let logger: LogService;

  let mockDate: Date;
  let module: TestingModule;
  beforeEach(async () => {
    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    module = await Test.createTestingModule({
      providers: [
        UserAggregation,
        SchedulerRegistry, // requirement from UserAggregation
        StateService, // requirement from UserAggregation
        QueryService, // requirement from UserAggregation
        StatisticsService, // requirement from UserAggregation
        EventEmitter2, // requirement from UserAggregation
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        }, // requirement from UserAggregation
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        }, // requirement from UserAggregation
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        }, // requirement from UserAggregation
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            setModule: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        }, // requirement from UserAggregation
      ],
    }).compile();

    service = module.get<UserAggregation>(UserAggregation);
    queryService = module.get<QueryService<StatisticsDocument, StatisticsModel>>(QueryService);
    statesService = module.get<StateService>(StateService);
    statisticsService = module.get<StatisticsService>(StatisticsService);
    logger = module.get<LogService>(LogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get command()", () => {
    it("should return correct string", () => {
      // act
      const result = (service as any).command;

      // assert
      expect(result).toBe("UserAggregation");
    });
  });

  describe("get signature()", () => {
    it("should return correct string", () => {
      // act
      const result = (service as any).signature;

      // assert
      expect(result).toBe("UserAggregation");
    });
  });

  describe("getStateData()", () => {
    it("should return correct object", () => {
      // prepare
      const expectedResut = new UserAggregationStateData();
      expectedResut.lastExecutedAt = new Date().valueOf();

      // act
      const result = (service as any).getStateData();

      // assert
      expect(result).toEqual({
        lastExecutedAt: mockDate.getTime(),
      });
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
        "Starting user aggregation type: D"
      );
      expect(serviceRunCall).toHaveBeenNthCalledWith(
        1,
        [ "user" ],
        {
          debug: true,
          quiet: false,
        }
      )
    })
  });

  describe("getNextPeriod()", () => {
    it("should use correct YYYYMMDD format for period", () => {
      // act
      const period = (service as any).getNextPeriod(new Date());

      // assert
      expect(period).toBeDefined();
      expect(period).toBe("20220201");
    });
  });

  describe("aggregate()", () => {
    let statisticsCreateOrUpdateMock = jest.fn();
    beforeEach(() => {
      (service as any).logger = logger;
      (service as any).state = {
        data: {
          lastExecutedAt: new Date().valueOf()
        }
      };

      (statisticsService as any).createOrUpdate = statisticsCreateOrUpdateMock;
      (service as any).statisticsService = statisticsService;
    });

    it("should use correct configuration and logging", async () => {
      // prepare
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog");
      jest.spyOn((service as any), "createAggregationQuery")
        .mockReturnValue({});
      jest.spyOn(queryService, "aggregate")
        .mockResolvedValue([{ _id: "test-id", amount: 1 }] as any);
      jest.spyOn((service as any), "getNextPeriod")
        .mockReturnValue("test-period-string");

      // act
      await service.aggregate(
        {
          periodFormat: "D",
          debug: true,
          quiet: false,
        }
      );

      // assert
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(1, `Last user aggregation executed at: "1643673600000"`);
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(2, "Found 1 aggregation subjects");
    });

    it("should use correct configuration and logging given empty leaderboard", async () => {
      // prepare
      const serviceDebugLogCall = jest
        .spyOn((service as any), "debugLog");
      jest.spyOn((service as any), "createAggregationQuery")
        .mockReturnValue({});
      jest.spyOn(queryService, "aggregate")
        .mockResolvedValue([] as any);
      jest.spyOn((service as any), "getNextPeriod")
        .mockReturnValue("test-period-string");

      // act
      await service.aggregate(
        {
          periodFormat: "D",
          debug: true,
          quiet: false,
        }
      );

      // assert
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(1, `Last user aggregation executed at: "1643673600000"`);
      expect(serviceDebugLogCall).toHaveBeenNthCalledWith(2, "No aggregation subjects found");
    });

    it("should run correctly", async () => {
      // prepare
      const serviceCreateAggregationQueryCall = jest
        .spyOn((service as any), "createAggregationQuery")
        .mockReturnValue({});
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([
          {
            _id: "test-address",
            totalAssetsAmount: 123,
            totalSecondsPracticed: 456,
          }
        ] as any);
      const serviceGeneratePeriodCall = jest
        .spyOn((service as any), "getNextPeriod")
        .mockReturnValue("test-period-string");
      const expectedDate = new Date();

      // act
      await service.aggregate(
        {
          periodFormat: "D",
          debug: true
        }
      );

      // assert
      expect(serviceCreateAggregationQueryCall).toHaveBeenCalledTimes(1);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(1, {}, MockModel);
      expect(serviceGeneratePeriodCall).toHaveBeenNthCalledWith(1, expectedDate);
      expect(statisticsCreateOrUpdateMock).toHaveBeenNthCalledWith(
        1,
        new StatisticsQuery({
          type: "user",
          period: "test-period-string",
          address: "test-address",
        } as StatisticsDocument),
        {
          periodFormat: "D",
          amount: 123,
          data: {
            totalEarned: 123,
            totalPracticedMinutes: Math.ceil(456/60),
          },
        },
      );
    });

    it("should group results by address and order by amount desc", async () => {
      // prepare
      const aggregateMocks = [
        {
          _id: "test-address2",
          totalAssetsAmount: 789,
          totalSecondsPracticed: 123,
        },
        {
          _id: "test-address1",
          totalAssetsAmount: 123,
          totalSecondsPracticed: 456,
        },
      ];
      const serviceCreateAggregationQueryCall = jest
        .spyOn((service as any), "createAggregationQuery")
        .mockReturnValue({});
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue(aggregateMocks as any);
      const serviceGeneratePeriodCall = jest
        .spyOn((service as any), "getNextPeriod")
        .mockReturnValue("test-period-string");
      const expectedDate = new Date();

      // act
      await service.aggregate(
        {
          periodFormat: "D",
          debug: true
        }
      );

      // assert
      expect(serviceCreateAggregationQueryCall).toHaveBeenCalledTimes(1);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(1, {}, MockModel);
      expect(serviceGeneratePeriodCall).toHaveBeenNthCalledWith(1, expectedDate);
      expect(statisticsCreateOrUpdateMock).toHaveBeenCalledTimes(2);
      expect(statisticsCreateOrUpdateMock).toHaveBeenNthCalledWith(
        1,
        new StatisticsQuery({
          type: "user",
          period: "test-period-string",
          address: aggregateMocks[0]._id, // <-- uses correct address
        } as StatisticsDocument),
        {
          periodFormat: "D",
          amount: aggregateMocks[0].totalAssetsAmount,
          data: {
            totalEarned: aggregateMocks[0].totalAssetsAmount,
            totalPracticedMinutes: Math.ceil(aggregateMocks[0].totalSecondsPracticed/60),
          },
        },
      );
      expect(statisticsCreateOrUpdateMock).toHaveBeenNthCalledWith(
        2,
        new StatisticsQuery({
          type: "user",
          period: "test-period-string",
          address: aggregateMocks[1]._id, // <-- uses correct address
        } as StatisticsDocument),
        {
          periodFormat: "D",
          amount: aggregateMocks[1].totalAssetsAmount,
          data: {
            totalEarned: aggregateMocks[1].totalAssetsAmount,
            totalPracticedMinutes: Math.ceil(aggregateMocks[1].totalSecondsPracticed/60),
          },
        },
      );
    });
  });

  describe("createAggregationQuery()", () => {
    it("should return correct database aggregate query", () => {
      // act
      const result = (service as any).createAggregationQuery(
        mockDate,
        mockDate,
      );

      // assert
      expect(result).toEqual([
        {
          $match: {
            address: { $exists: true },
          },
        },
        {
          $group: {
            _id: "$address",
            totalAssetsAmount: { $sum: { $sum: "$activityAssets.amount" } },
            totalSecondsPracticed: { $sum: "$activityData.elapsedTime" },
          },
        },
        { $sort: { amount: -1 } },
      ])
    });
  });
});