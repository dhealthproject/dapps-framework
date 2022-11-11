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
import { JwtService } from '@nestjs/jwt';
import { Account } from '@dhealth/sdk';

// internal dependencies
import { MockModel } from '../../../mocks/global';
import { AccountDocument } from '../../../../src/common/models/AccountSchema';
import { PaginatedResultDTO } from '../../../../src/common/models/PaginatedResultDTO';
import { AccountsService } from '../../../../src/common/services/AccountsService';
import { AuthService } from '../../../../src/common/services/AuthService';
import { ChallengesService } from '../../../../src/common/services/ChallengesService';
import { NetworkService } from '../../../../src/common/services/NetworkService';
import { QueryService } from '../../../../src/common/services/QueryService';
import { StatisticsDTO } from '../../../../src/statistics/models/StatisticsDTO';
import {
  Statistics,
  StatisticsDocument,
  StatisticsQuery,
} from '../../../../src/statistics/models/StatisticsSchema';
import { LeaderboardsController } from '../../../../src/statistics/routes/LeaderboardsController';
import { StatisticsService } from '../../../../src/statistics/services/StatisticsService';
import { AccountSessionsService } from '../../../../src/common/services/AccountSessionsService';

describe('statistics/LeaderboardsController', () => {
  let controller: LeaderboardsController;
  let statisticsService: StatisticsService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardsController],
      providers: [
        AuthService,
        QueryService,
        AccountsService,
        AccountSessionsService,
        ConfigService,
        NetworkService,
        ChallengesService,
        StatisticsService,
        JwtService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        }, // requirement from StatisticsService
      ],
    }).compile();

    controller = module.get<LeaderboardsController>(LeaderboardsController);
    authService = module.get<AuthService>(AuthService);
    statisticsService = module.get<StatisticsService>(StatisticsService);
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
        .spyOn(statisticsService, "find")
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
    const statisticsDoc = {
      address: "fakeAddress",
      type: "leaderboard",
      amount: 123,
      position: 1,
      period: "2022-46",
      periodFormat: "W",
    };

    it("should call correct method and respond with DTO", async () => {
      // prepare
      // mock authentication
      const accountDoc = new Account();
      (accountDoc as any).address = "fakeAddress";
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue(accountDoc as any as AccountDocument);
      // mock finder/searcher results
      const expectToFetchDocuments = new PaginatedResultDTO<StatisticsDocument>(
        [statisticsDoc as StatisticsDocument],
        { pageNumber: 1, pageSize: 20, total: 1 },
      );
      const expectToMapToOneDTO = statisticsDoc as StatisticsDTO;
      const serviceFindMock = jest
        .spyOn(statisticsService, "find")
        .mockResolvedValue(expectToFetchDocuments);

        // act
      const result = await (controller as any).findByUser({} as Request, {
        address: "fakeAddress",
        period: "2022-46",
        periodFormat: "W",
      });

      // assert
      expect(authServiceGetAccountCall).toBeCalledTimes(1);
      expect(serviceFindMock).toBeCalledTimes(1);
      expect(serviceFindMock).toBeCalledWith(
        new StatisticsQuery({
          type: "leaderboard",
          address: "fakeAddress",
          period: "2022-46",
          periodFormat: "W",
        } as StatisticsDocument),
      );
      expect(result).toEqual(expectToMapToOneDTO);
    });
  });
});
