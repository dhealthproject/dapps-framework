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
import { StateService } from "@/classes";
import { StatefulModule } from "../../../../src/common/traits/StatefulModule";

describe("common/StatefulModule", () => {
  const stateService = {};
  const debugCall = jest.fn();
  const errorCall = jest.fn();
  class StatefulModuleTest extends StatefulModule {
    constructor(stateService: StateService) {
      super(stateService);
      (this as any).logger = { debug: debugCall, error: errorCall }
    }

    public get stateIdentifier(): string {
      throw new Error('Method not implemented.');
    }
  }

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("debugLog()", () => {
    it("should call debug method from logger with context", () => {
      // prepare
      const statefulModule = new StatefulModuleTest((stateService as any));

      // act
      (statefulModule as any).debugLog("test-message", "test-context");

      // assert
      expect(debugCall).toBeCalledTimes(1);
      expect(debugCall).toBeCalledWith("test-message", "test-context");
    });

    it("should call debug method from logger without context", () => {
      // prepare
      const statefulModule = new StatefulModuleTest((stateService as any));

      // act
      (statefulModule as any).debugLog("test-message");

      // assert
      expect(debugCall).toBeCalledTimes(1);
      expect(debugCall).toBeCalledWith("test-message");
    });
  });

  describe("errorLog()", () => {
    it("should call error method from logger with correct params", () => {
      // prepare
      const statefulModule = new StatefulModuleTest((stateService as any));

      // act
      (statefulModule as any).errorLog("test-message", "test-stack", "test-context");

      // assert
      expect(errorCall).toBeCalledTimes(1);
      expect(errorCall).toBeCalledWith("test-message", "test-stack", "test-context");
    });
  });
});