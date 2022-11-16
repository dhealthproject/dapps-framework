/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mock sha3-_256
jest.mock("js-sha3", () => ({
  sha3_256: jest.fn(),
}));

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { HttpException } from "@nestjs/common";

// internal dependencies
import { OAuthController } from "../../../../src/common/routes/OAuthController";
import { OAuthService } from "../../../../src/common/services/OAuthService";
import { AuthService } from "../../../../src/common/services/AuthService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { CipherService } from "../../../../src/common/services/CipherService";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";
import { AccountIntegrationDocument } from "../../../../src/common/models/AccountIntegrationSchema";
import { MockModel } from "../../../mocks/global";

describe("common/OAuthController", () => {
  let controller: OAuthController;
  let oauthService: OAuthService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OAuthController],
      providers: [
        OAuthService,
        AuthService, // requirement from OAuthService
        QueryService, // requirement from OAuthService
        CipherService, // requirement from OAuthService
        AccountsService, // requirement from AuthService
        ConfigService, // requirement from AuthService
        NetworkService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AccountsService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from ChallengesService
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel,
        }, // requirement from OAuthService
      ],
    }).compile();

    controller = module.get<OAuthController>(OAuthController);
    oauthService = module.get<OAuthService>(OAuthService);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("authorize()", () => {
    it("should run correctly", async () => {
      // prepare
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue({ address: "testDHealthAddress" } as AccountDocument);
      const oauthServiceGetAuthorizeURLCall = jest
        .spyOn(oauthService, "getAuthorizeURL")
        .mockReturnValue("http://test.url");
      const oauthServiceUpdateIntegrationCall = jest
        .spyOn(oauthService, "updateIntegration")
        .mockResolvedValue({} as AccountIntegrationDocument);
      const responseRedirectCall = jest.fn();
      const statusCall = jest.fn().mockReturnValue(
        { redirect: responseRedirectCall }
      );

      // act
      await (controller as any).authorize(
        jest.fn(),
        { status: statusCall },
        "testProvider",
        { ref: "testRef", dhealthAddress: "testDHealthAddress" },
      );

      // assert
      expect(authServiceGetAccountCall).toBeCalledTimes(1);
      expect(oauthServiceGetAuthorizeURLCall).toBeCalledTimes(1);
      expect(oauthServiceUpdateIntegrationCall).toBeCalledTimes(1);
      expect(statusCall).toBeCalledTimes(1);
      expect(responseRedirectCall).toBeCalledTimes(1);
    });

    it("should throw correct error if account address is not the same with account integration address", () => {
      // prepare
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue({ address: "testAddress" } as AccountDocument);
      const oauthServiceGetAuthorizeURLCall = jest
        .spyOn(oauthService, "getAuthorizeURL")
        .mockReturnValue("http://test.url");
      const oauthServiceUpdateIntegrationCall = jest
        .spyOn(oauthService, "updateIntegration")
        .mockResolvedValue({} as AccountIntegrationDocument);
      const responseRedirectCall = jest.fn();
      const statusCall = jest.fn().mockReturnValue(
        { redirect: responseRedirectCall }
      );
      const ecpectedError = new HttpException(`Forbidden`, 403);

      // act
      const result = (controller as any).authorize(
        jest.fn(),
        { status: statusCall },
        "testProvider",
        { ref: "testRef", dhealthAddress: "testDHealthAddress" },
      );

      // assert
      expect(authServiceGetAccountCall).toBeCalledTimes(1);
      expect(oauthServiceGetAuthorizeURLCall).toBeCalledTimes(0);
      expect(oauthServiceUpdateIntegrationCall).toBeCalledTimes(0);
      expect(statusCall).toBeCalledTimes(0);
      expect(responseRedirectCall).toBeCalledTimes(0);
      expect(result).rejects.toThrowError(ecpectedError);
    });
  });

  describe("callback()", () => {
    it("should return correct result", async () => {
      // prepare
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue({ address: "testAddress" } as AccountDocument);
      const oauthServiceOauthCallbackCall = jest
        .spyOn(oauthService, "oauthCallback")
        .mockResolvedValue({} as AccountIntegrationDocument);
      const expectedResult = {
        code: 200,
        status: true,
      };

      // act
      const result = await (controller as any).callback(
        jest.fn(),
        "testProvider",
        jest.fn(),
      );

      // assert
      expect(authServiceGetAccountCall).toHaveBeenCalledTimes(1);
      expect(oauthServiceOauthCallbackCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it("should throw same error if any error was caught", () => {
      // prepare
      const authServiceGetAccountCall = jest
        .spyOn(authService, "getAccount")
        .mockResolvedValue({ address: "testAddress" } as AccountDocument);
      const expectedError = new Error("testError");
      const oauthServiceOauthCallbackCall = jest
        .spyOn(oauthService, "oauthCallback")
        .mockRejectedValue(expectedError);

      // act
      const result = (controller as any).callback(
        jest.fn(),
        "testProvider",
        jest.fn(),
      );

      // assert
      expect(result).rejects.toThrowError(expectedError);
      expect(authServiceGetAccountCall).toHaveBeenCalledTimes(1);
      expect(oauthServiceOauthCallbackCall).toHaveBeenCalledTimes(0);
    });
  });
});