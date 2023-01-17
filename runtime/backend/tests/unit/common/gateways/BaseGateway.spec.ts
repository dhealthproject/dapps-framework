/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mock config dapp backend https value
import { mockDappConfigLoaderCall } from "../../../mocks/config";
const dappConfig = mockDappConfigLoaderCall();
dappConfig.backendApp.https = true;

jest.mock("cookie", () => ({
  parse: jest.fn((cookie: string) => {
    if (cookie.length > 0) return { challenge: "test-challenge" };
    return { challenge: "" };
  })
}));

jest.mock("cookie-parser", () => ({
  signedCookie: jest.fn((challenge: string) => challenge),
}));

// external dependencies
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TestingModule, Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { HttpException, HttpStatus } from "@nestjs/common";

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

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
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

    it("should use 'wss' if config enables https", () => {
      expect((testGateway as any).websocketUrl)
        .toBe(`wss://${dappConfig.backendApp.host}:${dappConfig.backendApp.wsPort}/ws`);
    });
  });

  describe("handleConnection()", () => {
    let request: any;
    beforeEach(() => {
      request = {
        // empty signed cookies
        signedCookies: undefined,
        // then load from request cookies
        cookies: {
          "fake-cookie-name": "expectedToken",
        },
        headers: {
          cookie: "s%3Aszbi8fzi.JqeTesglrltbou3CNrkYcHo8iTqAx%2BHVYMiDNGwQwnU",
        },
      }
    });

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

    it("should throw HttpException if challenge is not present from cookie", () => {
      // prepare
      request.headers.cookie = "";
      const expectedError = new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

      // act
      const result = testGateway.handleConnection({}, request);

      // assert
      expect(result).rejects.toThrow(expectedError);
    });

    it("should emit event in case of success", async () => {
      const emitMock = jest.fn();
      (testGateway as any).emitter = {
        emit: emitMock,
      };

      await testGateway.handleConnection({}, request);

      expect(emitMock).toBeCalledTimes(1);
    });

    it("should push value to clients", () => {
      testGateway.handleConnection({}, request);
      expect(Object.keys((testGateway as any).clients)).toHaveLength(1);
    });
  });

  describe("handleDisconnect()", () => {
    const mockedWsWithChallenge = {
      challenge: "fakeChallengeHello",
    };

    it("should remove correct challenge from clients", () => {
      (testGateway as any).clients = {
        "fakeChallengeHello": {},
        "fakeChallenge": {}, // <-- will not be removed
      };
      testGateway.handleDisconnect(mockedWsWithChallenge);

      expect(Object.keys((testGateway as any).clients)).toHaveLength(1);
      expect("fakeChallenge" in (testGateway as any).clients).toBe(true);
    });

    it("should return if challenge is not present or is empty", () => {
      // prepare
      [{}, { challenge: "" }].forEach((ws: object) => {
        const clients = {
          "test-challenge": {},
        };
        (testGateway as any).clients = clients;
        
        // act
        testGateway.handleDisconnect(ws);

        // assert
        expect((testGateway as any).clients).toBe(clients);
      });
    });

    it("should return if challenge is not from a connected client", () => {
      // prepare
      const clients = {
        "test-challenge": {},
      };
      (testGateway as any).clients = clients;
      
      // act
      testGateway.handleDisconnect({
        challenge: "test-challenge2",
      });

      // assert
      expect((testGateway as any).clients).toBe(clients);
    });
  });

  describe("afterInit", () => {
    it("should log info after gateway initialized", () => {
      const debugMock = jest.fn();
      (testGateway as any).logger = {
        debug: debugMock,
      };

      testGateway.afterInit({} as any);

      expect(debugMock).toBeCalledTimes(1);
    });

    it("should log message if connection was established", () => {
      const debugMock = jest.fn();
      (testGateway as any).logger = {
        debug: debugMock,
      };

      testGateway.afterInit({
        connections: "test-connection"
      } as any);

      expect(debugMock).toHaveBeenNthCalledWith(
        1,
        "Now listening for websocket connections on wss://fake.example.com:4321/ws"
      );
      expect(debugMock).toHaveBeenNthCalledWith(
        2,
        "test-connection websocket clients connected"
      );
    });
  });
});
