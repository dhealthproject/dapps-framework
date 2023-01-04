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
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TestingModule, Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import {
  AuthService,
  CookiePayload,
} from "../../../../src/common/services/AuthService";
import { LogService } from "../../../../src/common/services/LogService";
import { BaseGateway } from "../../../../src/common/gateways/BaseGateway";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { MockModel } from "../../../mocks/global";

class TestGateway extends BaseGateway {}

describe("common/BaseGateway", () => {
  let logger: LogService;
  let testGateway: TestGateway;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventEmitter2,
        LogService,
        TestGateway,
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

    logger = module.get<LogService>(LogService);
    testGateway = module.get<TestGateway>(TestGateway);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(testGateway).toBeDefined();
  });

  describe("constructor()", () => {
    it("should initialize clients properly", () => {
      expect("clients" in testGateway).toBe(true);
    });

    it("should initialize emitter", () => {
      expect("emitter" in testGateway).toBe(true);
    });

    it("should initialize logger", () => {
      expect("logger" in testGateway).toBe(true);
    });
  });

  describe("handleConnection()", () => {
    let request: any = {
      // empty signed cookies
      signedCookies: undefined,
      // then load from request cookies
      cookies: {
        "fake-cookie-name": "expectedToken",
      },
      headers: {
        cookie: "s%3Aszbi8fzi.JqeTesglrltbou3CNrkYcHo8iTqAx%2BHVYMiDNGwQwnU",
      },
    };

    it("should receive challenge from cookie", () => {
      // act
      const cookie: CookiePayload = (authService as any).cookie;

      // assert
      expect("challenge" in cookie).toBe(true);
    });

    it("should store current websocket in ws prop", () => {
      (testGateway as any).ws = {
        testData: "test value",
      };

      expect((testGateway as any).ws).not.toBe(null);
    });

    it("should emit event in case of success", () => {
      const emitMock = jest.fn();
      (testGateway as any).emitter = {
        emit: emitMock,
      };

      testGateway.handleConnection({}, request);

      expect(emitMock).toBeCalledTimes(1);
    });

    it("should push value to clients", () => {
      testGateway.handleConnection({}, request);
      expect((testGateway as any).clients).toHaveLength(1);
    });
  });

  describe("handleDisconnect()", () => {
    const mockedWsWithChallenge = {
      challenge: "fakeChallengeHello",
    };

    it("should remove correct challenge from clients", () => {
      (testGateway as any).clients = ["fakeChallengeHello"];
      testGateway.handleDisconnect(mockedWsWithChallenge);

      expect((testGateway as any).clients).toHaveLength(0);
    });
  });

  describe("afterInit", () => {
    it("should log info after gateway initialized", () => {
      const mockedLog = jest.fn();
      (testGateway as any).logger = {
        log: mockedLog,
      };

      testGateway.afterInit({} as any);

      expect(mockedLog).toBeCalledTimes(1);
    });
  });
});
