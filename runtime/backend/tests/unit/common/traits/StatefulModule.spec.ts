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
import { StateService } from "../../../../src/common/services/StateService";
import { LogService } from "../../../../src/common/services/LogService";
import { StatefulModule } from "../../../../src/common/traits/StatefulModule";

describe("common/StatefulModule", () => {
  const logService = {};
  const stateService = {};
  const debugCall = jest.fn();
  const errorCall = jest.fn();
  class StatefulModuleTest extends StatefulModule {
    constructor(logService: LogService, stateService: StateService) {
      super(logService, stateService);
      (this as any).logger = { debug: debugCall, error: errorCall }
    }

    public get stateIdentifier(): string {
      return "test-context";
    }
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("debugLog()", () => {
    it("should use base context and forward to logger debug method", () => {
      // prepare
      const statefulModule = new StatefulModuleTest(
        (logService as any),
        (stateService as any)
      );

      // act
      (statefulModule as any).debugLog("test-message");

      // assert
      expect(debugCall).toBeCalledTimes(1);
      expect(debugCall).toBeCalledWith("test-message", "test-context");
    });
  });

  describe("errorLog()", () => {
    it("should call error method from logger with correct params", () => {
      // prepare
      const statefulModule = new StatefulModuleTest(
        (logService as any),
        (stateService as any)
      );

      // act
      (statefulModule as any).errorLog("test-message", "test-stack");

      // assert
      expect(errorCall).toBeCalledTimes(1);
      expect(errorCall).toBeCalledWith("test-message", "test-context", "test-stack");
    });
  });
});