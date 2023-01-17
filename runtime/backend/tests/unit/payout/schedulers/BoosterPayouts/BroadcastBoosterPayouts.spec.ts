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

// internal dependencies
import { BroadcastBoosterPayouts } from "../../../../../src/payout/schedulers/BoosterPayouts/BroadcastBoosterPayouts";
import { StateService } from "../../../../../src/common/services/StateService";
import { QueryService } from "../../../../../src/common/services/QueryService";
import { PayoutsService } from "../../../../../src/payout/services/PayoutsService";
import { SignerService } from "../../../../../src/payout/services/SignerService";
import { NetworkService } from "../../../../../src/common/services/NetworkService";
import { ActivitiesService } from "../../../../../src/users/services/ActivitiesService";
import { LogService } from "../../../../../src/common/services/LogService";
import { AssetsService } from "../../../../../src/discovery/services/AssetsService";
import { MockModel } from "../../../../mocks/global";
import { PayoutDocument, PayoutQuery } from "../../../../../src/payout/models/PayoutSchema";
import { PayoutState } from "../../../../../src/payout/models/PayoutStatusDTO";
import { PaginatedResultDTO } from "../../../../../src/common/models/PaginatedResultDTO";

describe("payout/BroadcastBoosterPayouts", () => {
  let command: BroadcastBoosterPayouts;
  let payoutsService: PayoutsService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastBoosterPayouts,
        ConfigService,
        StateService,
        QueryService,
        PayoutsService,
        SignerService,
        NetworkService,
        ActivitiesService,
        LogService,
        AssetsService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Payout"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Asset"),
          useValue: MockModel,
        },
      ]
    }).compile();

    command = module.get<BroadcastBoosterPayouts>(BroadcastBoosterPayouts);
    payoutsService = module.get<PayoutsService>(PayoutsService);
    logService = module.get<LogService>(LogService);
  });
  
  it("should be defined", () => {
    expect(command).toBeDefined();
  });

  describe("get signature()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).signature;

      // assert
      expect(result).toBe("BroadcastBoosterPayouts");
    });
  });

  describe("get collection()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).collection;

      // assert
      expect(result).toBe("accounts");
    });
  });

  describe("countSubjects()", () => {
    it("should call and return result of count() from PayoutsService", async () => {
      // prepare
      const payoutsServiceCountCall  = jest
        .spyOn(payoutsService, "count")
        .mockResolvedValue(1);

      // act
      const result = await (command as any).countSubjects();

      // assert
      expect(result).toBe(1);
      expect(payoutsServiceCountCall).toHaveBeenNthCalledWith(
        1,
        new PayoutQuery({
          payoutState: PayoutState.Prepared,
          subjectCollection: "accounts",
        } as PayoutDocument),
      );
    });
  });

  describe("fetchSubjects()", () => {
    it("should call and return result of find() from PayoutsService", async () => {
      // prepare
      const expectedResult = { data: {} } as PaginatedResultDTO<PayoutDocument>;
      const payoutsServiceFindCall = jest
        .spyOn(payoutsService, "find")
        .mockResolvedValue(expectedResult);

      // act
      const result = await (command as any).fetchSubjects(10);

      // assert
      expect(payoutsServiceFindCall).toHaveBeenNthCalledWith(
        1,
        new PayoutQuery(
          {
            payoutState: PayoutState.Prepared,
            subjectCollection: "accounts",
          } as PayoutDocument,
          {
            pageNumber: 1,
            pageSize: 10,
            sort: "createdAt",
            order: "asc",
          },
        ),
      )
      expect(result).toEqual(expectedResult.data);
    });
  });

  describe("runAsScheduler()", () => {
    it("shoud run correctly and call correct methods", async () => {
      // prepare
      const logServiceSetModuleCall = jest
        .spyOn(logService, "setModule");
      const debugLogCall = jest
        .spyOn((command as any), "debugLog");
      const runCall = jest
        .spyOn(command, "run").mockResolvedValue();

      // act
      await command.runAsScheduler();

      // assert
      expect(logServiceSetModuleCall).toHaveBeenNthCalledWith(1, "payout/BroadcastBoosterPayouts");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, "Starting payout broadcast for boosters");
      expect(runCall).toHaveBeenNthCalledWith(
        1,
        ["accounts"],
        {
          maxCount: 3,
          debug: true,
        }
      )
    });
  });
});