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
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { AppController } from "../../src/AppController";
import { AppService } from "../../src/AppService";

// configuration resources
import dappConfigLoader from "../../config/dapp";

// Mocks the AppController to permit testing of 
// protected methods such as getHello
class MockAppController extends AppController {
  public fakeGetHello(): string { return this.getHello(); }
}

describe("AppController", () => {
  let appController: MockAppController;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockAppController],
      providers: [AppService, ConfigService],
    }).compile();

    appController = app.get<MockAppController>(MockAppController);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe("getHello() -->", () => {
    it('should return "Hello, world of dAppName!"', () => {
      expect(appController.fakeGetHello()).toBe(`Hello, world of ${dappConfigLoader().dappName}!`);
    });
  });
});
