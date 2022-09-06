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
import { OAuthController } from "../../../../src/common/routes/OAuthController";
import { OAuthService } from "../../../../src/common/services/OAuthService";

const ConfigServiceMock: any = {
  get: jest.fn(),
};
jest.mock("@nestjs/config", () => {
  return { ConfigService: () => ConfigServiceMock };
});

describe("common/OAuthService", () => {
  let oauthService: OAuthService;

  beforeEach(() => {
    oauthService = new OAuthService(ConfigServiceMock);
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
});
