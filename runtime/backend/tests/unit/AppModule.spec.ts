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
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import { MockModel } from "../mocks/global";
import { DappConfig } from "../../src/common/models/DappConfig";
import { AppModule } from "../../src/AppModule";
import { ScopeFactory } from "../../src/common/ScopeFactory";
import { AppController } from "../../src/AppController";
import { AppService } from "../../src/AppService";
import { AuthService } from "../../src/common/services/AuthService";
import { OAuthService } from "../../src/common/services/OAuthService";
import { NetworkService } from "../../src/common/services/NetworkService";
import { AccountsService } from "../../src/common/services/AccountsService";
import { ChallengesService } from "../../src/common/services/ChallengesService";
import { QueryService } from "../../src/common/services/QueryService";

describe("AppModule", () => {
  let appModule: AppModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppModule,
        AppService,
        AppController,
        ConfigService,
        AuthService,
        OAuthService,
        NetworkService,
        AccountsService,
        ChallengesService,
        JwtService,
        QueryService,
        {
          provide: getModelToken("AccountIntegration"),
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

    appModule = module.get<AppModule>(AppModule);
  });

  it("to be defined", () => {
    expect(appModule).toBeDefined();
  });

  describe("register()", () => {
    it("should call correct methods and return correct result", () => {
      // prepare
      (AppModule as any).logger = {
        debug: jest.fn(),
      };
      const modules = [
        { name: "testModule1" },
        { name: "testModule2" },
      ]
      const scopeFactoryGetModulesCall = jest
        .fn()
        .mockReturnValue(modules);
      const scopeFactoryCreateCall = jest
        .spyOn(ScopeFactory, "create")
        .mockReturnValue({
          getModules: scopeFactoryGetModulesCall,
        } as any);
      const expectedResult = {
        module: AppModule,
        imports: modules,
        controllers: [AppController],
        providers: [AppService],
      }

      // act
      const result = AppModule.register({} as DappConfig);

      // assert
      expect(scopeFactoryCreateCall).toHaveBeenCalledTimes(1);
      expect(scopeFactoryGetModulesCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});