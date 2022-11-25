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

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { ConfigController } from "../../../../src/common/routes/ConfigController";
import { DappConfigDTO } from "../../../../src/common/models/DappConfigDTO";
import { AssetsConfig } from "../../../../src/common/models/AssetsConfig";
import { DappConfig } from "../../../../src/common/models/DappConfig";

// configuration resources
import dappConfigLoader from "../../../../config/dapp";
import assetsConfigLoader from "../../../../config/assets";

describe("common/ConfigController", () => {
  let controller: ConfigController,
      assetsConfig: AssetsConfig,
      dappConfig: DappConfig;

  beforeEach(async () => {
    dappConfig = dappConfigLoader();
    assetsConfig = assetsConfigLoader();

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

  describe("getConfig()", () => {
    it("should return correct configuration", async () => {
      // prepare
      (controller as any).configService = {
        get: jest.fn()
          .mockReturnValueOnce(dappConfig.dappName)
          .mockReturnValueOnce(assetsConfig.assets.earn),
      };
      const expectedResult: DappConfigDTO = {
        dappName: dappConfig.dappName,
        earnAssetDivisibility: assetsConfig.assets.earn.divisibility,
        earnAssetIdentifier: assetsConfig.assets.earn.mosaicId,
      };

      // act
      const result = await controller.find();

      // assert
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
