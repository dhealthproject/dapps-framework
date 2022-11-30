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
import { BasicOAuthDriver } from "../../../../src/oauth/drivers/BasicOAuthDriver";
import { StravaOAuthDriver } from "../../../../src/oauth/drivers/StravaOAuthDriver";
import { OAuthEntityType } from "../../../../src/oauth/drivers/OAuthEntity";
import { OAuthProviderParameters } from "../../../../src/oauth/models/OAuthConfig";

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
      anotherDriver: AnotherDriver,
      mockDate: Date;
  let stravaProvider = {
    client_id: "123456",
    client_secret: "ThisIsNotASecret;)",
    verify_token: "ThisIsAlsoNotASecret;)",
    api_url: "https://www.strava.com/api/v3",
    oauth_url: "https://www.strava.com/api/v3/oauth/authorize",
    token_url: "https://www.strava.com/api/v3/oauth/token",
    callback_url: "http://localhost:8080/oauth/example/callback",
    subscribe_url: "http://localhost:7903/webhook/strava",
    webhook_url: "http://localhost:7903/webhook/strava",
    scope: "activity:read",
  } as OAuthProviderParameters;

  beforeEach(() => {
    stravaDriver = new StravaOAuthDriver(stravaProvider);
    anotherDriver = new AnotherDriver("other", stravaProvider);

    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
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
        athlete: { id: "fake-id" },
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

  describe("extractFromResponse()", () => {
    it ("should extract remote identifier from response given athlete", () => {
      // prepare
      const response = { data: {
        athlete: { id: "fake-id" },
        access_token: "fake-access-token",
        refresh_token: "fake-refresh-token",
        expires_at: mockDate.valueOf() / 1000, // <-- Strava works with SECONDS
      } };

      // act
      const result = (stravaDriver as any).extractFromResponse(
        response.data,
      );

      // assert
      expect(result).toBeDefined();
      expect("accessToken" in result).toBe(true);
      expect("refreshToken" in result).toBe(true);
      expect("expiresAt" in result).toBe(true);
      expect("remoteIdentifier" in result).toBe(true); // <-- is present
      expect(result.accessToken).toBe("fake-access-token");
      expect(result.refreshToken).toBe("fake-refresh-token");
      expect(result.expiresAt).toBe(mockDate.valueOf());
    });
  });

  describe("getEntityDefinition()", () => {
    it("should accept data and optional type", () => {
      // prepare
      const expectedData = { simple: "data" };

      // act
      const actual = stravaDriver.getEntityDefinition(
        expectedData,
      );

      // assert
      expect(actual).toBe(expectedData);
    });

    it("should return data untouched given custom type", () => {
      // prepare
      const expectedData = { simple: "data" };

      // act
      const actual = stravaDriver.getEntityDefinition(
        expectedData,
        OAuthEntityType.Custom,
      );

      // assert
      expect(actual).toBe(expectedData);
    });

    it("should return correct activity data given activity type", () => {
      // prepare
      const expectedData = { empty: "activity" };

      // act
      const actual = stravaDriver.getEntityDefinition(
        expectedData,
        OAuthEntityType.Activity,
      );

      // assert
      expect("name" in actual).toBe(true);
      expect("sport" in actual).toBe(true);
      expect("startedAt" in actual).toBe(true);
      expect("timezone" in actual).toBe(true);
      expect("startLocation" in actual).toBe(true);
      expect("endLocation" in actual).toBe(true);
      expect("hasTrainerDevice" in actual).toBe(true);
      expect("elapsedTime" in actual).toBe(true);
      expect("movingTime" in actual).toBe(true);
      expect("distance" in actual).toBe(true);
      expect("elevation" in actual).toBe(true);
      expect("kilojoules" in actual).toBe(true);
      expect("calories" in actual).toBe(true);
      expect("isManual" in actual).toBe(true);
      expect("sufferScore" in actual).toBe(true);
    });
  })
});
