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

// Mocks the full dApp config.
jest.mock("../../../../config/dapp", () =>
  jest.fn().mockReturnValue({ dappName: "fake-cookie-name" })
);

// Mocks the contract factory.
let factoryCreatedContract = {
  signature: "elevate:auth",
  inputs: {
    challenge: "test-challenge",
  },
};
let validContractPayload = {
  contract: "elevate:auth",
  challenge: "test-challenge",
};
let createFromTransactionCall = jest.fn();
jest.mock("@dhealth/contracts", () => ({
  Factory: {
    createFromTransaction: createFromTransactionCall,
  }
}));

// external dependencies
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Address, Order, Transaction, TransactionType } from "@dhealth/sdk";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AuthenticationPayload, AuthService, CookiePayload } from "../../../../src/common/services/AuthService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { Factory } from "@dhealth/contracts";
import { AccountSessionDocument, AccountSessionQuery } from "../../../../src/common/models/AccountSessionSchema";

describe("common/AuthService", () => {
  let authService: AuthService;
  const httpUnauthorizedError = new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        AccountSessionsService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        QueryService, // requirement from AuthService
        ConfigService, // requirement from AuthService
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

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("constructor()", () => {
    it("should create base configuration for cookies", () => {
      // act
      const cookie: CookiePayload = (authService as any).cookie;

      // assert
      expect("name" in cookie).toBe(true);
      expect("domain" in cookie).toBe(true);
      expect("secret" in cookie).toBe(true);
    });
  });

  describe("extractToken()", () => {
    it("should return null with no cookie", () => {
      // act
      const result = AuthService.extractToken(
        {} as any,
      );

      // assert
      expect(result).toBe(null);
    });

    it("should return correct result with ", () => {
      // prepare
      const expectedResults = [
        "test-fromSignedCookies",
        "test-fromRequestCookies",
        "test-fromRequestHeaders",
      ];
      [
        {
          signedCookies: { cookieName: "test-fromSignedCookies" }
        },
        {
          cookies: { cookieName: "test-fromRequestCookies" }
        },
        {
          headers: { Authorization: "Bearer test-fromRequestHeaders" }
        }
      ].forEach((request, index) => {
        // act
        const result = AuthService.extractToken(
          request as any,
          "cookieName",
        );

        // assert
        expect(result).toBe(expectedResults[index]);
      });
    });
  });


  describe("getCookie()", () => {
    it("should exclude secret from cookie payload", () => {
      // act
      const cookie: CookiePayload = authService.getCookie();

      // assert
      expect("name" in cookie).toBe(true);
      expect("domain" in cookie).toBe(true);
      expect("secret" in cookie).toBe(false); // not!
    });

    it("should use correct configuration values", () => {
      // prepare
      (authService as any).cookie = {
        name: "fake-dapp",
        domain: "fake-dapp-host"
      };

      // act
      const cookie: CookiePayload = authService.getCookie();

      // assert
      expect("name" in cookie).toBe(true);
      expect("domain" in cookie).toBe(true);
      expect(cookie.name).toBe("fake-dapp");
      expect(cookie.domain).toBe("fake-dapp-host");
    });
  });

  describe("getChallenge()", () => {
    it("should use correct challenge size from config", () => {
      // prepare
      const expectedSize = 8;
      (authService as any).challengeSize = expectedSize;

      // act
      const challenge: string = authService.getChallenge();

      // assert
      expect(challenge).toBeDefined();
      expect(challenge.length).toBe(expectedSize);
    });
  });

  describe("extractToken()", () => {
    it("should use signed cookies with priority", () => {
      // prepare
      const expectedToken = "ThisIsAFakeAccessTokenWithWrongFormat";
      let request = {
        signedCookies: {
          "fake-cookie-name": expectedToken,
        }
      };

      // act
      const token: string = AuthService.extractToken(
        request as any,
        "fake-cookie-name",
      );

      // assert
      expect(token).toBeDefined();
      expect(token).not.toBeNull();
      expect(token).toBe(expectedToken);
    });

    it("should use request cookies given none signed", () => {
      // prepare
      const expectedToken = "ThisIsAFakeAccessTokenWithWrongFormat";
      let request: any = {
        // empty signed cookies
        signedCookies: undefined,
        // then load from request cookies
        cookies: {
          "fake-cookie-name": expectedToken,
        }
      };

      // act
      const token: string = AuthService.extractToken(
        request as any,
        "fake-cookie-name",
      );

      // assert
      expect(token).toBeDefined();
      expect(token).not.toBeNull();
      expect(token).toBe(expectedToken);
    });

    it("should use authorization header given no cookies", () => {
      // prepare
      const expectedToken = "ThisIsAFakeAccessTokenWithWrongFormat";
      let request: any = {
        // empty signed cookies
        signedCookies: undefined,
        // empty request cookies
        cookies: undefined,
        // then load from headers
        headers: {
          "Authorization": "ThisIsAFakeAccessTokenWithWrongFormat"
        }
      };

      // act
      const token: string = AuthService.extractToken(
        request as any,
        "fake-cookie-name",
      );

      // assert
      expect(token).toBeDefined();
      expect(token).not.toBeNull();
      expect(token).toBe(expectedToken);
    });

    it("should remove Bearer prefix if necessary", () => {
      // prepare
      const expectedToken = "ThisIsAFakeAccessTokenWithWrongFormat";
      let request: any = {
        // empty signed cookies
        signedCookies: undefined,
        // empty request cookies
        cookies: undefined,
        // then load from headers
        headers: {
          "Authorization": "Bearer ThisIsAFakeAccessTokenWithWrongFormat"
        }
      };

      // act
      const token: string = AuthService.extractToken(
        request as any,
        "fake-cookie-name",
      );

      // assert
      expect(token).toBeDefined();
      expect(token).not.toBeNull();
      expect(token).toBe(expectedToken);
    });
  });

  describe("getAccount()", () => {
    const expectedToken = "ThisIsAFakeAccessTokenWithWrongFormat";
    let request = {
      signedCookies: {
        "fake-cookie-name": expectedToken,
      }
    };

    it("should use indexed access token in account query", async () => {
      // prepare
      const findOneMock = jest.fn().mockResolvedValue({address: "test-address"});
      (authService as any).accountSessionsService = {
        findOne: findOneMock,
      };

      // act
      await authService.getAccount(request as any, "fake-cookie-name");

      // assert
      expect(findOneMock).toHaveBeenCalledTimes(1);
      expect(findOneMock).toHaveBeenCalledWith(new AccountSessionQuery({
        accessToken: expectedToken,
      } as AccountSessionDocument));
    });

    it("should return correct account with no cookie name", async () => {
      // prepare
      const findOneMock = jest.fn().mockResolvedValue({address: "test-address"});
      (authService as any).accountSessionsService = {
        findOne: findOneMock,
      };

      // act
      await authService.getAccount(request as any);

      // assert
      expect(findOneMock).toHaveBeenCalledTimes(1);
      expect(findOneMock).toHaveBeenCalledWith(new AccountSessionQuery({
        accessToken: expectedToken,
      } as AccountSessionDocument));
    });
  });

  describe("getAccountSessionQuery()", () => {
    let payload: AuthenticationPayload = {
      sub: "fake-user",
      address: "fake-address"
    };

    it("should use authentication payload in account query", () => {
      // act
      const query = (authService as any).getAccountSessionQuery(payload);

      // assert
      expect(query).toBeDefined();
      expect("document" in query).toBe(true);
      expect("address" in query.document).toBe(true);
      expect(query.document.address).toBe("fake-address");
    });
  });

  describe("getTransactionQuery()", () => {
    it("should return correct result", () => {
      // prepare
      const configServiceGetCall = jest.fn().mockReturnValue(["test-registry"]);
      (authService as any).configService = {
        get: configServiceGetCall,
      }
      const address = Address.createFromRawAddress("test-address");
      const accountSessionsServiceCreateAddressCall = jest
        .spyOn(AccountsService, "createAddress")
        .mockReturnValue(address);
      const expectedResult = {
        recipientAddress: address,
        type: [TransactionType.TRANSFER],
        embedded: false,
        order: Order.Desc,
        pageNumber: 1,
        pageSize: 100,
      };

      // act
      const result = (authService as any).getTransactionQuery("test-registry");

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(1);
      expect(accountSessionsServiceCreateAddressCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expectedResult);
    });

    it("should return null if registry is not in registries list", () => {
      // prepare
      const configServiceGetCall = jest.fn().mockReturnValue(["test-registry1"]);
      (authService as any).configService = {
        get: configServiceGetCall,
      }
      const address = Address.createFromRawAddress("test-address");
      const accountSessionsServiceCreateAddressCall = jest
        .spyOn(AccountsService, "createAddress")
        .mockReturnValue(address);
      const expectedResult: object = null;

      // act
      const result = (authService as any).getTransactionQuery("test-registry2");

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(1);
      expect(accountSessionsServiceCreateAddressCall).toHaveBeenCalledTimes(0);
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("findRecentChallenge()", () => {
    it("should return correct result", async () => {
      // prepare
      createFromTransactionCall.mockReturnValue(factoryCreatedContract);
      const getTransactionQueryCall = jest
        .spyOn((authService as any), "getTransactionQuery")
        .mockReturnValue({});
      const transactionRepository = {
        search: jest.fn().mockReturnValue({
          toPromise: jest.fn().mockResolvedValue({})
        }),
      };
      const mockValidTransferWithChallenge = {
        type: TransactionType.TRANSFER,
        message: {
          payload: JSON.stringify(validContractPayload)
        }
      };
      const networkServiceDelegatePromisesCall = jest.fn().mockResolvedValue([
        {
          data: [mockValidTransferWithChallenge], // <-- inject transfer with challenge
        },
      ]);
      (authService as any).networkService = {
        transactionRepository,
        delegatePromises: networkServiceDelegatePromisesCall
      };
      (authService as any).cookie = { name: "ELEVATE" };

      // act
      const result = await (authService as any).findRecentChallenge(
        "test-registry",
        "test-challenge",
      );

      // assert
      expect(getTransactionQueryCall).toHaveBeenCalledTimes(1);
      expect(networkServiceDelegatePromisesCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(mockValidTransferWithChallenge);
    });

    it("should return undefined if registry is not defined", async () => {
      // act
      const result = await (authService as any).findRecentChallenge(
        null,
        "test-challenge",
      );

      // assert
      expect(result).toBeUndefined();
    });

    it("should return undefined if cannot get transaction query from registry", async () => {
      // prepare
      const getTransactionQueryCall = jest
        .spyOn((authService as any), "getTransactionQuery")
        .mockReturnValue(null);

      // act
      const result = await (authService as any).findRecentChallenge(
        "test-registry",
        "test-challenge",
      );

      // assert
      expect(getTransactionQueryCall).toHaveBeenNthCalledWith(1, "test-registry");
      expect(result).toBeUndefined();
    });

    it("should return undefined if contract signature is not 'elevate:auth'", async () => {
      // prepare
      createFromTransactionCall.mockReturnValue({
        signature: "elevate:referral",
        inputs: {
          challenge: "test-challenge",
        },
      });
      const getTransactionQueryCall = jest
        .spyOn((authService as any), "getTransactionQuery")
        .mockReturnValue({});
      const transactionRepository = {
        search: jest.fn().mockReturnValue({
          toPromise: jest.fn().mockResolvedValue({})
        }),
      };
      const mockValidTransferWithChallenge = {
        type: TransactionType.TRANSFER,
        message: {
          payload: JSON.stringify({
            contract: "elevate:referral",
            challenge: "test-challenge",
          })
        }
      };
      const networkServiceDelegatePromisesCall = jest.fn().mockResolvedValue([
        {
          data: [mockValidTransferWithChallenge], // <-- inject transfer with challenge
        },
      ]);
      (authService as any).networkService = {
        transactionRepository,
        delegatePromises: networkServiceDelegatePromisesCall
      };
      (authService as any).cookie = { name: "ELEVATE" };

      // act
      const result = await (authService as any).findRecentChallenge(
        "test-registry",
        "test-challenge",
      );

      // assert
      expect(getTransactionQueryCall).toHaveBeenCalledTimes(1);
      expect(networkServiceDelegatePromisesCall).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it("should return undefined if error was caught", async () => {
      // prepare
      const transactionRepository = {
        search: jest.fn().mockReturnValue({
          toPromise: jest.fn().mockResolvedValue({})
        }),
      };
      const getTransactionQueryCall = jest
        .spyOn((authService as any), "getTransactionQuery")
        .mockReturnValue([]);
      const networkServiceDelegatePromisesCall = jest.fn().mockResolvedValue([
        { data: [{}] },
      ]);
      (authService as any).networkService = {
        transactionRepository,
        delegatePromises: networkServiceDelegatePromisesCall
      };
      const factoryCreateFromTransactionCall = jest.fn(() => {
        throw new Error();
      });
      Factory.createFromTransaction = factoryCreateFromTransactionCall;

      // act
      const result = await (authService as any).findRecentChallenge(
        "test-registry",
        "test-challenge",
      );

      // assert
      expect(getTransactionQueryCall).toHaveBeenCalledTimes(1);
      expect(networkServiceDelegatePromisesCall).toHaveBeenCalledTimes(1);
      expect(factoryCreateFromTransactionCall).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe("validateChallenge()", () => {
    it("should responds with error if the challenge was used before", () => {
      // prepare
      (authService as any).challengesService = {
        exists: jest.fn().mockResolvedValue(true),
      };

      // act
      const validateChallenge = () => (authService as any).validateChallenge({
        challlenge: "test-challenge",
        sub: "test-sub",
      });

      // assert
      expect(validateChallenge).rejects.toEqual(httpUnauthorizedError);
    });

    it("should responds with error if the challenge could not be found", () => {
      // prepare
      (authService as any).challengesService = {
        exists: jest.fn().mockResolvedValue(false),
      };
      (authService as any).findRecentChallenge =
        jest.fn().mockResolvedValue(undefined);

      // act
      const validateChallenge = () => (authService as any).validateChallenge({
        challlenge: "test-challenge",
        sub: "test-sub",
      });

      // assert
      expect(validateChallenge).rejects.toEqual(httpUnauthorizedError);
    });

    it("should responds with correct result", async () => {
      // prepare
      (authService as any).challengesService = {
        exists: jest.fn().mockResolvedValue(false),
        createOrUpdate: jest.fn().mockResolvedValue({}),
      };
      (authService as any).findRecentChallenge =
        jest.fn().mockResolvedValue({
          signer: {
            address: {
              plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
            },
          },
          transactionInfo: {
            hash: "fakeHash1",
          },
        });
      const expectedResult = {
        sub: "test-sub",
        address: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
      };

      // act
      const result = await (authService as any).validateChallenge({
        challlenge: "test-challenge",
        sub: "test-sub",
      });

      // assert
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("getAccessToken()", () => {
    it("should return correct result with no account existing", async () => {
      // prepare
      const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue(null);
      const accountSessionsServiceCreateOrUpdateCall = jest.fn().mockResolvedValue({});
      (authService as any).accountSessionsService = {
        findOne: accountSessionsServiceFindOneCall,
        createOrUpdate: accountSessionsServiceCreateOrUpdateCall,
      };
      const jwtServicesSignCall = jest.fn()
        .mockReturnValueOnce("test-accessToken")
        .mockReturnValueOnce("test-refreshToken");
      (authService as any).jwtService = {
        sign: jwtServicesSignCall,
      };

      // act
      const result = await authService.getAccessToken({} as AuthenticationPayload);

      // assert
      expect(accountSessionsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(jwtServicesSignCall).toHaveBeenCalledTimes(2);
      expect(accountSessionsServiceCreateOrUpdateCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        accessToken: "test-accessToken",
        refreshToken: "test-refreshToken",
      })
    });

    it("should return correct result with account existing but no token information", async () => {
      // prepare
      const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue({});
      const accountSessionsServiceCreateOrUpdateCall = jest.fn().mockResolvedValue({});
      (authService as any).accountSessionsService = {
        findOne: accountSessionsServiceFindOneCall,
        createOrUpdate: accountSessionsServiceCreateOrUpdateCall,
      };
      const jwtServicesSignCall = jest.fn()
        .mockReturnValueOnce("test-accessToken")
        .mockReturnValueOnce("test-refreshToken");
      (authService as any).jwtService = {
        sign: jwtServicesSignCall,
      };

      // act
      const result = await authService.getAccessToken({} as AuthenticationPayload);

      // assert
      expect(accountSessionsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(jwtServicesSignCall).toHaveBeenCalledTimes(2);
      expect(accountSessionsServiceCreateOrUpdateCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        accessToken: "test-accessToken",
        refreshToken: "test-refreshToken",
      })
    });

    it("should return correct result with account and token information", async () => {
      // prepare
      const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue({
        accessToken: "test-accessToken",
        refreshTokenHash: "test-refreshToken",
      });
      const accountSessionsServiceCreateOrUpdateCall = jest.fn().mockResolvedValue({});
      (authService as any).accountSessionsService = {
        findOne: accountSessionsServiceFindOneCall,
        createOrUpdate: accountSessionsServiceCreateOrUpdateCall,
      };
     const jwtServicesVerifyCall = jest.fn().mockReturnValue(true);
      (authService as any).jwtService = {
        verify: jwtServicesVerifyCall,
      };

      // act
      const result = await authService.getAccessToken({} as AuthenticationPayload);

      // assert
      expect(accountSessionsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(jwtServicesVerifyCall).toHaveBeenCalledTimes(1);
      expect(accountSessionsServiceCreateOrUpdateCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        accessToken: "test-accessToken",
      });
    });

    it("should return correct result with referral code", async () => {
      // prepare
      const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue({
        accessToken: "test-accessToken",
        refreshTokenHash: "test-refreshToken",
      });
      const accountSessionsServiceCreateOrUpdateCall = jest.fn().mockResolvedValue({});
      (authService as any).accountSessionsService = {
        findOne: accountSessionsServiceFindOneCall,
        createOrUpdate: accountSessionsServiceCreateOrUpdateCall,
      };
     const jwtServicesVerifyCall = jest.fn().mockReturnValue(true);
      (authService as any).jwtService = {
        verify: jwtServicesVerifyCall,
      };
      const accountsServiceFindOneCall = jest.fn().mockResolvedValue({ address: "test-referrerAddress" });
      (authService as any).accountsService = {
        findOne: accountsServiceFindOneCall,
      };

      // act
      const result = await authService.getAccessToken(
        {
          address: "test-address",
          referralCode: "test-referralCode",
        } as AuthenticationPayload
      );

      // assert
      expect(accountSessionsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(jwtServicesVerifyCall).toHaveBeenCalledTimes(1);
      expect(accountSessionsServiceCreateOrUpdateCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        accessToken: "test-accessToken",
      });
    });

    it("should create a new token when current token is expired", async () => {
      // prepare
      const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue({
        accessToken: "test-accessToken",
        refreshTokenHash: "test-refreshToken",
      });
      const accountSessionsServiceCreateOrUpdateCall = jest.fn().mockResolvedValue({});
      (authService as any).accountSessionsService = {
        findOne: accountSessionsServiceFindOneCall,
        createOrUpdate: accountSessionsServiceCreateOrUpdateCall,
      };
      const jwtServicesSignCall = jest.fn()
        .mockReturnValueOnce("new-test-accessToken");
      const jwtServicesVerifyCall = jest.fn(() => {
        throw {
          name: "TokenExpiredError",
        }
      });
      (authService as any).jwtService = {
        sign: jwtServicesSignCall,
        verify: jwtServicesVerifyCall,
      };

      // act
      const result = await authService.getAccessToken({} as AuthenticationPayload);

      // assert
      expect(accountSessionsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(jwtServicesSignCall).toHaveBeenCalledTimes(1);
      expect(jwtServicesVerifyCall).toHaveBeenCalledTimes(1);
      expect(accountSessionsServiceCreateOrUpdateCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        accessToken: "new-test-accessToken",
      });
    });

    it("should throw correct error if error was caught during process", () => {
      // prepare
      const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue({});
      const accountSessionsServiceCreateOrUpdateCall = jest.fn().mockResolvedValue({});
      (authService as any).accountSessionsService = {
        findOne: accountSessionsServiceFindOneCall,
        createOrUpdate: accountSessionsServiceCreateOrUpdateCall,
      };
      const jwtServicesVerifyCall = jest.fn(() => {
        throw new Error();
      });
      (authService as any).jwtService = {
        verify: jwtServicesVerifyCall,
      };

      // act
      const result = () => authService.getAccessToken({} as AuthenticationPayload);

      // assert
      expect(result).rejects.toStrictEqual(httpUnauthorizedError);
    });
  });

  describe("refreshAccessToken()", () => {
    it("should responds with error if the account was not previously logged-in", () => {
      // prepare
      [undefined, {}].forEach(async (account, index) => {
        const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue(account);
        (authService as any).accountSessionsService = {
          findOne: accountSessionsServiceFindOneCall,
        };

        // act
        const result = () => authService.refreshAccessToken("test-userAddress", "test-refreshToken");

        // assert
        expect(result).rejects.toStrictEqual(httpUnauthorizedError);
      });
    });

    it("should return correct result", async () => {
      // prepare
      const accountSessionsServiceFindOneCall = jest.fn().mockResolvedValue({
        lastSessionHash: "fakeHash1",
        address: "test-address"
      });
      const accountSessionsServiceCreateOrUpdateCall = jest.fn().mockResolvedValue({});
      (authService as any).accountSessionsService = {
        findOne: accountSessionsServiceFindOneCall,
        createOrUpdate: accountSessionsServiceCreateOrUpdateCall,
      };
      const jwtServicesSignCall = jest.fn()
        .mockReturnValueOnce("test-accessToken");
      (authService as any).jwtService = {
        sign: jwtServicesSignCall,
      };
      const expectedResult = { accessToken: "test-accessToken" };

      // act
      const result = await authService.refreshAccessToken("test-userAddress", "test-refreshToken");

      // assert
      expect(accountSessionsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(accountSessionsServiceCreateOrUpdateCall).toHaveBeenCalledTimes(1);
      expect(jwtServicesSignCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
