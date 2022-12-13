/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// Mocks configuration resources because the `ConfigController`
// needs some of these values and reads it from configuration.
jest.mock("../../../../config/dapp", () => {
  return () => ({
    dappName: "fake-dapp",
  });
});
jest.mock("../../../../config/assets", () => {
  return () => ({
    assets: {
      earn: {
        divisibility: 6,
        mosaicId: "fake-mosaic-id",
      }
    }
  });
});
jest.mock("../../../../config/security", () => {
  return () => ({
    auth: {
      registries: [
        "fake-registry-address",
      ]
    }
  });
});

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { ConfigController } from "../../../../src/common/routes/ConfigController";
import { DappConfigDTO } from "../../../../src/common/models/DappConfigDTO";
import { AssetsConfig } from "../../../../src/common/models/AssetsConfig";
import { DappConfig } from "../../../../src/common/models/DappConfig";
import { SecurityConfig } from "../../../../src/common/models/SecurityConfig";

// configuration resources
import dappConfigLoader from "../../../../config/dapp";
import assetsConfigLoader from "../../../../config/assets";
import securityConfigLoader from "../../../../config/security";

describe("common/ConfigController", () => {
  let controller: ConfigController,
      assetsConfig: AssetsConfig,
      dappConfig: DappConfig,
      securityConfig: SecurityConfig;

  beforeEach(async () => {
    dappConfig = dappConfigLoader();
    assetsConfig = assetsConfigLoader();
    securityConfig = securityConfigLoader();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigController],
      providers: [
        ConfigService, // requirement form ConfigController
      ],
    }).compile();

    controller = module.get<ConfigController>(ConfigController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("find()", () => {
    it("should return configuration using config service", async () => {
      // prepare
      (controller as any).configService = {
        get: jest.fn()
          .mockReturnValueOnce(dappConfig.dappName)
          .mockReturnValueOnce(assetsConfig.assets.earn)
          .mockReturnValueOnce(securityConfig.auth.registries),
      };
      const expectedResult: DappConfigDTO = new DappConfigDTO();
      expectedResult.dappName = dappConfig.dappName;
      expectedResult.authRegistry = securityConfig.auth.registries[0];
      expectedResult.earnAssetDivisibility = assetsConfig.assets.earn.divisibility;
      expectedResult.earnAssetIdentifier = assetsConfig.assets.earn.mosaicId;

      // act
      const result = await controller.find();

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});
