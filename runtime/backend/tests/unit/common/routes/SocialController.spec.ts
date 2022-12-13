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

// Mocks the social configuration
let socialConfig = {
  socialApps: {
    "testPlatform": {
      icon: "test-icon",
      title: "test-title",
      shareUrl: "test-shareUrl",
    }  
  }
};
const socialConfigLoader = jest.fn();
jest.mock("../../../../config/social", () => socialConfigLoader);

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus } from "@nestjs/common";

// internal dependencies
import { AuthService } from "../../../../src/common/services/AuthService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { MockModel } from "../../../mocks/global";
import { SocialController } from "../../../../src/common/routes/SocialController";
import { SocialPlatformDTO } from "../../../../src/common/models/SocialPlatformDTO";

describe("common/SocialController", () => {
  let controller: SocialController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialController],
      providers: [
        ConfigService,
        AuthService,
        AccountSessionsService,
        NetworkService,
        AccountsService,
        ChallengesService,
        JwtService,
        QueryService,
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        },
      ],
    }).compile();

    controller = module.get<SocialController>(SocialController);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("find()", () => {
    it("should return correct result", () => {
      // prepare
      const appUrl = "test-appUrl";
      const icon = "test-icon";
      const profileUrl = "test-profileUrl";
      const shareUrl = "test-shareUrl";
      const title = "test-title";
      const expectedResult = new SocialPlatformDTO();
      expectedResult.appUrl = appUrl;
      expectedResult.icon = icon;
      expectedResult.profileUrl = profileUrl;
      expectedResult.shareUrl = shareUrl;
      expectedResult.title = title;
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue({
          platform: expectedResult
        });

      // act
      const result = (controller as any).find();

      // assert
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "socialApps");
      expect(result).toEqual([expectedResult]);
    });
  });

  describe("share()", () => {
    it("should run correctly & return correct result", () => {
      // prepare
      socialConfigLoader.mockReturnValue(socialConfig);
      const expectedResult = {};
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue(expectedResult);

      // act
      const result = (controller as any).share("testPlatform");

      // assert
      expect(socialConfigLoader).toHaveBeenCalledTimes(1);
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "socialApps.testPlatform");
      expect(result).toEqual(expectedResult);
    });

    it("should throw correct exception when social config is not valid", () => {
      [ undefined, {}, { key: "value" }, { socialApps: {} }, { socialApps: { key: "value" } } ].forEach(value => {
        // prepare
        socialConfigLoader.mockReturnValue(value);
        const expectedException = new HttpException("Bad Request", HttpStatus.BAD_REQUEST);

        // act
        const result = () => (controller as any).share("testPlatform");

        // assert
        expect(result).toThrow(expectedException);
      });
    });
  });
});