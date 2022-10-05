import { LeaderboardsService } from '../../../../src/statistics/services/LeaderboardsService';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MockModel } from '../../../mocks/global';
import { StatisticsDocument, StatisticsModel, StatisticsQuery } from '../../../../src/statistics/models/StatisticsSchema';
import { QueryService } from '../../../../src/common/services/QueryService';
import { PaginatedResultDTO } from '../../../../src/common/models/PaginatedResultDTO';
import { QueryParameters } from '@/classes';

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
