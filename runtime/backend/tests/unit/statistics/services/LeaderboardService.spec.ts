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
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

// internal dependencies
import { LeaderboardsService } from '../../../../src/statistics/services/LeaderboardsService';
import { MockModel } from '../../../mocks/global';
import { StatisticsDocument, StatisticsModel, StatisticsQuery } from '../../../../src/statistics/models/StatisticsSchema';
import { QueryService } from '../../../../src/common/services/QueryService';
import { PaginatedResultDTO } from '../../../../src/common/models/PaginatedResultDTO';

describe('statistics/LeaderboardService', () => {
  let service: LeaderboardsService;
  let queriesService: QueryService<
    StatisticsDocument,
    StatisticsModel
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardsService,
        QueryService,
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<LeaderboardsService>(LeaderboardsService);
    queriesService = module.get<QueryService<StatisticsDocument, StatisticsModel>>(QueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("find()", () => {
    it("should return correct result", async () => {
      // prepare
      const findCall = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue({} as PaginatedResultDTO<StatisticsDocument>);
      const statisticsQuery = new StatisticsQuery();

      // act
      const result = await service.find(
        new StatisticsQuery(),
      );

      // assert
      expect(findCall).toHaveBeenNthCalledWith(1, statisticsQuery, MockModel);
      expect(result).toStrictEqual({});
    });
  });
});
