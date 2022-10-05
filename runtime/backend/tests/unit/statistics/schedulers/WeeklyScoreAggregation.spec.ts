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
import { WeeklyScoreAggregation } from "../../../../src/statistics/schedulers/LeaderboardAggregation/WeeklyScoreAggegation";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { ConfigService } from "@nestjs/config";
import { MockModel } from "../../../mocks/global";
import { StatisticsDocument, StatisticsModel } from "@/statistics/models/StatisticsSchema";

describe("statistics/MonthlyScoreAggregation", () => {
  let service: WeeklyScoreAggregation;
  let queriesService: QueryService<StatisticsDocument, StatisticsModel>;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeeklyScoreAggregation,
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

    service = module.get<WeeklyScoreAggregation>(WeeklyScoreAggregation);
    queriesService = module.get<QueryService<StatisticsDocument, StatisticsModel>>(QueryService);
  });

  describe("createQueryDates()", () => {
    it("should return correct result for normal weeks", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 0, 11, 10, 10, 10, 10)); // Tue 11/01/2022 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 0, 10))); // Mon 10/01/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 0, 17))); // Mon 17/01/2022 at 00:00:00:000
    });

    it("should return correct result for weeks that span from last month", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 8, 2, 10, 10, 10, 10)); // Fri 02/09/2022 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 7, 29))); // Mon 29/08/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 8, 5))); // Mon 05/09/2022 at 00:00:00:000
    });

    it("should return correct result for weeks that span to next month", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 8, 27, 10, 10, 10, 10)); // Tue 27/09/2022 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2022, 8, 26))); // Mon 26/09/2022 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 9, 3))); // Mon 03/10/2022 at 00:00:00:000
    });

    it("should return correct result for weeks that span from last year", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 0, 1, 10, 10, 10, 10)); // Sat 01/01/2022 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2021, 11, 27))); // Mon 27/12/2021 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 0, 3))); // Mon 03/01/2022 at 00:00:00:000
    });

    it("should return correct result for weeks that span to next year", () => {
      // prepare
      const date = new Date(Date.UTC(2021, 11, 28, 10, 10, 10, 10)); // Tue 28/12/2021 at 10:10:10:010

      // act
      const { startDate, endDate } = (service as any).createQueryDates(date);

      // assert
      expect(startDate).toEqual(new Date(Date.UTC(2021, 11, 27))); // Mon 27/12/2021 at 00:00:00:000
      expect(endDate).toEqual(new Date(Date.UTC(2022, 0, 3))); // Mon 03/10/2022 at 00:00:00:000
    });
  });

  describe("generatePeriod()", () => {
    it("should return correct result for normal weeks", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 8, 22, 10, 10, 10, 10)); // 22/09/2022 at 10:10:10:010

      // act
      const result = (service as any).generatePeriod(date);

      // assert
      expect(result).toBe("202209-03");
    });

    it("should return correct result for weeks that span from last month", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 8, 2, 10, 10, 10, 10)); // 02/09/2022 at 10:10:10:010

      // act
      const result = (service as any).generatePeriod(date);

      // assert
      expect(result).toBe("202208-05");
    });

    it("should return correct result for weeks that span from last year", () => {
      // prepare
      const date = new Date(Date.UTC(2022, 0, 2, 10, 10, 10, 10)); // 02/01/2022 at 10:10:10:010

      // act
      const result = (service as any).generatePeriod(date);

      // assert
      expect(result).toBe("202112-04");
    });
  });
});