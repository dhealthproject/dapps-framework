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
import { PayoutCommandOptions } from "../../../../../src/payout/schedulers/PayoutCommand";

import { PrepareBoost15Payouts } from "../../../../../src/payout/schedulers/BoosterPayouts/PrepareBoost15Payouts";

describe("payout/PrepareBoost5Payouts", () => {
  let command: PrepareBoost15Payouts;
  let logger: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrepareBoost15Payouts,
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

    command = module.get<PrepareBoost15Payouts>(PrepareBoost15Payouts);
    logger = module.get<LogService>(LogService);
  });

  it("should be defined", () => {
    expect(command).toBeDefined();
  });

  describe("get command()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).command;

      // assert
      expect(result).toBe("PrepareBoost15Payouts");
    });
  });

  describe("get minReferred()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = 100;

      // act
      const result = (command as any).minReferred;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("runAsScheduler()", () => {
    it("should call correct methods and run correctly", async () => {
      // prepare
      const loggerSetModuleCall = jest
        .spyOn(logger, "setModule")
        .mockReturnValue(logger);
      const debugLogCall = jest
        .spyOn((command as any), "debugLog")
        .mockReturnValue(true);
      const runCall = jest
        .spyOn(command, "run")
        .mockResolvedValue();

      // act
      await command.runAsScheduler();

      // assert
      expect(loggerSetModuleCall).toHaveBeenNthCalledWith(1, "payout/PrepareBoost15Payouts");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, `Starting payout preparation for booster type: boost15`);
      expect(debugLogCall).toHaveBeenNthCalledWith(2, `Total number of boost15 payouts prepared: "0"`);
      expect(runCall).toHaveBeenNthCalledWith(
        1,
        ["accounts"],
        {
          debug: false,
        } as PayoutCommandOptions
      );
    });
  });
});