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
import { MockModel } from "../../mocks/global";
import { WorkerModule } from "../../../src/worker/WorkerModule";
import { ScopeFactory } from "../../../src/common/ScopeFactory";
import { DappConfig } from "../../../src/common/models/DappConfig";

describe("worker/WorkerModule", () => {
  let workerModule: WorkerModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerModule,
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
});