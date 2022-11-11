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
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { AuthService } from "../../../../src/common/services/AuthService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { ActivitiesService } from "../../../../src/users/services/ActivitiesService";
import { ActivitiesController } from "../../../../src/users/routes/ActivitiesController";
import { ActivityDocument } from "../../../../src/users/models/ActivitySchema";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";

describe("users/ActivitiesController", () => {
  let controller: ActivitiesController;
  let activitiesService: ActivitiesService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [ 
        AuthService, // requirement from ActivitiesService
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        AccountSessionsService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        QueryService, // requirement from AuthService
        ConfigService, // requirement from AuthService
        ActivitiesService, // requirement from ActivitiesController
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        }, // requirement from ActivitiesService
      ]
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("find()", () => {
    it("should call correct methods and return correct result", async () => {
      // prepare
      const activitiesServiceFindCall = jest
        .spyOn(activitiesService, "find")
        .mockResolvedValue({
          data: [{} as ActivityDocument],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1
          },
          isLastPage: () => true,
        });
      const expectedResult = {
        data: [{} as ActivityDocument],
        pagination: {
          pageNumber: 1,
          pageSize: 100,
          total: 1
        },
      };

      // act
      const result = await (controller as any).find({
        pageNumber: 1
      });

      // assert
      expect(activitiesServiceFindCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findByUser()", () => {
    it("should call correct methods and return correct result", async () => {
      // prepare
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue({} as AccountDocument);
      const activitiesServiceFindCall = jest
        .spyOn(activitiesService, "find")
        .mockResolvedValue({
          data: [{} as ActivityDocument],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1
          },
          isLastPage: () => true,
        });
      const expectedResult = {
        data: [{} as ActivityDocument],
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
      expect(activitiesServiceFindCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
