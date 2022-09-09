/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { httpQueryStringParser } from "../../../mocks/global";
import { BasicOAuthDriver } from "../../../../src/common/drivers/BasicOAuthDriver";
import { StravaOAuthDriver } from "../../../../src/common/drivers/StravaOAuthDriver";
import { OAuthProviderParameters } from "../../../../src/common/models/OAuthConfig";

// fakes an extension to test the getter-only
// dataField and codeField that are used internally
class AnotherDriver extends BasicOAuthDriver {
  public get dataField(): string {
    return "another-data-field";
  }

  public get codeField(): string {
    return "another-code-field";
  }
}

describe("common/StravaOAuthDriver", () => {
  let stravaDriver: StravaOAuthDriver,
      anotherDriver: AnotherDriver;
  let stravaProvider = {
    client_id: "123456",
    client_secret: "ThisIsNotASecret;)",
    oauth_url: "https://www.strava.com/oauth/authorize",
    token_url: "https://www.strava.com/oauth/token",
    callback_url: "http://localhost:8080/oauth/example/callback",
    scope: "activity:read",
  } as OAuthProviderParameters;

  beforeEach(() => {
    stravaDriver = new StravaOAuthDriver(stravaProvider);
    anotherDriver = new AnotherDriver("other", stravaProvider);
  });

  describe("constructor()", () => {
    it("should initialize and create use correct provider name", () => {
      expect(stravaDriver).toBeDefined();
      expect(stravaDriver.providerName).toBe("strava");
    });
  });

  describe("buildAuthorizeQuery()", () => {
    it("should create valid obligatory HTTP Query Parameters", () => {
      // act
      const query: string = (stravaDriver as any).buildAuthorizeQuery("empty");
      const parsed = httpQueryStringParser(query);

      // assert
      expect("client_id" in parsed).toBe(true);
      expect("redirect_uri" in parsed).toBe(true);
      expect("state" in parsed).toBe(true);
    });

    it("should create strava-specific HTTP Query Parameters", () => {
      // act
      const query: string = (stravaDriver as any).buildAuthorizeQuery("empty");
      const parsed = httpQueryStringParser(query);

      // assert
      expect("response_type" in parsed).toBe(true);
      expect("approval_prompt" in parsed).toBe(true);
    });

    it("should include extra data using dataField", () => {
      // act
      const queryNormal: string = 
        (stravaDriver as any).buildAuthorizeQuery("empty");
      const queryOther: string = 
        (anotherDriver as any).buildAuthorizeQuery("empty");

      const parsedNormal = httpQueryStringParser(queryNormal);
      const parsedOther = httpQueryStringParser(queryOther);

      // assert
      expect(stravaDriver.dataField in parsedNormal).toBe(true);
      expect(anotherDriver.dataField in parsedOther).toBe(true);
    });
  });

  describe("getAuthorizeURL()", () => {
    it("should accept an extra and forward to buildAuthorizeQuery", () => {
      // prepare
      const buildAuthorizeQueryMock = jest.fn();
      (stravaDriver as any).buildAuthorizeQuery = buildAuthorizeQueryMock;

      // act
      stravaDriver.getAuthorizeURL("this-is-an-extra");

      // assert
      expect(buildAuthorizeQueryMock).toHaveBeenCalledTimes(1);
      expect(buildAuthorizeQueryMock).toHaveBeenCalledWith("this-is-an-extra");
    });

    it("should use correct oauth_url and include a scope", () => {
      // prepare
      const fakeQuery = "?fake-query=1";
      const buildAuthorizeQueryMock = jest.fn().mockReturnValue(fakeQuery);
      (stravaDriver as any).buildAuthorizeQuery = buildAuthorizeQueryMock;

      // act
      const result: string = stravaDriver.getAuthorizeURL("this-is-an-extra");

      // assert
      expect(result).toBe(
        stravaProvider.oauth_url +
          fakeQuery +
          "&scope=" + stravaProvider.scope
      );
    });
  });

  describe("getAccessToken()", () => {
    const httpServiceCallMock = jest.fn().mockReturnValue({
      status: 200,
      data: {
        access_token: "fake-access-token",
        refresh_token: "fake-refresh-token",
      }
    });
    beforeEach(() => {
      (stravaDriver as any).httpService = { call: httpServiceCallMock };
      (anotherDriver as any).httpService = { call: httpServiceCallMock };

      httpServiceCallMock.mockClear();
    });

    it("should use correct provider token_url and parameters", async () => {
      // prepare
      const expectedParams = {
        client_id: stravaProvider.client_id,
        client_secret: stravaProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
        state: "this-is-an-extra",
      };

      // act
      await stravaDriver.getAccessToken(
        "fake-code",
        "this-is-an-extra",
      );

      // assert
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(httpServiceCallMock).toHaveBeenCalledWith(
        stravaProvider.token_url,
        "POST",
        expectedParams
      );
    });

    it("should include additional data only given non-empty extra", async () => {
      // prepare
      const expectedParams = {
        client_id: stravaProvider.client_id,
        client_secret: stravaProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
        state: "this-is-an-extra",
      };

      // act
      await stravaDriver.getAccessToken("fake-code", "this-is-an-extra");

      // assert
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(httpServiceCallMock).toHaveBeenCalledWith(
        stravaProvider.token_url,
        "POST",
        expectedParams
      );
    });

    it("should not include additional data given empty extra", async () => {
      // prepare
      const expectedParams = {
        client_id: stravaProvider.client_id,
        client_secret: stravaProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
      };

      // act
      await stravaDriver.getAccessToken("fake-code"/* no-extra */);

      // assert
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(httpServiceCallMock).toHaveBeenCalledWith(
        stravaProvider.token_url,
        "POST",
        expectedParams
      );
    });

    it("should include authorization code using codeField", async () => {
      // prepare
      const expectedParamsNormal = {
        client_id: stravaProvider.client_id,
        client_secret: stravaProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
      };
      const expectedParamsOther = {
        client_id: stravaProvider.client_id,
        client_secret: stravaProvider.client_secret,
        grant_type: "authorization_code",
        "another-code-field": "fake-code",
      };

      // act
      await stravaDriver.getAccessToken("fake-code");
      await anotherDriver.getAccessToken("fake-code");

      expect(httpServiceCallMock).toHaveBeenCalledTimes(2);
      expect(httpServiceCallMock).toHaveBeenNthCalledWith(1,
        stravaProvider.token_url,
        "POST",
        expectedParamsNormal
      );
      expect(httpServiceCallMock).toHaveBeenNthCalledWith(2,
        stravaProvider.token_url,
        "POST",
        expectedParamsOther
      );
    });
  });
});
