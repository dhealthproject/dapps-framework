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

// internal dependencies
import { MonthlyScoreAggregation } from "../../../../src/statistics/schedulers/LeaderboardAggregation/MonthlyScoreAggregation";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { ConfigService } from "@nestjs/config";
import { MockModel } from "../../../mocks/global";

describe("statistics/MonthlyScoreAggregation", () => {
  let service: MonthlyScoreAggregation;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
      ],
    }).compile();

    service = module.get<MonthlyScoreAggregation>(MonthlyScoreAggregation);
  });

  describe("createQueryDates()", () => {
    it("should return correct result for normal months", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 8, 25, 10, 10, 10, 10)); // 25/09/2022 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 8, 1))); // 01/09/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 9, 1))); // 01/10/2022 at 00:00:00:000
    });

    it("should return correct result for last month of year", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 11, 25, 10, 10, 10, 10)); // 25/12/2022 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 11, 1))); // 01/12/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2023, 0, 1))); // 01/01/2023 at 00:00:00:000
    });
  });

  describe("generatePeriod()", () => {
    it("should return correct result", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 1, 7, 10, 10, 10, 10)); // 07/02/2022 at 10:10:10:010

      // act
      const result = (service as any).generatePeriod(date);

      // assert
      expect(result).toBe("202202");
    });
  });
});