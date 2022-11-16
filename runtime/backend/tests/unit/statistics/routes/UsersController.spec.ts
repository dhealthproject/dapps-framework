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
import { Test, TestingModule } from "@nestjs/testing";;
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AuthService } from "../../../../src/common/services/AuthService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";
import { StatisticsService } from "../../../../src/statistics/services/StatisticsService";
import { UsersController } from "../../../../src/statistics/routes/UsersController";
import { StatisticsDocument } from "../../../../src/statistics/models/StatisticsSchema";

describe("statistics/UsersController", () => {
  let controller: UsersController;
  let statisticsService: StatisticsService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        AuthService, // requirement from UsersController
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        QueryService, // requirement from AuthService
        ConfigService, // requirement from AuthService
        StatisticsService, // requirement from UsersController
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        }, // requirement from StatisticsService
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    statisticsService = module.get<StatisticsService>(StatisticsService);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findByUser()", () => {
    it("should call correct methods and return correct result", async () => {
      // prepare
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue({} as AccountDocument);
      const statisticsServiceFindCall = jest
        .spyOn(statisticsService, "find")
        .mockResolvedValue({
          data: [{} as StatisticsDocument],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1
          },
          isLastPage: () => true,
        });
      const expectedResult = {
        data: [{} as StatisticsDocument],
        pagination: {
          pageNumber: 1,
          pageSize: 100,
          total: 1
        },
      };

      // act
      const result = await (controller as any).findByUser(
        {},
        {
          pageNumber: 1
        }
      );

      // assert
      expect(authServiceGetAccountCall).toHaveBeenCalledTimes(1);
      expect(statisticsServiceFindCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
