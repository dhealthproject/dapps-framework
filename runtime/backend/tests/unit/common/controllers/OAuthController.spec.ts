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
import { ConfigService } from "@nestjs/config";

// external dependencies
import { OAuthController } from "../../../../src/common/routes/OAuthController";
import { OAuthService } from "../../../../src/common/services/OAuthService";

const configForRootCall: any = jest.fn(() => ConfigServiceMock);
const ConfigServiceMock: any = { get: configForRootCall };
jest.mock("@nestjs/config", () => {
  return { ConfigService: () => ConfigServiceMock };
});

describe("OAuthController", () => {
  let oauthController: OAuthController;
  let oauthService: OAuthService;

  // beforeEach(() => {
  //   oauthService = new OAuthService(ConfigServiceMock);
  //   oauthController = new OAuthController(oauthService);
  // });

  // describe("getRedirectUrl()", () => {
  //   it("should return correct url when valid data provided", () => {
  //     const result =
  //       "https://www.strava.com/oauth/authorize?client_id=92236&response_type=code&approval_prompt=auto&scope=activity:read_all&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&state=NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA23423rwfdsf";

  //     expect(
  //       oauthService.getRedirectURL(
  //         "strava",
  //         "NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA",
  //         "23423rwfdsf",
  //       ),
  //     ).toBe(result);
  //   });
  // });
});
