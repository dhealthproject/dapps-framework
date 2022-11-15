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
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Account } from '@dhealth/sdk';

// internal dependencies
import { AuthService } from '../../../../src/common/services/AuthService';
import { StatisticsService } from '../../../../src/statistics/services/StatisticsService';
import { LeaderboardsController } from '../../../../src/statistics/routes/LeaderboardsController';
import { MockModel } from '../../../mocks/global';
import { QueryService } from '../../../../src/common/services/QueryService';
import { Statistics, StatisticsDocument, StatisticsModel, StatisticsQuery } from '../../../../src/statistics/models/StatisticsSchema';
import { AccountsService } from '../../../../src/common/services/AccountsService';
import { NetworkService } from '../../../../src/common/services/NetworkService';
import { ChallengesService } from '../../../../src/common/services/ChallengesService';
import { PaginatedResultDTO } from '../../../../src/common/models/PaginatedResultDTO';
import { StatisticsDTO } from '../../../../src/statistics/models/StatisticsDTO';
import { AccountDocument } from '../../../../src/common/models/AccountSchema';

describe('statistics/LeaderboardsController', () => {
  let controller: LeaderboardsController;
  let authService: AuthService;
  let leaderboardsService: StatisticsService;
  let queriesService: QueryService<
    StatisticsDocument,
    StatisticsModel
  >;
  let configService: ConfigService;
  let networkService: NetworkService;
  let challengesService: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardsController],
      providers: [
        AuthService,
        QueryService,
        AccountsService,
        ConfigService,
        NetworkService,
        ChallengesService,
        StatisticsService,
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        },
      ],
      imports: [
        JwtModule,
      ],
    }).compile();

    controller = module.get<LeaderboardsController>(LeaderboardsController);
    authService = module.get<AuthService>(AuthService);
    leaderboardsService = module.get<StatisticsService>(StatisticsService);
    queriesService = module.get<QueryService<StatisticsDocument, StatisticsModel>>(QueryService);
    configService = module.get<ConfigService>(ConfigService);
    networkService = module.get<NetworkService>(NetworkService);
    challengesService = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("find()", () => {
    it("should call correct method and respond with DTO", async () => {
      // prepare
      const statisticsDoc = new Statistics();
      (statisticsDoc as any).address = "fakeAddress";
      const expectToFetchDocuments = new PaginatedResultDTO<StatisticsDocument>(
        [statisticsDoc as StatisticsDocument],
        { pageNumber: 1, pageSize: 20, total: 1 },
      );
      const expectToMapToDTOs = new PaginatedResultDTO<StatisticsDTO>(
        [{ address: "fakeAddress" } as StatisticsDTO],
        { pageNumber: 1, pageSize: 20, total: 1 },
      );
      const serviceFindMock = jest
        .spyOn(leaderboardsService, "find")
        .mockResolvedValue(expectToFetchDocuments);

      // act
      const result = await (controller as any).find(
        { address: "fakeAddress" } as any as StatisticsQuery,
      );

      // assert
      expect(serviceFindMock).toBeCalledTimes(1);
      expect(serviceFindMock).toBeCalledWith(
        new StatisticsQuery({ address: "fakeAddress", type: "leaderboard" } as StatisticsDocument),
      );
      expect(result).toEqual(expectToMapToDTOs);
    });
  });

  describe("findByUser()", () => {
    it("should call correct method and respond with DTO", async () => {
      // prepare
      const accountDoc = new Account();
      (accountDoc as any).address = "fakeAddress";
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue(accountDoc as any as AccountDocument);
      const query = { address: "fakeAddress" };
      const request = {} as Request;
      const statisticsDoc = new Statistics();
      (statisticsDoc as any).address = "fakeAddress";
      const expectToFetchDocuments = new PaginatedResultDTO<StatisticsDocument>(
        [statisticsDoc as StatisticsDocument],
        { pageNumber: 1, pageSize: 20, total: 1 },
      );
      const expectToMapToDTOs = new PaginatedResultDTO<StatisticsDTO>(
        [{ address: "fakeAddress" } as StatisticsDTO],
        { pageNumber: 1, pageSize: 20, total: 1 },
      );
      const serviceFindMock = jest
        .spyOn(leaderboardsService, "find")
        .mockResolvedValue(expectToFetchDocuments);

        // act
      const result = await (controller as any).findByUser(request, query);

      // assert
      expect(authServiceGetAccountCall).toBeCalledTimes(1);
      expect(serviceFindMock).toBeCalledTimes(1);
      expect(serviceFindMock).toBeCalledWith(
        new StatisticsQuery({ type: "leaderboard", address: "fakeAddress" } as StatisticsDocument),
      );
      expect(result).toEqual(expectToMapToDTOs);
    });
  });
});
