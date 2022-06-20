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
import { JwtService } from "@nestjs/jwt";

// internal dependencies
import { AppController } from "../../src/AppController";
import { AppService } from "../../src/AppService";
import { AuthService } from "../../src/common/services/AuthService";

// configuration resources
import dappConfigLoader from "../../config/dapp";

describe("AppController", () => {
  let appController: AppController;
  let configService: ConfigService;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ConfigService, JwtService, AuthService],
    }).compile();

    appController = app.get<AppController>(AppController);
    configService = app.get<ConfigService>(ConfigService);
    authService = app.get<AuthService>(AuthService);
    jwtService = app.get<JwtService>(JwtService);
  });

  describe("getHello() -->", () => {
    it('should return "Hello, world of dAppName!"', () => {
      expect(appController.getHello()).toBe(`Hello, world of ${dappConfigLoader().dappName}!`);
    });
  });
});
