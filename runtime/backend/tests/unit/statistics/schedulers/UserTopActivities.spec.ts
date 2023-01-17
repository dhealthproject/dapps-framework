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
import { UserTopActivities } from "../../../../src/statistics/schedulers/UserTopActivities/UserTopActivities";
import { StatisticsService } from "../../../../src/statistics/services/StatisticsService";
import { LogService } from "../../../../src/common/services/LogService";
import { StatisticsCommandOptions } from "../../../../src/statistics/schedulers/StatisticsCommand";

describe("statistics/UserTopActivities", () => {
  let service: UserTopActivities;
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
        UserTopActivities,
        SchedulerRegistry, // requirement from UserTopActivities
        StateService, // requirement from UserTopActivities
        QueryService, // requirement from UserTopActivities
        StatisticsService, // requirement from UserTopActivities
        EventEmitter2, // requirement from UserTopActivities
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        }, // requirement from UserTopActivities
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        }, // requirement from UserTopActivities
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        }, // requirement from UserTopActivities
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            setModule: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        }, // requirement from UserTopActivities
      ],
    }).compile();

    service = module.get<UserTopActivities>(UserTopActivities);
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
      expect(result).toBe("UserTopActivities");
    });
  });

  describe("get signature()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = "UserTopActivities";

      // act
      const result = (service as any).signature;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("aggregate()", () => {
    it("should run correctly and return correct result", async () => {
      // prepare
      const createAggregationQueryCall = jest
        .spyOn((service as any), "createAggregationQuery")
        .mockResolvedValue({});
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([
          { _id: { address: "test-address", sportType: "test-sport" } }
        ] as any);
      const debugLogCall = jest
        .spyOn((service as any), "debugLog");
      const getNextPeriodCall = jest
        .spyOn((service as any), "getNextPeriod")
        .mockReturnValue("test-getNextPeriod");
      const statisticsServiceFindOneCall = jest
        .spyOn(statisticsService, "findOne")
        .mockResolvedValue({} as StatisticsDocument);
      const statisticsServiceCreateOrUpdateCall = jest
        .spyOn(statisticsService, "createOrUpdate")
        .mockResolvedValue({} as StatisticsDocument);

      // act
      await service.aggregate({ debug: true } as StatisticsCommandOptions);

      // assert
      expect(createAggregationQueryCall).toHaveBeenCalledTimes(1);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(1, {}, MockModel);
      expect(debugLogCall).toHaveBeenNthCalledWith(1, "Found 1 aggregation subjects");
      expect(getNextPeriodCall).toHaveBeenNthCalledWith(1, new Date());
      expect(statisticsServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new StatisticsQuery({
          address: "test-address",
          period: "test-getNextPeriod",
          periodFormat: "D",
          type: "user",
        } as StatisticsDocument)
      );
      expect(statisticsServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        new StatisticsQuery({
          address: "test-address",
          period: "test-getNextPeriod",
          type: "user",
        } as StatisticsDocument),
        {
          periodFormat: "D",
          data: {
            // merge with previous entry if available
            ...{},
            topActivities: ["test-sport"],
          },
        },
      )
    });

    it("should print message if no aggregation subject found", async () => {
      // prepare
      const createAggregationQueryCall = jest
        .spyOn((service as any), "createAggregationQuery")
        .mockResolvedValue({});
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([] as any);
      const debugLogCall = jest
        .spyOn((service as any), "debugLog");
      const getNextPeriodCall = jest
        .spyOn((service as any), "getNextPeriod")
        .mockReturnValue("test-getNextPeriod");
      const statisticsServiceFindOneCall = jest
        .spyOn(statisticsService, "findOne")
        .mockResolvedValue({} as StatisticsDocument);
      const statisticsServiceCreateOrUpdateCall = jest
        .spyOn(statisticsService, "createOrUpdate")
        .mockResolvedValue({} as StatisticsDocument);

      // act
      await service.aggregate({ debug: true } as StatisticsCommandOptions);

      // assert
      expect(createAggregationQueryCall).toHaveBeenCalledTimes(1);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(1, {}, MockModel);
      expect(debugLogCall).toHaveBeenNthCalledWith(1, "No aggregation subjects found");
      expect(getNextPeriodCall).toHaveBeenNthCalledWith(1, new Date());
      expect(statisticsServiceFindOneCall).toHaveBeenCalledTimes(0);
      expect(statisticsServiceCreateOrUpdateCall).toHaveBeenCalledTimes(0);
    });

    it("should not merge with previous entry if it doesn't exist", async () => {
      // prepare
      const createAggregationQueryCall = jest
        .spyOn((service as any), "createAggregationQuery")
        .mockResolvedValue({});
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([
          { _id: { address: "test-address", sportType: "test-sport" } }
        ] as any);
      const debugLogCall = jest
        .spyOn((service as any), "debugLog");
      const getNextPeriodCall = jest
        .spyOn((service as any), "getNextPeriod")
        .mockReturnValue("test-getNextPeriod");
      const statisticsServiceFindOneCall = jest
        .spyOn(statisticsService, "findOne")
        .mockResolvedValue(null);
      const statisticsServiceCreateOrUpdateCall = jest
        .spyOn(statisticsService, "createOrUpdate")
        .mockResolvedValue({} as StatisticsDocument);

      // act
      await service.aggregate({ debug: true } as StatisticsCommandOptions);

      // assert
      expect(createAggregationQueryCall).toHaveBeenCalledTimes(1);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(1, {}, MockModel);
      expect(debugLogCall).toHaveBeenNthCalledWith(1, "Found 1 aggregation subjects");
      expect(getNextPeriodCall).toHaveBeenNthCalledWith(1, new Date());
      expect(statisticsServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new StatisticsQuery({
          address: "test-address",
          period: "test-getNextPeriod",
          periodFormat: "D",
          type: "user",
        } as StatisticsDocument)
      );
      expect(statisticsServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        new StatisticsQuery({
          address: "test-address",
          period: "test-getNextPeriod",
          type: "user",
        } as StatisticsDocument),
        {
          periodFormat: "D",
          data: {
            // merge with previous entry if available
            ...{},
            topActivities: ["test-sport"],
          },
        },
      )
    });
  });

  describe("runAsScheduler()", () => {
    it("should run correctly", async () => {
      // prepare
      const debugLogCall = jest
        .spyOn((service as any), "debugLog");
      const runCall = jest
        .spyOn(service, "run")
        .mockResolvedValue();

      // act
      await service.runAsScheduler();

      // assert
      expect(logger.setModule).toHaveBeenNthCalledWith(1, "statistics/UserTopActivities");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, `Starting user aggregation type: D`);
      expect(runCall).toHaveBeenNthCalledWith(1, ["user"], { debug: false });
    });
  });

  describe("createAggregationQuery()", () => {
    it("should return correct result", async () => {
      // prepare
      const expectedResult = [
        {
          $match: { address: { $exists: true } },
        },
        {
          $group: {
            _id: {
              address: "$address",
              sportType: "$activityData.sport",
            },
            count: { $sum: 1 },
          },
        },
        {
          // sort by count DESC
          $sort: {
            count: -1,
          },
        },
      ];

      // act
      const result = await (service as any).createAggregationQuery();

      // assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getNextPeriod()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = "20220201";

      // act
      const result = (service as any).getNextPeriod(new Date());

      // assert
      expect(result).toBe(expectedResult);
    });
  });
});
