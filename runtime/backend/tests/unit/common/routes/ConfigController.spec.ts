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
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import {
  ConfigController,
  BaseConfig,
} from "../../../../src/common/routes/ConfigController";

describe("common/ConfigController", () => {
  let controller: ConfigController;

  beforeEach(async () => {
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
      const expectResult: BaseConfig = {
        dappName: "fake-dapp-name",
        digitsAmount: 2,
        mosaicId: "fake-earn-mosaic-id",
      };

      jest
        .spyOn(controller, "getConfig")
        .mockImplementation(() => expectResult);

      // assert
      expect(await controller.getConfig()).toBe(expectResult);
    });
  });
});
