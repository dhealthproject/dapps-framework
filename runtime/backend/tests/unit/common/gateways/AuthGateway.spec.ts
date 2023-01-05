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
import { TestingModule, Test } from "@nestjs/testing";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import { ValidateChallengeScheduler } from "../../../../src/common/schedulers/ValidateChallengeScheduler";
import { AuthGateway } from "../../../../src/common/gateways/AuthGateway";
import { AuthService } from "../../../../src/common/services/AuthService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { MockModel } from "../../../mocks/global";

describe("common/AuthGateway", () => {
  let authGateway: AuthGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventEmitter2,
        ValidateChallengeScheduler,
        AuthGateway,
        SchedulerRegistry,
        AuthService,
        ConfigService,
        NetworkService,
        AccountsService,
        AccountSessionsService,
        ChallengesService,
        QueryService,
        JwtService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AccountsService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        }, // requirement from AuthService
      ],
    }).compile();

    authGateway = module.get<AuthGateway>(AuthGateway);
  });

  it("should be defined", () => {
    expect(authGateway).toBeDefined();
  });

  describe("constructor()", () => {
    it("should initialize emitter", () => {
      expect("emitter" in authGateway).toBe(true);
    });

    it("should initialize validateChallengeScheduler", () => {
      expect("validateChallengeScheduler" in authGateway).toBe(true);
    });
  });

  describe("onAuthOpened()", () => {
    it("should start validation of challenge", () => {
      const validateMethodMock = jest.fn();

      (authGateway as any).validateChallengeScheduler = {
        startCronJob: validateMethodMock,
      };

      authGateway.onAuthOpened({ challenge: "fakeChallenge" });

      expect(validateMethodMock).toBeCalledTimes(1);
    });
  });

  describe("onAuthCompleted()", () => {
    it("should send complete message to client and log message", () => {
      // prepare
      const sendMock = jest.fn();
      (authGateway as any).clients = {
        "fakeChallenge": {
          send: sendMock,
        },
      };

      // act
      authGateway.onAuthCompleted({ challenge: "fakeChallenge" });

      // assert
      expect(sendMock).toBeCalledTimes(1);
    });
  });

  describe("onAuthClosed", () => {
    it("should delete client socket instance", () => {
      // prepare
      (authGateway as any).clients = {
        "fakeChallenge": {}
      };

      // act
      authGateway.onAuthClosed({ challenge: "fakeChallenge" });
      const clients = (authGateway as any).clients;

      // assert
      expect("fakeChallenge" in clients).toBe(false);
    });
  });
});
