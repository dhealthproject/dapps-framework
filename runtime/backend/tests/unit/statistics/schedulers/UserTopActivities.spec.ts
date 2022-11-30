/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { TestingModule, Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

import { UserTopActivities } from "../../../../src/statistics/schedulers/UserTopActivities/UserTopActivities";
import { QueryService } from "../../../../src/common/services/QueryService";
import {
  StatisticsDocument,
  StatisticsModel,
  StatisticsQuery,
} from "../../../../src/statistics/models/StatisticsSchema";
import { StateService } from "../../../../src/common/services/StateService";
import { StatisticsService } from "../../../../src/statistics/services/StatisticsService";
import { LogService } from "../../../../src/common/services/LogService";
import { SchedulerRegistry } from "@nestjs/schedule";
import { MockModel } from "../../../mocks/global";

describe("statistics/UserTopActivities", () => {
  let service: UserTopActivities;
  let queryService: QueryService<StatisticsDocument, StatisticsModel>;
  let statesService: StateService;
  let statisticsService: StatisticsService;
  let logService: LogService;

  let mockDate: Date;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserTopActivities,
        QueryService,
        StateService,
        SchedulerRegistry,
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
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

    service = module.get<UserTopActivities>(UserTopActivities);
    queryService =
      module.get<QueryService<StatisticsDocument, StatisticsModel>>(
        QueryService,
      );
    statesService = module.get<StateService>(StateService);
    statisticsService = module.get<StatisticsService>(StatisticsService);
    logService = module.get<LogService>(LogService);
    statesService = module.get<StateService>(StateService);

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("get signature()", () => {
      it("should return correct string", () => {
        // act
        const result = (service as any).signature;

        // assert
        expect(result).toBe("UserTopActivitiesAggregation");
      });
    });
  });
});
