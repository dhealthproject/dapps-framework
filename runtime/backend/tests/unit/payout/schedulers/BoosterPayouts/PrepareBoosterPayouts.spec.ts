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
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import { MockModel } from "../../../../mocks/global";

// common scope
import { StateService } from "../../../../../src/common/services/StateService";
import { QueryService } from "../../../../../src/common/services/QueryService";
import { LogService } from "../../../../../src/common/services/LogService";
import { AccountDocument, AccountModel, AccountQuery } from "../../../../../src/common/models/AccountSchema";

// discovery scope
import { AssetsService } from "../../../../../src/discovery/services/AssetsService";

// payout scope
import { PayoutsService } from "../../../../../src/payout/services/PayoutsService";
import { SignerService } from "../../../../../src/payout/services/SignerService";
import { MathService } from "../../../../../src/payout/services/MathService";
import { AccountSessionsService } from "../../../../../src/common/services/AccountSessionsService";

import { PrepareBoosterPayouts } from "../../../../../src/payout/schedulers/BoosterPayouts/PrepareBoosterPayouts";
import { AssetDocument, AssetQuery } from "../../../../../src/discovery/models/AssetSchema";

class MockPrepareBoosterPayout extends PrepareBoosterPayouts {
  protected get minReferred(): number {
    return 10;
  }
  protected get command(): string {
    return "MockPrepareBossterPayout";
  }
  public runAsScheduler = jest.fn();
}

describe("payout/PrepareBoost5Payouts", () => {
  let command: MockPrepareBoosterPayout;
  let assetsService: AssetsService;
  let queryService: QueryService<
    AccountDocument,
    AccountModel
  >;

  let logger: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockPrepareBoosterPayout,
        ConfigService,
        StateService,
        QueryService,
        PayoutsService,
        SignerService,
        AssetsService,
        MathService,
        EventEmitter2,
        AccountSessionsService,
        {
          provide: getModelToken("Payout"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Asset"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            setModule: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        },
      ]
    }).compile();

    command = module.get<MockPrepareBoosterPayout>(MockPrepareBoosterPayout);
    assetsService = module.get<AssetsService>(AssetsService);
    queryService = module.get<QueryService<AccountDocument, AccountModel>>(QueryService);

    logger = module.get<LogService>(LogService);
  });

  it("should be defined", () => {
    expect(command).toBeDefined();
  });

  describe("verifyAttributionAllowance()", () => {
    it("should return false if the booster asset already exists for user address", async () => {
      // prepare
      const assetsServiceExistsCall = jest
        .spyOn(assetsService, "exists")
        .mockResolvedValue(true);
      (command as any).boosterAsset = {
        mosaicId: "test-mosaicId",
      };
      
      // act
      const result = await (command as any).verifyAttributionAllowance({
        address: "test-address",
      });
      
      // assert
      expect(result).toBe(false);
      expect(assetsServiceExistsCall).toHaveBeenNthCalledWith(
        1,
        new AssetQuery({
          userAddress: "test-address",
          mosaicId: "test-mosaicId",
        } as AssetDocument),
      );
    });

    it("should return true if the booster asset doesn't exist for user address", async () => {
      // prepare
      const assetsServiceExistsCall = jest
        .spyOn(assetsService, "exists")
        .mockResolvedValue(false);
      (command as any).boosterAsset = {
        mosaicId: "test-mosaicId",
      };
      
      // act
      const result = await (command as any).verifyAttributionAllowance({
        address: "test-address",
      });
      
      // assert
      expect(result).toBe(true);
      expect(assetsServiceExistsCall).toHaveBeenNthCalledWith(
        1,
        new AssetQuery({
          userAddress: "test-address",
          mosaicId: "test-mosaicId",
        } as AssetDocument),
      );
    });
  });

  describe("fetchSubjects()", () => {
    it("should run correctly and return correct result", async () => {
      // prepare
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([
          { _id: { referredBy: "test-referrer" }, count: 10 },
        ] as any);
      const queryServiceFindOneCall = jest
        .spyOn(queryService, "findOne")
        .mockResolvedValue({ address: "test-referrer" } as AccountDocument);
      const verifyAttributionAllowanceCall = jest
        .spyOn((command as any), "verifyAttributionAllowance")
        .mockResolvedValue(true);
      const expectedResult = [{ address: "test-referrer" }];

      // act
      const result = await (command as any).fetchSubjects();

      // assert
      expect(result).toEqual(expectedResult);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(
        1,
        [
          {
            $match: {
              referredBy: { $exists: true },
            },
          },
          {
            $group: {
              _id: {
                referredBy: "$referredBy",
              },
              count: { $sum: 1 },
            },
          },
        ],
        MockModel,
      );
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new AccountQuery({ address: "test-referrer" } as AccountDocument),
        MockModel,
      );
      expect(verifyAttributionAllowanceCall).toHaveBeenNthCalledWith(
        1,
        { address: "test-referrer" },
      );
    });

    it("should disregard if address is null", async () => {
      // prepare
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([
          { _id: { referredBy: null }, count: 10 },
        ] as any);
      const queryServiceFindOneCall = jest
        .spyOn(queryService, "findOne")
        .mockResolvedValue({ address: "test-referrer" } as AccountDocument);
      const verifyAttributionAllowanceCall = jest
        .spyOn((command as any), "verifyAttributionAllowance")
        .mockResolvedValue(true);
      const expectedResult: AccountDocument[] = [];

      // act
      const result = await (command as any).fetchSubjects();

      // assert
      expect(result).toEqual(expectedResult);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(
        1,
        [
          {
            $match: {
              referredBy: { $exists: true },
            },
          },
          {
            $group: {
              _id: {
                referredBy: "$referredBy",
              },
              count: { $sum: 1 },
            },
          },
        ],
        MockModel,
      );
      expect(queryServiceFindOneCall).toHaveBeenCalledTimes(0);
      expect(verifyAttributionAllowanceCall).toHaveBeenCalledTimes(0);
    });

    it("should disregard if referrals count doesn't equal minReferred", async () => {
      // prepare
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([
          { _id: { referredBy: "test-referrer" }, count: 9 },
        ] as any);
      const queryServiceFindOneCall = jest
        .spyOn(queryService, "findOne")
        .mockResolvedValue({ address: "test-referrer" } as AccountDocument);
      const verifyAttributionAllowanceCall = jest
        .spyOn((command as any), "verifyAttributionAllowance")
        .mockResolvedValue(true);
      const expectedResult: AccountDocument[] = [];

      // act
      const result = await (command as any).fetchSubjects();

      // assert
      expect(result).toEqual(expectedResult);
      expect(queryServiceAggregateCall).toHaveBeenNthCalledWith(
        1,
        [
          {
            $match: {
              referredBy: { $exists: true },
            },
          },
          {
            $group: {
              _id: {
                referredBy: "$referredBy",
              },
              count: { $sum: 1 },
            },
          },
        ],
        MockModel,
      );
      expect(queryServiceFindOneCall).toHaveBeenCalledTimes(0);
      expect(verifyAttributionAllowanceCall).toHaveBeenCalledTimes(0);
    });

    it("should throw error if error was caught", () => {
      // prepare
      const queryServiceAggregateCall = jest
        .spyOn(queryService, "aggregate")
        .mockResolvedValue([
          { _id: { referredBy: "test-referrer" }, count: 10 },
        ] as any);
      const queryServiceFindOneCall = jest
        .spyOn(queryService, "findOne")
        .mockResolvedValue({ address: "test-referrer" } as AccountDocument);
      const expectedError = new Error("error");
      const verifyAttributionAllowanceCall = jest
        .spyOn((command as any), "verifyAttributionAllowance")
        .mockRejectedValue(expectedError);

      // act
      const result = (command as any).fetchSubjects();

      // assert
      expect(result).rejects.toThrow(expectedError);
    });
  });
});