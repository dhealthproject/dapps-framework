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

// internal dependencies
import { MockModel } from "../mocks/global";
import { AppController } from "../../src/AppController";
import { AccountsService } from "../../src/common/services/AccountsService";
import { ChallengesService } from "../../src/common/services/ChallengesService";
import { NetworkService } from "../../src/common/services/NetworkService";
import { AuthService } from "../../src/common/services/AuthService";
import { QueryService } from "../../src/common/services/QueryService";
import { OAuthService } from "../../src/common/services/OAuthService";

// configuration resources
import dappConfigLoader from "../../config/dapp";
import { ProfileDTO } from "../../src/common/models/ProfileDTO";

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
        ConfigService, // requirement from AuthService
        NetworkService, // requirement from AuthService
        QueryService, // requirement from AccountsService
        AccountsService, // requirement from AuthService
        ChallengesService, // requirement from AccountsService
        JwtService, // requirement from AuthService
        OAuthService,
        AuthService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel, // test/mocks/global.ts
        }, // requirement from AccountsService
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel, // test/mocks/global.ts
        },
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from AuthService
      ],
    }).compile();

    appController = app.get<MockAppController>(MockAppController);
    authService = app.get<AuthService>(AuthService);
  });

  describe("getHello() -->", () => {
    it('should return "Hello, world of dAppName!"', () => {
      expect(appController.fakeGetHello()).toBe(
        `Hello, world of ${dappConfigLoader().dappName}!`,
      );
    });
  });

  describe("getProfile() -->", () => {
    it("should call correct method and respond with DTO", () => {
      expect(appController.fakeGetProfile({})).toBe(new ProfileDTO());
    });

    // it("should call getIntegrations with correct parameters", () => {});

    // it("should respond with correctly filled ProfileDTO", () => {});
  });
});
