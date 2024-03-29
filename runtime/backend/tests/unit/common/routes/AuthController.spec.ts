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
import { HttpException, HttpStatus } from "@nestjs/common";

// internal dependencies
import { AuthService } from "../../../../src/common/services/AuthService";
import { AuthController } from "../../../../src/common/routes/AuthController";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { CipherService } from "../../../../src/common/services/CipherService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AccountSessionDocument } from "../../../../src/common/models/AccountSessionSchema";
import { AccessTokenDTO } from "../../../../src/common/models/AccessTokenDTO";
import { MockModel } from "../../../mocks/global";

describe("common/AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;
  let accountSessionsService: AccountSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService, // requirement from AuthService
        AccountsService, // requirement from AuthController
        AccountSessionsService, // requirement from AuthController
        ConfigService, // requirement from AuthService
        NetworkService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        CipherService, // requirement from OAuthService
        QueryService, // requirement from AccountSessionsService
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AccountSessionsService
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        }, // requirement from AccountSessionsService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from ChallengesService
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    accountSessionsService = module.get<AccountSessionsService>(AccountSessionsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAuthCode()", () => {
    it("should return correct result", async () => {
      // prepare
      const challenge = "testChallenge";
      const authServiceGetChallengeCall = jest
        .spyOn(authService, "getChallenge")
        .mockReturnValue(challenge);
      const expectedResult = { challenge };
      const responseCookieCall = jest.fn();

      // act
      const result = await (controller as any).getAuthCode({
        cookie: responseCookieCall,
      });

      // assert
      expect(authServiceGetChallengeCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getAccessToken()", () => {
    it("should return correct result", async () => {
      // prepare
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockReturnValue({
          name: "testCookie",
          domain: "testDomain",
        });
      const authServiceValidateChallengeCall = jest
        .spyOn(authService, "validateChallenge")
        .mockResolvedValue({
          sub: "testSub",
          address: "testAddress",
        });

      const token = new AccessTokenDTO();
      const tokens = {
        ...token,
        ...{
          accessToken: "testAccessToken",
          refreshToken: "testRefreshToken",
          expiresAt: 1,
        }          
      };
      const authServiceGetAccessTokenCall = jest
        .spyOn(authService, "getAccessToken")
        .mockResolvedValue(tokens);
      const responseCookieCall = jest.fn();

      // act
      const result = await (controller as any).getAccessToken(
        { challenge: "testChallenge" },
        { cookie: responseCookieCall },
      );

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(authServiceValidateChallengeCall).toHaveBeenCalledTimes(1);
      expect(authServiceGetAccessTokenCall).toHaveBeenCalledTimes(1);
      expect(responseCookieCall).toHaveBeenCalledTimes(2);
      expect(result).toEqual(tokens);
    });

    it("should return undefined if payload is null", async () => {
      // prepare
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockReturnValue({
          name: "testCookie",
          domain: "testDomain",
        });
      const authServiceValidateChallengeCall = jest
        .spyOn(authService, "validateChallenge")
        .mockResolvedValue(null);

      // act
      const result = await (controller as any).getAccessToken({
        challenge: "testChallenge",
      });

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(authServiceValidateChallengeCall).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it("should throw Unauthorized exception if any error was caught", () => {
      // prepare
      const expectedError = new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockImplementation(() => {
          throw new Error();
        });

      // act
      const result = (controller as any).getAccessToken(
        { challenge: "testChallenge" }
      );

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(result).rejects.toThrowError(expectedError);
    });

    it("should throw same error if any error was caught", () => {
      // prepare
      const expectedError = new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockImplementation(() => {
          throw expectedError;
        });

      // act
      const result = (controller as any).getAccessToken({
        challenge: "testChallenge",
      });

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(result).rejects.toThrowError(expectedError);
    });
  });

  describe("refreshTokens()", () => {
    it("should return correct result", async () => {
      // prepare
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockReturnValue({
          name: "testCookie",
          domain: "testDomain",
        });
      const authServiceExtractTokenCall = jest
        .spyOn(AuthService, "extractToken")
        .mockReturnValue("testToken");
      const accountsServiceFindOneCall = jest
        .spyOn(accountSessionsService, "findOne")
        .mockResolvedValue({} as AccountSessionDocument);
      const tokens = {
        accessToken: "testAccessToken",
        refreshToken: "testRefreshToken",
        expiresAt: 1,
      };
      const authServiceRefreshAccessTokenCall = jest
        .spyOn(authService, "refreshAccessToken")
        .mockResolvedValue(tokens);
      const responseCookieCall = jest.fn();

      // act
      const result = await (controller as any).refreshTokens(jest.fn(), {
        cookie: responseCookieCall,
      });

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(authServiceExtractTokenCall).toHaveBeenCalledTimes(1);
      expect(accountsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(authServiceRefreshAccessTokenCall).toHaveBeenCalledTimes(1);
      expect(responseCookieCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tokens);
    });

    it("should throw Unauthorized exception if any error was caught", () => {
      // prepare
      const expectedError = new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockImplementation(() => {
          throw expectedError;
        });
      const responseCookieCall = jest.fn();

      // act
      const result = (controller as any).refreshTokens(jest.fn(), {
        cookie: responseCookieCall,
      });

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(responseCookieCall).toHaveBeenCalledTimes(0);
      expect(result).rejects.toThrowError(expectedError);
    });

    it("should throw unauthorized http exception if any other error was caught", () => {
      // prepare
      const expectedError = new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);;
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockImplementation(() => {
          throw new Error();
        });
      const responseCookieCall = jest.fn();

      // act
      const result = (controller as any).refreshTokens(
        jest.fn(),
        { cookie: responseCookieCall }
      );

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(responseCookieCall).toHaveBeenCalledTimes(0);
      expect(result).rejects.toThrowError(expectedError);
    });
  });

  describe("logout()", () => {
    it("should return correct result", async () => {
      // prepare
      const authServiceGetCookieCall = jest
        .spyOn(authService, "getCookie")
        .mockReturnValue({
          name: "testCookie",
          domain: "testDomain",
        });
      const responseCookieCall = jest.fn();
      const expectedResult = {
        code: 200,
        status: true,
      };

      // act
      const result = await (controller as any).logout({
        cookie: responseCookieCall,
      });

      // assert
      expect(authServiceGetCookieCall).toHaveBeenCalledTimes(1);
      expect(responseCookieCall).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expectedResult);
    });
  });
});
