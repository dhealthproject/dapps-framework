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
import { LogLevel } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import {
  TestFileTransportErrors,
  TestConsoleTransport,
  TestDailyRotateFileTransport,
  TestWinstonLogger,
} from "../../../mocks/global";
import { LogService } from "../../../../src/common/services/LogService";

describe("common/LogService", () => {
  let service: LogService;
  let mockEmitFn: any;

  beforeEach(async () => {
    mockEmitFn = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventEmitter2,
        LogService,
        {
          provide: "EventEmitter",
          useValue: {
            emit: mockEmitFn,
          }
        },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
    (service as any).context = "test-context";
    (service as any).logger = TestWinstonLogger;
    (service as any).eventEmitter = {
      emit: mockEmitFn,
    };

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createTransports()", () => {
    it("should include correct transport methods", () => {
      // act
      const result = (service as any).createTransports();

      // assert
      expect(result).toEqual([
        //new TestMongoDBTransport(),
        new TestConsoleTransport(),
        new TestDailyRotateFileTransport(),
        new TestFileTransportErrors(),
      ]);
    });
  });

  describe("log()", () => {
    it("should call winston logger's log() method", () => {
      // act
      service.log("test-log-message", "test-log-context");

      // assert
      expect(TestWinstonLogger.log).toHaveBeenNthCalledWith(
        1,
        "test-log-message",
        "test-log-context",
      );
    });

    it("should forward optional parameters to winston", () => {
      // act
      service.log("test-log-message", "test-log-context", "test-param");

      // assert
      expect(TestWinstonLogger.log).toHaveBeenNthCalledWith(
        1,
        "test-log-message",
        "test-log-context",
        "test-param",
      );
    });

    it("should use default context given empty optionals", () => {
      // act
      service.log("test-log-message");

      // assert
      expect(TestWinstonLogger.log).toHaveBeenNthCalledWith(
        1,
        "test-log-message",
        "test-context", // L45
      );
    });
  });

  describe("error()", () => {
    it("should call winston logger's error() method and emit an event", () => {
        // act
      service.error(
        "test-error-message",
        "test-error-context",
        "test-error-trace",
      );

      // assert
      expect(TestWinstonLogger.error).toHaveBeenNthCalledWith(
        1,
        "test-error-message",
        "test-error-context",
        "test-error-trace",
      );
      expect(mockEmitFn).toHaveBeenCalledTimes(1);
    });

    it("should forward optional parameters to winston", () => {
      // act
      service.error("test-log-message", "test-log-context", "test-param");

      // assert
      expect(TestWinstonLogger.error).toHaveBeenNthCalledWith(
        1,
        "test-log-message",
        "test-log-context",
        "test-param",
      );
    });

    it("should use default context given empty optionals", () => {
      // act
      service.error("test-log-message");

      // assert
      expect(TestWinstonLogger.error).toHaveBeenNthCalledWith(
        1,
        "test-log-message",
        "test-context", // L45
      );
    });
  });

  describe("warn()", () => {
    it("should call winston logger's warn() method and emit an event", () => {
      // act
      service.warn("test-warn-message", "test-warn-context");

      // assert
      expect(TestWinstonLogger.warn).toHaveBeenNthCalledWith(
        1,
        "test-warn-message",
        "test-warn-context"
      );
      expect(mockEmitFn).toHaveBeenCalledTimes(1);
    });

    it("should forward optional parameters to winston", () => {
      // act
      service.warn("test-warn-message", "test-warn-context", "test-param");

      // assert
      expect(TestWinstonLogger.warn).toHaveBeenNthCalledWith(
        1,
        "test-warn-message",
        "test-warn-context",
        "test-param",
      );
    });

    it("should use default context given empty optionals", () => {
      // act
      service.warn("test-warn-message");

      // assert
      expect(TestWinstonLogger.warn).toHaveBeenNthCalledWith(
        1,
        "test-warn-message",
        "test-context", // L45
      );
    });
  });

  describe("debug()", () => {
    it("should call winston logger's debug() method", () => {
      // act
      service.debug("test-debug-message", "test-debug-context");

      // assert
      expect(TestWinstonLogger.debug).toHaveBeenNthCalledWith(
        1,
        "test-debug-message",
        "test-debug-context"
      );
    });

    it("should forward optional parameters to winston", () => {
      // act
      service.debug("test-debug-message", "test-debug-context", "test-param");

      // assert
      expect(TestWinstonLogger.debug).toHaveBeenNthCalledWith(
        1,
        "test-debug-message",
        "test-debug-context",
        "test-param",
      );
    });

    it("should use default context given empty optionals", () => {
      // act
      service.debug("test-debug-message");

      // assert
      expect(TestWinstonLogger.debug).toHaveBeenNthCalledWith(
        1,
        "test-debug-message",
        "test-context", // L45
      );
    });
  });

  describe("verbose()", () => {
    it("should call winston logger's verbose() method", () => {
      // act
      service.verbose("test-verbose-message", "test-verbose-context");

      // assert
      expect(TestWinstonLogger.verbose).toHaveBeenNthCalledWith(
        1,
        "test-verbose-message",
        "test-verbose-context"
      );
    });

    it("should forward optional parameters to winston", () => {
      // act
      service.verbose("test-verbose-message", "test-verbose-context", "test-param");

      // assert
      expect(TestWinstonLogger.verbose).toHaveBeenNthCalledWith(
        1,
        "test-verbose-message",
        "test-verbose-context",
        "test-param",
      );
    });

    it("should use default context given empty optionals", () => {
      // act
      service.verbose("test-verbose-message");

      // assert
      expect(TestWinstonLogger.verbose).toHaveBeenNthCalledWith(
        1,
        "test-verbose-message",
        "test-context", // L45
      );
    });
  });

  describe("setLogLevels()", () => {
    it("should call winston logger's setLogLevels() method", () => {
      // prepare
      const expectedLevels: LogLevel[] = [
        "error",
        "log",
        "warn",
        "debug",
        "verbose",
      ];

      // act
      service.setLogLevels(expectedLevels);

      // assert
      expect(TestWinstonLogger.setLogLevels).toHaveBeenNthCalledWith(1, expectedLevels);
    });
  });
});