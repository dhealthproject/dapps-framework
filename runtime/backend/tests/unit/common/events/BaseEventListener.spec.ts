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
import { Test } from "@nestjs/testing";

// internal dependencies
import { LogService } from "../../../../src/common/services/LogService";
import { BaseEventListener } from "../../../../src/common/events/BaseEventListener";


class TestListener extends BaseEventListener {

  public handleEvent = jest.fn();
}

describe("common/BaseEventListener", () => {
  let listener: BaseEventListener;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TestListener,
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ]
    }).compile();

    listener = module.get<BaseEventListener>(TestListener);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shoud be defined", () => {
    expect(listener).toBeDefined();
  });

  describe("debugLog()", () => {
    it("should call logger.debug() with context", () => {
      // prepare
      const message = "test-message";
      const context = "test-context";
      const logServiceDebugCall = jest
        .spyOn(LogService.prototype, "debug")
        .mockReturnValue();

      // act
      (listener as any).debugLog(message, context);

      // assert
      expect(logServiceDebugCall).toHaveBeenNthCalledWith(1, message, context);
    });

    it("should call logger.debug() without context", () => {
      // prepare
      const message = "test-message";
      const logServiceDebugCall = jest
        .spyOn(LogService.prototype, "debug")
        .mockReturnValue();

      // act
      (listener as any).debugLog(message);

      // assert
      expect(logServiceDebugCall).toHaveBeenNthCalledWith(1, message);
    });
  });

  describe("errorLog()", () => {
    it("should call logger.error()", () => {
      // prepare
      const message = "test-message";
      const stack = "test-stack";
      const context = "test-context";
      const logServiceErrorCall = jest
        .spyOn(LogService.prototype, "error")
        .mockReturnValue();

      // act
      (listener as any).errorLog(message, stack, context);

      // assert
      expect(logServiceErrorCall).toHaveBeenNthCalledWith(1, message, stack, context);
    });
  });
});