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
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { CipherService } from "../../../../src/common/services/CipherService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AuthService } from "../../../../src/common/services/AuthService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { OAuthService } from "../../../../src/oauth/services/OAuthService";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";
import { OAuthCallbackRequest } from "../../../../src/oauth/requests/OAuthCallbackRequest";
import {
  AccountIntegrationDocument,
  AccountIntegrationQuery,
} from "../../../../src/common/models/AccountIntegrationSchema";
import { OAuthEntityType } from "../../../../src/oauth/drivers/OAuthEntity";
import { HttpMethod } from "../../../../src/common/drivers/HttpRequestHandler";
import { AccessTokenDTO } from "../../../../src/common/models/AccessTokenDTO";

describe("common/OAuthService", () => {
  let mockDate: Date;
  let oauthService: OAuthService;

  beforeEach(async () => {
    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        AccountSessionsService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        AuthService, // requirement from OAuthService
        QueryService, // requirement from OAuthService
        CipherService, // requirement from OAuthService
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
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        }, // requirement from AuthService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        }, // requirement from AuthService
      ],
    }).compile();

    oauthService = module.get<OAuthService>(OAuthService);

    sha3_256_call.mockClear();
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
      const result = (oauthService as any).getEncryptionSeed(
        {} as AccountIntegrationDocument,
        "no-identifier",
      );

      // assert
      expect(sha3_256_call).toHaveBeenCalledTimes(1);
      expect(result).toBe("test-secret-fakeHash");
    });

    it("should use integration and custom identifier parameter", () => {
      // prepare
      (oauthService as any).configService = {
        get: jest.fn().mockReturnValue("test-secret-"),
      };

      // act
      (oauthService as any).getEncryptionSeed(
        {
          address: "fake-address",
          authorizationHash: "fake-authorization"
        } as AccountIntegrationDocument,
        "other-identifier",
      );

      expect(sha3_256_call).toHaveBeenCalledTimes(1);
      expect(sha3_256_call).toHaveBeenCalledWith(
        "test-secret-" + 
        "fake-address" +
        "other-identifier" +
        "fake-authorization"
      );
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

    it("should accept any provider name & remote identifier in string format", () => {
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

  describe("oauthCallback()", () => {
    const theAuthorization = {
            address: "fake-address",
            name: "fake-provider",
            remoteIdentifier: "fake-identifier",
            authorizationHash: "fake-authhash",
          } as AccountIntegrationDocument,
          getIntegrationMock = jest.fn().mockReturnValue(theAuthorization),
          getProviderMock = jest.fn(),
          getAccessTokenMock = jest.fn().mockReturnValue({
            remoteIdentifier: "fake-identifier",
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
      expect(getEncryptionSeedMock).toHaveBeenCalledWith(theAuthorization, "fake-identifier");
    });

    it("should update integration entry with encrypted tokens", async () => {
      // prepare
      const expectedAccessTokenDTO: any = new AccessTokenDTO();
      expectedAccessTokenDTO.remoteIdentifier = "fake-identifier";
      expectedAccessTokenDTO.encAccessToken = "fake-encrypted-payload";
      expectedAccessTokenDTO.encRefreshToken = "fake-encrypted-payload";
      const encryptMock = jest.fn().mockReturnValue("fake-encrypted-payload");
      (oauthService as any).cipher = {
        encrypt: encryptMock,
      }

      // act
      await oauthService.oauthCallback(
        "fake-provider",
        { address: "fake-address" } as AccountDocument,
        validCallbackRequest,
      );

      // assert
      expect(encryptMock).toHaveBeenCalledTimes(2); // access + refresh tokens
      expect(updateIntegrationMock).toHaveBeenCalledTimes(1);
      expect(updateIntegrationMock).toHaveBeenCalledWith(
        "fake-provider",
        "fake-address",
        expectedAccessTokenDTO
      );
    });
  });

  describe("refreshAccessToken()", () => {
    const theAuthorization = {
        address: "fake-address",
        name: "fake-provider",
        remoteIdentifier: "fake-identifier",
        authorizationHash: "fake-authhash",
        encAccessToken: "fake-encrypted-access-token",
        encRefreshToken: "fake-encrypted-refresh-token",
      } as AccountIntegrationDocument,
      getProviderMock = jest.fn(),
      updateAccessTokenMock = jest.fn().mockReturnValue({
        accessToken: "fake-updated-access-token",
        refreshToken: "fake-updated-refresh-token"
      }),
      driverFactoryMock = jest.fn().mockReturnValue({
        updateAccessToken: updateAccessTokenMock
      }),
      getEncryptionSeedMock = jest.fn().mockReturnValue(
        "fake-insecure-encryption-seed"
      ),
      cipherDecryptMock = jest.fn().mockReturnValue(
        "fake-decrypted-refresh-token",
      ),
      cipherEncryptMock = jest.fn().mockReturnValue(
        "fake-encrypted-token",
      ),
      updateIntegrationMock = jest.fn();
    beforeEach(() => {
      // following methods are necessary for the `refreshAccessToken()`
      // method and are therefor *mocked* here. These must be tested
      // separately as to permit more granular unit tests here.
      (oauthService as any).getProvider = getProviderMock;
      (oauthService as any).driverFactory = driverFactoryMock;
      (oauthService as any).getEncryptionSeed = getEncryptionSeedMock;
      (oauthService as any).updateIntegration = updateIntegrationMock;
      (oauthService as any).cipher = {
        decrypt: cipherDecryptMock,
        encrypt: cipherEncryptMock,
      };

      getProviderMock.mockClear();
      driverFactoryMock.mockClear();
      getEncryptionSeedMock.mockClear();
      updateIntegrationMock.mockClear();
      updateAccessTokenMock.mockClear();
      cipherDecryptMock.mockClear();
      cipherEncryptMock.mockClear();
    });

    it("should throw an error given no authorization", async () => {
      // prepare
      let nullAuthorizationMock = {
        // - missing address field
        name: "fake-provider",
        remoteIdentifier: "fake-identifier",
        authorizationHash: "fake-authhash",
      } as AccountIntegrationDocument;

      // act
      try {
        await oauthService.refreshAccessToken(
          "strava",
          nullAuthorizationMock,
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

    it("should create encryption seed from integration", async () => {
      // act
      await oauthService.refreshAccessToken(
        "fake-provider",
        theAuthorization,
      );

      // assert
      expect(getEncryptionSeedMock).toHaveBeenCalledTimes(1);
      expect(getEncryptionSeedMock).toHaveBeenCalledWith(theAuthorization, "fake-identifier");
    });

    it("should decrypt refresh token from integration document", async () => {
      // act
      await oauthService.refreshAccessToken(
        "fake-provider",
        theAuthorization,
      );

      // assert
      expect(cipherDecryptMock).toHaveBeenCalledTimes(1);
      expect(cipherDecryptMock).toHaveBeenCalledWith(
        "fake-encrypted-refresh-token",
        "fake-insecure-encryption-seed",
      );
    });

    it("should use correct provider to load OAuth driver", async () => {
      // act
      await oauthService.refreshAccessToken(
        "fake-provider",
        theAuthorization,
      );

      // assert
      expect(getProviderMock).toHaveBeenCalledTimes(1);
      expect(driverFactoryMock).toHaveBeenCalledTimes(1);
      expect(getProviderMock).toHaveBeenCalledWith("fake-provider");
      expect(driverFactoryMock).toHaveBeenCalledWith("fake-provider", undefined);
    });

    it("should use correct refresh token for updateAccessToken call", async () => {
      // act
      await oauthService.refreshAccessToken(
        "fake-provider",
        theAuthorization,
      );

      // assert
      expect(getEncryptionSeedMock).toHaveBeenCalledTimes(1);
      expect(cipherDecryptMock).toHaveBeenCalledTimes(1);
      expect(updateAccessTokenMock).toHaveBeenCalledTimes(1);
      expect(updateAccessTokenMock).toHaveBeenCalledWith(
        "fake-decrypted-refresh-token"
      );
    });

    it("should use encryption for newly received token pair", async () => {
      // prepare
      let fakeResultUpdateAccessTokenMock = jest.fn().mockReturnValue({
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
        }),
        fakeDriverFactoryMock = jest.fn().mockReturnValue({
          updateAccessToken: fakeResultUpdateAccessTokenMock
        });
      (oauthService as any).driverFactory = fakeDriverFactoryMock;

      // act
      await oauthService.refreshAccessToken(
        "fake-provider",
        theAuthorization,
      );

      // assert
      expect(cipherEncryptMock).toHaveBeenCalledTimes(2);
      expect(cipherEncryptMock).toHaveBeenNthCalledWith(
        1,
        "new-access-token",
        "fake-insecure-encryption-seed",
      );
      expect(cipherEncryptMock).toHaveBeenNthCalledWith(
        2,
        "new-refresh-token",
        "fake-insecure-encryption-seed",
      );
    });
  });

  describe("callProviderAPI()", () => {
    const theAuthorization = {
        address: "fake-address",
        name: "fake-provider",
        remoteIdentifier: "fake-identifier",
        authorizationHash: "fake-authhash",
        encAccessToken: "fake-encrypted-access-token",
        encRefreshToken: "fake-encrypted-refresh-token",
        expiresAt: new Date().valueOf(),
      } as AccountIntegrationDocument,
      getProviderMock = jest.fn(),
      executeRequestMock = jest.fn(),
      refreshAccessTokenMock = jest.fn().mockReturnValue({
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_at: new Date().valueOf(),
      }),
      driverFactoryMock = jest.fn().mockReturnValue({
        executeRequest: executeRequestMock,
      }),
      getEncryptionSeedMock = jest.fn().mockReturnValue(
        "fake-insecure-encryption-seed"
      ),
      cipherDecryptMock = jest.fn().mockReturnValue(
        "fake-decrypted-access-token",
      );
    beforeEach(() => {
      // following methods are necessary for the `refreshAccessToken()`
      // method and are therefor *mocked* here. These must be tested
      // separately as to permit more granular unit tests here.
      (oauthService as any).getProvider = getProviderMock;
      (oauthService as any).driverFactory = driverFactoryMock;
      (oauthService as any).getEncryptionSeed = getEncryptionSeedMock;
      (oauthService as any).refreshAccessToken = refreshAccessTokenMock;
      (oauthService as any).cipher = {
        decrypt: cipherDecryptMock,
      };

      getProviderMock.mockClear();
      driverFactoryMock.mockClear();
      getEncryptionSeedMock.mockClear();
      cipherDecryptMock.mockClear();
      executeRequestMock.mockClear();
      refreshAccessTokenMock.mockClear();
    });

    it("should throw an error given no authorization", async () => {
      // prepare
      let nullAuthorizationMock = {
        // - missing address field
        name: "fake-provider",
        remoteIdentifier: "fake-identifier",
        authorizationHash: "fake-authhash",
      } as AccountIntegrationDocument;

      // act
      try {
        await oauthService.callProviderAPI(
          "/custom/api/endpoint",
          nullAuthorizationMock,
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

    it("should refresh access token given expired token", async () => {
      // act
      await oauthService.callProviderAPI(
        "/custom/api/endpoint",
        {
          ...theAuthorization,
          expiresAt: Date.UTC(2021, 1, 1).valueOf(),
        } as AccountIntegrationDocument,
      );

      // assert
      expect(refreshAccessTokenMock).toHaveBeenCalledTimes(1);
    });

    it("should decrypt access token from integration document", async () => {
      // act
      await oauthService.callProviderAPI(
        "/custom/api/endpoint",
        theAuthorization,
      );

      // assert
      expect(cipherDecryptMock).toHaveBeenCalledTimes(1);
      expect(cipherDecryptMock).toHaveBeenCalledWith(
        "fake-encrypted-access-token",
        "fake-insecure-encryption-seed",
      );
    });

    it("should use correct provider to load OAuth driver", async () => {
      // act
      await oauthService.callProviderAPI(
        "/custom/api/endpoint",
        theAuthorization,
      );

      // assert
      expect(getProviderMock).toHaveBeenCalledTimes(1);
      expect(driverFactoryMock).toHaveBeenCalledTimes(1);
      expect(getProviderMock).toHaveBeenCalledWith("fake-provider");
      expect(driverFactoryMock).toHaveBeenCalledWith("fake-provider", undefined);
    });

    it("should use correct access token for executeRequest call", async () => {
      // act
      await oauthService.callProviderAPI(
        "/custom/api/endpoint",
        theAuthorization,
      );

      // assert
      expect(getEncryptionSeedMock).toHaveBeenCalledTimes(1);
      expect(cipherDecryptMock).toHaveBeenCalledTimes(1);
      expect(executeRequestMock).toHaveBeenCalledTimes(1);
      expect(executeRequestMock).toHaveBeenCalledWith(
        "fake-decrypted-access-token",
        "/custom/api/endpoint",
        "GET",
        // no-body, no-options, no-headers
        undefined, undefined, undefined,
      );
    });

    it("should have driver sending request with input http options", async () => {
      // prepare
      const httpOptions = {
        method: "GET" as HttpMethod,
        body: { key: "value" },
        options: { option: "value" },
        headers: { header: "value" },
      };

      // act
      await oauthService.callProviderAPI(
        "/custom/api/endpoint",
        theAuthorization,
        httpOptions,
      );

      // assert
      expect(executeRequestMock).toHaveBeenNthCalledWith(
        1,
        cipherDecryptMock(),
        "/custom/api/endpoint",
        httpOptions.method,
        httpOptions.body,
        httpOptions.options,
        httpOptions.headers,
      );
    });
  });

  describe("extractProviderEntity()", () => {
    let getProviderMock = jest.fn(),
        getEntityDefinitionMock = jest.fn().mockReturnValue({
          fake: "entity",
        }),
        driverFactoryMock = jest.fn().mockReturnValue({
          getEntityDefinition: getEntityDefinitionMock
        });
    beforeEach(() => {
      // following methods are necessary for the `extractProviderEntity()`
      // method and are therefor *mocked* here. These must be tested
      // separately as to permit more granular unit tests here.
      (oauthService as any).getProvider = getProviderMock;
      (oauthService as any).driverFactory = driverFactoryMock;

      getProviderMock.mockClear();
      driverFactoryMock.mockClear();
      getEntityDefinitionMock.mockClear();
    });

    it("should accept optional entity type", () => {
      // prepare
      const expectedData = { simple: "data" };
      const expectedType = OAuthEntityType.Custom;

      // act
      oauthService.extractProviderEntity(
        "basic",
        expectedData,
        expectedType,
      );

      // assert
      expect(getProviderMock).toHaveBeenCalledTimes(1);
      expect(getEntityDefinitionMock).toHaveBeenCalledTimes(1);
      expect(getEntityDefinitionMock).toHaveBeenCalledWith(
        expectedData,
        expectedType,
      );
    });

    it("should use Basic OAuth Driver implementation", () => {
      // prepare
      const expectedData = { simple: "data" };

      // act
      oauthService.extractProviderEntity(
        "basic",
        expectedData,
      );

      // assert
      expect(getProviderMock).toHaveBeenCalledTimes(1);
      expect(getEntityDefinitionMock).toHaveBeenCalledTimes(1);
      expect(getEntityDefinitionMock).toHaveBeenCalledWith(
        expectedData,
        undefined, // optional entity type
      );
    });
  });

  describe("getIntegrationByRemoteIdentifier()", () => {
    it("should call findOne() from queryService", async () => {
      // prepare
      const providerParamValue = "test-provider";
      const remoteIdentifierParamValue = "test-remoteIdentifier";
      const findOneMock = jest.fn();
      (oauthService as any).queryService = {
        findOne: findOneMock
      };

      // act
      await oauthService.getIntegrationByRemoteIdentifier(
        providerParamValue,
        remoteIdentifierParamValue,
      );

      // assert
      expect(findOneMock).toHaveBeenNthCalledWith(
        1,
        new AccountIntegrationQuery({
          name: providerParamValue,
          remoteIdentifier: remoteIdentifierParamValue,
        } as AccountIntegrationDocument),
        MockModel,
      )
    });
  });
});
