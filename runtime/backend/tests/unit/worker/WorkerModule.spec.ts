/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mock AppConfiguration
class MockAppConfiguration {
  static getMailerModule = jest.fn();
  static getEventEmitterModule = jest.fn();
  static getDatabaseModule = jest.fn();
  static checkMandatoryFields = jest.fn();
  static checkDatabaseConnection = jest.fn();
  static checkNetworkConnection = jest.fn();
  static checkMandatoryAssets = jest.fn();
  static checkSecuritySettings = jest.fn();
  static checkApplicationScopes = jest.fn();
}
jest.mock("../../../src/AppConfiguration", () => ({
  AppConfiguration: MockAppConfiguration,
}));

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { EventEmitter2 } from '@nestjs/event-emitter';

// internal dependencies
import { MockModel } from "../../mocks/global";
import { WorkerModule } from "../../../src/worker/WorkerModule";
import { ScopeFactory } from "../../../src/common/ScopeFactory";
import { DappConfig } from "../../../src/common/models/DappConfig";
import { AppConfiguration } from "../../../src/AppConfiguration";

describe("worker/WorkerModule", () => {
  let workerModule: WorkerModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerModule,
        EventEmitter2,
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel,
        }, // requirement from StatisticsService
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from StatisticsService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from StatisticsService
      ],
    }).compile();

    workerModule = module.get<WorkerModule>(WorkerModule);
  });

  it("to be defined", () => {
    expect(workerModule).toBeDefined();
  });

  describe("register()", () => {
    it("should call correct methods and return correct result", () => {
      // prepare
      (WorkerModule as any).logger = {
        debug: jest.fn(),
        log: jest.fn(),
      };
      const modules = [
        { name: "processor" },
        { name: "statistics" },
      ]
      const scopeFactoryGetSchedulersCall = jest
        .fn()
        .mockReturnValue(modules);
      const scopeFactoryCreateCall = jest
        .spyOn(ScopeFactory, "create")
        .mockReturnValue({
          getSchedulers: scopeFactoryGetSchedulersCall,
        } as any);
      const expectedResult = {
        module: WorkerModule,
        imports: modules,
      };

      // act
      const result = WorkerModule.register({
        scopes: ["statistics"],
      } as DappConfig);

      // assert
      expect(scopeFactoryCreateCall).toHaveBeenCalledTimes(1);
      expect(scopeFactoryGetSchedulersCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("static checkConfiguration()", () => {
    it("should check all configurations", () => {
      // prepare
      const config = new AppConfiguration();
      const appConfigurationCheckMandatoryFieldsCall = jest
        .spyOn(AppConfiguration, "checkMandatoryFields")
        .mockReturnValue(true);
      const appConfigurationCheckDatabaseConnectionCall = jest
        .spyOn(AppConfiguration, "checkDatabaseConnection")
        .mockReturnValue(true);
      const appConfigurationCheckNetworkConnectionCall = jest
        .spyOn(AppConfiguration, "checkNetworkConnection")
        .mockReturnValue(true);
      const appConfigurationCheckMandatoryAssetsCall = jest
        .spyOn(AppConfiguration, "checkMandatoryAssets")
        .mockReturnValue(true);
      const appConfigurationCheckSecuritySettingsCall = jest
        .spyOn(AppConfiguration, "checkSecuritySettings")
        .mockReturnValue(true);
      const appConfigurationCheckApplicationScopesCall = jest
        .spyOn(AppConfiguration, "checkApplicationScopes")
        .mockReturnValue(true);

      // act
      WorkerModule.checkConfiguration();

      // assert
      expect(appConfigurationCheckMandatoryFieldsCall).toHaveBeenNthCalledWith(1, config);
      expect(appConfigurationCheckDatabaseConnectionCall).toHaveBeenNthCalledWith(1, config);
      expect(appConfigurationCheckNetworkConnectionCall).toHaveBeenNthCalledWith(1, config);
      expect(appConfigurationCheckMandatoryAssetsCall).toHaveBeenNthCalledWith(1, config);
      expect(appConfigurationCheckSecuritySettingsCall).toHaveBeenNthCalledWith(1, config);
      expect(appConfigurationCheckApplicationScopesCall).toHaveBeenNthCalledWith(1, config);
    });
  });
});