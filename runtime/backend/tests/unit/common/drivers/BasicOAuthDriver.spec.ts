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

describe("common/BasicOAuthDriver", () => {
  let basicDriver: BasicOAuthDriver;
  let fakeProvider = {
    client_id: "123456",
    client_secret: "ThisIsNotASecret;)",
    oauth_url: "http://example.com/oauth/authorize",
    token_url: "http://example.com/oauth/token",
    callback_url: "http://localhost:8080/oauth/example/callback",
    scope: "this:fake-scope",
  } as OAuthProviderParameters;

  beforeEach(() => {
    basicDriver = new BasicOAuthDriver("fake-provider", fakeProvider);
  });

  describe("constructor()", () => {
    it("should initialize and create httpService instance", () => {
      expect(basicDriver).toBeDefined();
      expect((basicDriver as any).httpService).toBeDefined();
    });
  });

  describe("buildAuthorizeQuery()", () => {
    it("should create valid obligatory HTTP Query Parameters", () => {
      // act
      const query: string = (basicDriver as any).buildAuthorizeQuery("empty");
      const parsed = httpQueryStringParser(query);

      // assert
      expect("client_id" in parsed).toBe(true);
      expect("redirect_uri" in parsed).toBe(true);
      expect("state" in parsed).toBe(true);
    });

    it("should include client_id for authorization", () => {
      // act
      const query: string = (basicDriver as any).buildAuthorizeQuery("empty");

      // assert
      expect(query.match(/^\?client_id/)).not.toBeNull();
      expect(query.startsWith("?client_id=123456&")).toBe(true);
    });

    it("should encode redirect_uri with encodeURI", () => {
      // prepare
      const encodedUrl = "http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fexample%2Fcallback";

      // act
      const query: string = (basicDriver as any).buildAuthorizeQuery("empty");
      const parsed = httpQueryStringParser(query, false);

      // assert
      expect("redirect_uri" in parsed).toBe(true);
      expect(parsed.redirect_uri).toBe(encodedUrl);
    });

    it("should include extra data using dataField", () => {
      // prepare
      const basicDriver2 = new AnotherDriver("fake-provider", fakeProvider);

      // act
      const queryNormal: string = 
        (basicDriver as any).buildAuthorizeQuery("empty");
      const queryOther: string = 
        (basicDriver2 as any).buildAuthorizeQuery("empty");

      const parsedNormal = httpQueryStringParser(queryNormal);
      const parsedOther = httpQueryStringParser(queryOther);

      // assert
      expect(basicDriver.dataField in parsedNormal).toBe(true);
      expect(basicDriver2.dataField in parsedOther).toBe(true);
    });
  });

  describe("getAuthorizeURL()", () => {
    it("should accept an extra and forward to buildAuthorizeQuery", () => {
      // prepare
      const buildAuthorizeQueryMock = jest.fn();
      (basicDriver as any).buildAuthorizeQuery = buildAuthorizeQueryMock;

      // act
      basicDriver.getAuthorizeURL("this-is-an-extra");

      // assert
      expect(buildAuthorizeQueryMock).toHaveBeenCalledTimes(1);
      expect(buildAuthorizeQueryMock).toHaveBeenCalledWith("this-is-an-extra");
    });

    it("should use correct oauth_url and include a scope", () => {
      // prepare
      const fakeQuery = "?fake-query=1";
      const buildAuthorizeQueryMock = jest.fn().mockReturnValue(fakeQuery);
      (basicDriver as any).buildAuthorizeQuery = buildAuthorizeQueryMock;

      // act
      const result: string = basicDriver.getAuthorizeURL("this-is-an-extra");

      // assert
      expect(result).toBe(
        fakeProvider.oauth_url +
          fakeQuery +
          "&scope=" + fakeProvider.scope
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
      (basicDriver as any).httpService = {
        call: httpServiceCallMock
      };

      httpServiceCallMock.mockClear();
    });

    it("should use correct provider token_url and parameters", async () => {
      // prepare
      const expectedParams = {
        client_id: fakeProvider.client_id,
        client_secret: fakeProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
        state: "this-is-an-extra",
      };

      // act
      await basicDriver.getAccessToken(
        "fake-code",
        "this-is-an-extra",
      );

      // assert
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(httpServiceCallMock).toHaveBeenCalledWith(
        fakeProvider.token_url,
        "POST",
        expectedParams
      );
    });

    it("should include additional data only given non-empty extra", async () => {
      // prepare
      const expectedParams = {
        client_id: fakeProvider.client_id,
        client_secret: fakeProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
        state: "this-is-an-extra",
      };

      // act
      await basicDriver.getAccessToken("fake-code", "this-is-an-extra");

      // assert
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(httpServiceCallMock).toHaveBeenCalledWith(
        fakeProvider.token_url,
        "POST",
        expectedParams
      );
    });

    it("should not include additional data given empty extra", async () => {
      // prepare
      const expectedParams = {
        client_id: fakeProvider.client_id,
        client_secret: fakeProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
      };

      // act
      await basicDriver.getAccessToken("fake-code"/* no-extra */);

      // assert
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(httpServiceCallMock).toHaveBeenCalledWith(
        fakeProvider.token_url,
        "POST",
        expectedParams
      );
    });

    it("should include authorization code using codeField", async () => {
      // prepare
      const basicDriver2 = new AnotherDriver("fake-provider", fakeProvider);
      (basicDriver2 as any).httpService = {
        call: httpServiceCallMock
      };
      const expectedParamsNormal = {
        client_id: fakeProvider.client_id,
        client_secret: fakeProvider.client_secret,
        grant_type: "authorization_code",
        code: "fake-code",
      };
      const expectedParamsOther = {
        client_id: fakeProvider.client_id,
        client_secret: fakeProvider.client_secret,
        grant_type: "authorization_code",
        "another-code-field": "fake-code",
      };

      // act
      await basicDriver.getAccessToken("fake-code");
      await basicDriver2.getAccessToken("fake-code");

      expect(httpServiceCallMock).toHaveBeenCalledTimes(2);
      expect(httpServiceCallMock).toHaveBeenNthCalledWith(1,
        fakeProvider.token_url,
        "POST",
        expectedParamsNormal
      );
      expect(httpServiceCallMock).toHaveBeenNthCalledWith(2,
        fakeProvider.token_url,
        "POST",
        expectedParamsOther
      );
    });
  });
});
