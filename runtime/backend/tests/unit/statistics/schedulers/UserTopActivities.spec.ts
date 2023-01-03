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
});
