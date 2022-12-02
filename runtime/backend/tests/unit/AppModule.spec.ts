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
import { EventEmitter2 } from '@nestjs/event-emitter';

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
import { CipherService } from "../../src/common/services/CipherService";

describe("AppModule", () => {
  let appModule: AppModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppModule,
        AppService, // requirement from AppModule
        AppController, // requirement from AppModule
        AuthService, // requirement from AppModule 
        ConfigService, // requirement from AppService
        OAuthService, // requirement from AppModule
        CipherService, // requirement from OAuthService
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        QueryService, // requirement from AccountsService
        EventEmitter2,
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel,
        }, // requirement from OAuthService
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AccountsService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from ChallengesService
      ],
    }).compile();

    appModule = module.get<AppModule>(AppModule);
  });

  it("should be defined", () => {
    expect(appModule).toBeDefined();
  });

  describe("register()", () => {
    it("should call correct methods and return correct result", () => {
      // prepare
      (AppModule as any).logger = {
        debug: jest.fn(),
        log: jest.fn(),
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