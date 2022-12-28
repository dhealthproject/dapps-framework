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
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TestingModule, Test } from "@nestjs/testing";

// internal dependencies
import { AuthService } from "../../../../src/common/services/AuthService";
import { LogService } from "../../../../src/common/services/LogService";
import { BaseGateway } from "../../../../src/common/gateways/BaseGateway";

class TestGateway extends BaseGateway {}

describe("common/BaseGateway", () => {
  let authService: AuthService;
  let logger: LogService;
  let testGateway: TestGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEmitter2, LogService, TestGateway, AuthService],
    }).compile();

    logger = module.get<LogService>(LogService);
    authService = module.get<AuthService>(AuthService);
    testGateway = module.get<TestGateway>(TestGateway);
  });

  it("should be defined", () => {
    expect(testGateway).toBeDefined();
  });
});
