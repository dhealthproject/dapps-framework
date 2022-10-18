/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// Mocks the full `js-sha3` dependency to avoid
// calls to actual SHA3/Keccak algorithms.
const sha3_256_call = jest.fn().mockReturnValue("fakeHash");
jest.mock("js-sha3", () => ({
  sha3_256: sha3_256_call
}));

// external dependencies
import { getModelToken } from "@nestjs/mongoose";
import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AuthService } from "../../../../src/common/services/AuthService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { OAuthService } from "../../../../src/common/services/OAuthService";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";
import { OAuthCallbackRequest } from "../../../../src/common/requests/OAuthCallbackRequest";
import {
  AccountIntegrationDocument,
  AccountIntegrationQuery,
} from "../../../../src/common/models/AccountIntegrationSchema";

describe("common/OAuthService", () => {
  let oauthService: OAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        AuthService, // requirement from OAuthService
        QueryService, // requirement from OAuthService
        ConfigService, // requirement from OAuthService
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel,
        }, // requirement from OAuthService
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from AuthService
      ],
    }).compile();

    oauthService = module.get<OAuthService>(OAuthService);
  });

  it("should be defined", () => {
    expect(oauthService).toBeDefined();
  });

  describe("getProvider()", () => {
    it("should throw correct error if provider is unknown", () => {
      // prepare
      (oauthService as any).configService = {
        get: jest.fn().mockReturnValue(undefined),
      };
      const expectedError = `Invalid oauth provider "test-provider".`;

      // act
      const provider = () => (oauthService as any).getProvider("test-provider");

      // assert
      expect(provider).toThrow(expectedError);
    });
  });

  describe("getEncryptionSeed()", () => {
    it("should return correct result", () => {
      // prepare
      (oauthService as any).configService = {
        get: jest.fn().mockReturnValue("test-secret-"),
      };

      // act
      const result = (oauthService as any).getEncryptionSeed({} as AccountIntegrationDocument);

      // assert
      expect(sha3_256_call).toHaveBeenCalledTimes(1);
      expect(result).toBe("test-secret-fakeHash");
    });
  });

  describe("getAuthorizeURL()", () => {
    it("should result in correct URL with basic OAuth driver", () => {
      // prepare
      (oauthService as any).configService = {
        get: jest.fn().mockReturnValue({
          client_id: "fake-id-3",
          client_secret: "fake-secret-3",
          oauth_url: "fake-oauth-url-3",
          callback_url: "fake-callback-url-3",
          scope: "fake-scope"
        })
      };
      const expected =
        "fake-oauth-url-3" + // L32
        "?client_id=fake-id-3" +
        "&redirect_uri=fake-callback-url-3" +
        "&state=fake-address:fake-referral" +
        "&scope=fake-scope";

      // act
      const actual = oauthService.getAuthorizeURL(
        "basic",
        "fake-address",
        "fake-referral",
      );

      // assert
      expect(actual).toBe(expected);
    });

    it("should result in correct URL with no referral code", () => {
      // prepare
      (oauthService as any).configService = {
        get: jest.fn().mockReturnValue({
          client_id: "fake-id-3",
          client_secret: "fake-secret-3",
          oauth_url: "fake-oauth-url-3",
          callback_url: "fake-callback-url-3",
          scope: "fake-scope"
        })
      };
      const expected =
        "fake-oauth-url-3" + // L32
        "?client_id=fake-id-3" +
        "&redirect_uri=fake-callback-url-3" +
        "&state=fake-address" +
        "&scope=fake-scope";

      // act
      const actual = oauthService.getAuthorizeURL(
        "basic",
        "fake-address",
      );

      // assert
      expect(actual).toBe(expected);
    });

    it("should encode callback_url using encodeURI format", () => {
      // prepare
      const callbackUrl = "http://localhost:8080/oauth/other/link";
      const encodedUrl = "http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fother%2Flink";
      (oauthService as any).configService = {
        get: jest.fn().mockReturnValue({
          client_id: "fake-id-2",
          client_secret: "fake-secret-2",
          oauth_url: "http://example.com/oauth",
          callback_url: callbackUrl,
          scope: "fake-scope"
        })
      };
      const expected =
        "http://example.com/oauth" + // L26
        "?client_id=fake-id-2" +
        "&redirect_uri=" + encodedUrl +
        "&state=fake-address:fake-referral" +
        "&scope=fake-scope";

      // act
      const actual = oauthService.getAuthorizeURL(
        "other",
        "fake-address",
        "fake-referral",
      );

      // assert
      expect(actual).toBe(expected);
    });

    it("should use Strava OAuth Driver given config", () => {
      // prepare
      const callbackUrl = "http://localhost:8080/oauth/strava/link";
      const encodedUrl = "http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fstrava%2Flink";
      (oauthService as any).configService = {
        get: jest.fn().mockReturnValue({
          client_id: "123456",
          client_secret: "VerySecretMessage",
          oauth_url: "https://www.strava.com/oauth/authorize",
          callback_url: callbackUrl,
          scope: "activity:read_all"
        })
      };

      const expected =
        "https://www.strava.com/oauth/authorize" + // L20
        "?client_id=123456" +
        "&redirect_uri=" + encodedUrl +
        "&state=fake-address:fake-referral" +
        // strava-only fields
        "&response_type=code" +
        "&approval_prompt=auto" +
        // scope is always at the end
        "&scope=activity:read_all";

      // act
      const actual = oauthService.getAuthorizeURL(
        "strava",
        "fake-address",
        "fake-referral",
      );

      // assert
      expect(actual).toBe(expected);
    });
  });

  describe("getIntegration()", () => {
    const findOneMock = jest.fn();
    beforeEach(() => {
      // getIntegration uses `queryService.findOne` so we mock
      // it here as this must be tested in QueryService tests.
      (oauthService as any).queryService = {
        findOne: findOneMock
      };

      findOneMock.mockClear();
    });

    it("should use correct database query parameters", () => {
      // act
      oauthService.getIntegration(
        "strava",
        "fake-address",
      );

      // assert
      expect(findOneMock).toHaveBeenCalledTimes(1);
      expect(findOneMock).toHaveBeenCalledWith(new AccountIntegrationQuery({
        name: "strava",
        address: "fake-address",
      } as AccountIntegrationDocument), (oauthService as any).model);
    });

    it("should accept any provider name in string format", () => {
      // act
      oauthService.getIntegration(
        "other",
        "fake-address",
      );

      // assert
      expect(findOneMock).toHaveBeenCalledTimes(1);
      expect(findOneMock).toHaveBeenCalledWith(new AccountIntegrationQuery({
        name: "other",
        address: "fake-address",
      } as AccountIntegrationDocument), (oauthService as any).model);
    });

    it("should accept any remote identifier in string format", () => {
      // act
      oauthService.getIntegration(
        "other",
        "fake-address",
      );

      // assert
      expect(findOneMock).toHaveBeenCalledTimes(1);
      expect(findOneMock).toHaveBeenCalledWith(new AccountIntegrationQuery({
        name: "other",
        address: "fake-address",
      } as AccountIntegrationDocument), (oauthService as any).model);
    });

    it("should return query result given document exists", async () => {
      // prepare
      const expectedResult = {
        address: "fake-address",
        name: "strava"
      } as AccountIntegrationDocument;
      const customFindOneMock = jest.fn().mockReturnValue(expectedResult);
      (oauthService as any).queryService = {
        findOne: customFindOneMock
      };

      // act
      const result = await oauthService.getIntegration(
        "strava",
        "fake-address",
      );

      // assert
      expect(customFindOneMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
  });

  describe("updateIntegrations()", () => {
    it("should result in correct integration", async () => {
      // prepare
      const providerName: string = "test-provider-name";
      const data: Record<string, any> = { authorizeUrl: "test-url" };
      const expectedResult = { address: "fake-address" } as AccountIntegrationDocument;
      const queryServiceCreateOrUpdateCall = jest
        .fn().mockResolvedValue(expectedResult);
      (oauthService as any).queryService = {
        createOrUpdate: queryServiceCreateOrUpdateCall,
      };

      // act
      const result = await (oauthService as any).updateIntegration(
        providerName, "fake-address", data
      );

      // assert
      expect(queryServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        {
          document: {
            address: "fake-address",
            name: providerName,
          },
          filterQuery: undefined,
          order: "asc",
          pageNumber: 1,
          pageSize: 20,
          sort: "_id",
        },
        MockModel,
        { authorizationHash: "fakeHash" },
        {},
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe("getIntegrations()", () => {
    const findMock = jest.fn();
    beforeEach(() => {
      // getIntegrations uses `queryService.find` so we mock
      // it here as this must be tested in QueryService tests.
      (oauthService as any).queryService = {
        find: findMock
      };

      findMock.mockClear();
    });

    it("should use correct database query parameters", async () => {
      // act
      await oauthService.getIntegrations(
        { address: "fake-address" } as AccountDocument,
      );

      // assert
      expect(findMock).toHaveBeenCalledTimes(1);
      expect(findMock).toHaveBeenCalledWith(new AccountIntegrationQuery({
        address: "fake-address",
      } as AccountIntegrationDocument), (oauthService as any).model);
    });

    it("should accept any address in string format", async () => {
      // act
      await oauthService.getIntegrations(
        { address: "another-fake-address" } as AccountDocument,
      );

      // assert
      expect(findMock).toHaveBeenCalledTimes(1);
      expect(findMock).toHaveBeenCalledWith(new AccountIntegrationQuery({
        address: "another-fake-address",
      } as AccountIntegrationDocument), (oauthService as any).model);
    });

    it("should return query result given document(s) exist", async () => {
      // prepare
      const expectedResult = new PaginatedResultDTO([{
        address: "fake-address",
        name: "strava"
      } as AccountIntegrationDocument]);
      const customFindMock = jest.fn().mockReturnValue(expectedResult);
      (oauthService as any).queryService = {
        find: customFindMock
      };

      // act
      const result = await oauthService.getIntegrations(
        { address: "fake-address" } as AccountDocument,
      );

      // assert
      expect(customFindMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
  });

  describe("updateIntegration()", () => {
    const createOrUpdateMock = jest.fn();
    beforeEach(() => {
      // updateIntegration uses `queryService.createOrUpdate` so we mock
      // it here as this must be tested in QueryService tests.
      (oauthService as any).queryService = {
        createOrUpdate: createOrUpdateMock
      };

      createOrUpdateMock.mockClear();
    });

    it("should use correct database parameters", async () => {
      // act
      await oauthService.updateIntegration(
        "strava",
        "fake-address",
        { testing: "fields" }
      );

      // assert
      expect(createOrUpdateMock).toHaveBeenCalledTimes(1);
      expect(createOrUpdateMock).toHaveBeenCalledWith(
        new AccountIntegrationQuery({
          address: "fake-address",
          name: "strava"
        } as AccountIntegrationDocument), // correct query
        (oauthService as any).model, // correct model
        { testing: "fields"}, // correct data
        {} // empty operations
      );
    });

    it("should accept any provider name in string format", async () => {
      // act
      await oauthService.updateIntegration(
        "other",
        "fake-address",
        { testing: "fields" }
      );

      // assert
      expect(createOrUpdateMock).toHaveBeenCalledTimes(1);
      expect(createOrUpdateMock).toHaveBeenCalledWith(
        new AccountIntegrationQuery({
          address: "fake-address",
          name: "other" // <--- modified
        } as AccountIntegrationDocument), // correct query
        (oauthService as any).model, // correct model
        { testing: "fields"}, // correct data
        {} // empty operations
      );
    });

    it("should accept any address in string format", async () => {
      // act
      await oauthService.updateIntegration(
        "other",
        "another-fake-address",
        { testing: "fields" }
      );

      // assert
      expect(createOrUpdateMock).toHaveBeenCalledTimes(1);
      expect(createOrUpdateMock).toHaveBeenCalledWith(
        new AccountIntegrationQuery({
          address: "another-fake-address",
          name: "other" // <--- modified
        } as AccountIntegrationDocument), // correct query
        (oauthService as any).model, // correct model
        { testing: "fields"}, // correct data
        {} // empty operations
      );
    });
  });

  describe("oauthCallback()", () => {
    const theAuthorization = {
            address: "fake-address",
            name: "fake-provider"
          } as AccountIntegrationDocument,
          getIntegrationMock = jest.fn().mockReturnValue(theAuthorization),
          getProviderMock = jest.fn(),
          getAccessTokenMock = jest.fn().mockReturnValue({
            accessToken: "fake-access-token",
            refreshToken: "fake-refresh-token"
          }),
          driverFactoryMock = jest.fn().mockReturnValue({
            getAccessToken: getAccessTokenMock
          }),
          getEncryptionSeedMock = jest.fn().mockReturnValue(
            "fake-insecure-encryption-seed"
          ),
          updateIntegrationMock = jest.fn(),
          validCallbackRequest = new OAuthCallbackRequest();
    validCallbackRequest.identifier = "fake-identifier";
    validCallbackRequest.scope = "fake-scope";
    validCallbackRequest.code = "fake-code";
    validCallbackRequest.state = "fake-state";
    beforeEach(() => {
      // following methods are necessary for the `oauthCallback()`
      // method and are therefor *mocked* here. These must be tested
      // separately as to permit more granular unit tests here.
      (oauthService as any).getIntegration = getIntegrationMock;
      (oauthService as any).getProvider = getProviderMock;
      (oauthService as any).driverFactory = driverFactoryMock;
      (oauthService as any).getEncryptionSeed = getEncryptionSeedMock;
      (oauthService as any).updateIntegration = updateIntegrationMock;

      getIntegrationMock.mockClear();
      getProviderMock.mockClear();
      getAccessTokenMock.mockClear();
      driverFactoryMock.mockClear();
      getEncryptionSeedMock.mockClear();
      updateIntegrationMock.mockClear();
    });

    it("should throw an error given no authorization", async () => {
      // prepare
      let nullGetIntegrationMock = jest.fn().mockReturnValue(null);
      (oauthService as any).getIntegration = nullGetIntegrationMock;

      // act
      try {
        await oauthService.oauthCallback(
          "strava",
          { address: "fake-address" } as AccountDocument,
          validCallbackRequest,
        );
      } catch(e: any) {
        // assert
        expect(e instanceof HttpException).toBe(true);
        expect("status" in e).toBe(true);
        expect("response" in e).toBe(true);
        expect(e.status).toBe(403);
        expect(e.response).toBe("Forbidden");
      }
    });

    it("should use correct provider to load OAuth driver", async () => {
      // act
      await oauthService.oauthCallback(
        "fake-provider",
        { address: "fake-address" } as AccountDocument,
        validCallbackRequest,
      );

      // assert
      expect(getProviderMock).toHaveBeenCalledTimes(1);
      expect(driverFactoryMock).toHaveBeenCalledTimes(1);
      expect(getProviderMock).toHaveBeenCalledWith("fake-provider");
      expect(driverFactoryMock).toHaveBeenCalledWith("fake-provider", undefined);
    });

    it("should create encryption seed from integration", async () => {
      // act
      await oauthService.oauthCallback(
        "fake-provider",
        { address: "fake-address" } as AccountDocument,
        validCallbackRequest,
      );

      // assert
      expect(getEncryptionSeedMock).toHaveBeenCalledTimes(1);
      expect(getEncryptionSeedMock).toHaveBeenCalledWith(theAuthorization);
    });

    it("should update integration entry with encrypted tokens", async () => {
      // act
      await oauthService.oauthCallback(
        "fake-provider",
        { address: "fake-address" } as AccountDocument,
        validCallbackRequest,
      );

      // assert
      expect(updateIntegrationMock).toHaveBeenCalledTimes(1);
      expect(updateIntegrationMock).toHaveBeenCalledWith(
        "fake-provider",
        "fake-address",
        {
          encAccessToken: undefined, // mocked Crypto.encrypt
          encRefreshToken: undefined, // mocked Crypto.encrypt
        }
      );
    });
  });
});
