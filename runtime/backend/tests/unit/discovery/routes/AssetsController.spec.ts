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
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { AssetsController } from "../../../../src/discovery/routes/AssetsController";
import { AssetsService } from "../../../../src/discovery/services/AssetsService";
import { AuthService } from "../../../../src/common/services/AuthService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { AssetDocument } from "../../../../src/discovery/models/AssetSchema";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";

describe("discovery/AssetsController", () => {
  let controller: AssetsController;
  let assetsService: AssetsService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        AssetsService,
        AuthService,
        ConfigService,
        QueryService,
        NetworkService,
        AccountsService,
        ChallengesService,
        JwtService,
        {
          provide: getModelToken("Asset"),
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
    }).compile();

    controller = module.get<AssetsController>(AssetsController);
    assetsService = module.get<AssetsService>(AssetsService);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("find()", () => {
    it("should call correct method and respond with DTO", async () => {
      // prepare
      const assetDocResult = {
        data: [ {} as AssetDocument ],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
        isLastPage: jest.fn().mockReturnValue(true),
      };
      const assetsServiceFindCall = jest
        .spyOn(assetsService, "find")
        .mockResolvedValue(assetDocResult);
      const expectedResult = {
        data: assetDocResult.data,
        pagination: assetDocResult.pagination,
      }

      // act
      const result = await (controller as any).find({
        pageNumber: 1,
        pageSize: 1,
      });

      // assert
      expect(assetsServiceFindCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findByUser()", () => {
    it("should call correct method and respond with DTO", async () => {
      // prepare
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue({} as AccountDocument);
      const assetDocResult = {
        data: [ {} as AssetDocument ],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
        isLastPage: jest.fn().mockReturnValue(true),
      };
      const assetsServiceFindCall = jest
        .spyOn(assetsService, "find")
        .mockResolvedValue(assetDocResult);
      const expectedResult = {
        data: assetDocResult.data,
        pagination: assetDocResult.pagination,
      }
      
      // act
      const result = await (controller as any).findByUser(
        {},
        {
          pageNumber: 1,
          pageSize: 20,
        },
      );

      // prepare
      expect(authServiceGetAccountCall).toHaveBeenCalledTimes(1);
      expect(assetsServiceFindCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});