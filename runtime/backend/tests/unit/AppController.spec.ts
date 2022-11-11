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
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { MailerService } from "@nestjs-modules/mailer";

// internal dependencies
import { MockModel } from "../mocks/global";
import { AppController } from "../../src/AppController";
import { AccountsService } from "../../src/common/services/AccountsService";
import { AccountSessionsService } from "../../src/common/services/AccountSessionsService";
import { ChallengesService } from "../../src/common/services/ChallengesService";
import { NetworkService } from "../../src/common/services/NetworkService";
import { AuthService } from "../../src/common/services/AuthService";
import { QueryService } from "../../src/common/services/QueryService";
import { OAuthService } from "../../src/oauth/services/OAuthService";
import { CipherService } from "../../src/common/services/CipherService";
import { NotifierFactory } from "../../src/notifier/concerns/NotifierFactory";
import { EmailNotifier } from "../../src/notifier/services/EmailNotifier";

// configuration resources
import dappConfigLoader from "../../config/dapp";

// Mocks the AppController to permit testing of
// protected methods such as getHello
class MockAppController extends AppController {
  public fakeGetHello(): string {
    return this.getHello();
  }

  public fakeGetProfile(req: any): any {
    return this.getProfile(req);
  }
}

describe("AppController", () => {
  let appController: MockAppController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockAppController],
      providers: [
        OAuthService,
        AuthService, // requirement from OAuthService
        CipherService, // requirement from OAuthService
        ConfigService, // requirement from AuthService
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        AccountSessionsService, // requirement from AuthService
        JwtService, // requirement from AuthService
        QueryService, // requirement from AccountsService
        ChallengesService, // requirement from AccountsService
        NotifierFactory,
        EmailNotifier,
        {
          provide: getModelToken("Account"),
          useValue: MockModel, // test/mocks/global.ts
        }, // requirement from AccountsService
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel, // test/mocks/global.ts
        }, // requirement from AccountsSessionService
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel, // test/mocks/global.ts
        }, // requirement from OAuthService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from ChallengesService
        {
          provide: MailerService,
          useValue: MailerService,
        }, // requirement from ChallengesService
      ],
    }).compile();

    appController = app.get<MockAppController>(MockAppController);
    authService = app.get<AuthService>(AuthService);
  });

  describe("getHello()", () => {
    it('should return "Hello, world of dAppName!"', () => {
      expect(appController.fakeGetHello()).toBe(
        `Hello, world of ${dappConfigLoader().dappName}!`,
      );
    });
  });

  describe("getProfile()", () => {
    it("should call correct method and respond with DTO", async () => {
      // prepare
      (appController as any).authService = {
        getAccount: jest.fn().mockReturnValue({
          address: "fakeAddress",
          firstTransactionAt: 0,
          firstTransactionAtBlock: 0,
          transactionsCount: 0,
          referredBy: "fakeOtherAddress",
          referralCode: "otherUser",
        }),
      };

      // act
      const profile = await appController.fakeGetProfile({});

      // assert
      expect(profile).toStrictEqual({
        address: "fakeAddress",
        firstTransactionAt: 0,
        firstTransactionAtBlock: 0,
        integrations: undefined,
        transactionsCount: 0,
        referredBy: "fakeOtherAddress",
        referralCode: "otherUser",
      });
    });

    // it("should call getIntegrations with correct parameters", () => {});

    // it("should respond with correctly filled ProfileDTO", () => {});
  });
});
