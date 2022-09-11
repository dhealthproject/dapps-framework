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
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AuthenticationPayload, AuthService, CookiePayload } from "../../../../src/common/services/AuthService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { AccountDocument, AccountQuery } from "../../../../src/common/models/AccountSchema";

describe("common/AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        NetworkService, // requirement from AuthService
        AccountsService, // requirement from AuthService
        ChallengesService, // requirement from AuthService
        JwtService, // requirement from AuthService
        QueryService, // requirement from AuthService
        ConfigService, // requirement from AuthService
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

    authService = module.get<AuthService>(AuthService);
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
          "Authorization": "Bearer: ThisIsAFakeAccessTokenWithWrongFormat"
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
      const findOneMock = jest.fn();
      (authService as any).accountsService = {
        findOne: findOneMock,
      };

      // act
      await authService.getAccount(request as any, "fake-cookie-name");

      // assert
      expect(findOneMock).toHaveBeenCalledTimes(1);
      expect(findOneMock).toHaveBeenCalledWith(new AccountQuery({
        accessToken: expectedToken,
      } as AccountDocument));
    });
  });

  describe("getAccountQuery()", () => {
    let payload: AuthenticationPayload = {
      sub: "fake-user",
      address: "fake-address"
    };

    it("should use authentication payload in account query", () => {
      // act
      const query = (authService as any).getAccountQuery(payload);

      // assert
      expect(query).toBeDefined();
      expect("document" in query).toBe(true);
      expect("address" in query.document).toBe(true);
      expect(query.document.address).toBe("fake-address");
    });
  });

  // describe("getTransactionQuery()", () => {

  // });

  // describe("findRecentChallenge()", () => {

  // });

  // describe("validateChallenge()", () => {

  // });

  // describe("getAccessToken()", () => {

  // });

  // describe("refreshAccessToken()", () => {

  // });
});
