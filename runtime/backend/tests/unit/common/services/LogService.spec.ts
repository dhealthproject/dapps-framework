/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
jest.mock("winston-mongodb");
jest.mock("winston-daily-rotate-file", () => {
  return jest.fn();
});
const testWinstonLogger = {
  log: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
  setLogLevels: jest.fn(),
}
jest.mock("nest-winston", () => ({
  utilities: {
    format: {
      nestLike: jest.fn(),
    },
  },
  WinstonModule: { createLogger: jest.fn().mockReturnValue(testWinstonLogger) },
}));

class TestMongoDBTransport {};
class TestConsoleTransport {};
class TestDailyRotateFileTransport {};
jest.mock("winston", () => ({
  format: {
    timestamp: jest.fn(),
    ms: jest.fn(),
    combine: jest.fn(),
    metadata: jest.fn(),
  },
  transports: {
    MongoDB: TestMongoDBTransport,
    Console: TestConsoleTransport,
    DailyRotateFile: TestDailyRotateFileTransport,
  }
}));

jest.mock("../../../../config/monitoring", () => {
  return () => ({
    storage: [
      "console",
      "filesystem",
    ],
    logLevels: {
      none: 0,
      error: 1,
      warn: 2,
      debug: 4,
      info: 8,
    },
    logPrintLevel: "info",
    logPersistLevel: "error",
    logPersistCollection: "system-logs",
    logDirectoryPath: "./logs/",
    logMaxFileSize: 1000,
  });
});

import { LogLevel } from "@nestjs/common";
// internal dependency
import { LogService } from "../../../../src/common/services/LogService";

describe("common/StateService", () => {
  let service: LogService;

  beforeEach(() => {
    service = new LogService("test-context");
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("setContext", () => {
    it("should set context of instance", () => {
      // prepare
      const expectedContext = "new-test-context";

      // act
      service.setContext(expectedContext);

      // assert
      expect((service as any).context).toBe(expectedContext);
    });
  });

  describe("createTransports()", () => {
    it("should include correct transport methods", () => {
      // act
      const result = (service as any).createTransports();

      // assert
      expect(result).toEqual([
        new TestMongoDBTransport(),
        new TestConsoleTransport(),
        new TestDailyRotateFileTransport(),
      ]);
    });
  });

  describe("log()", () => {
    it("should call winston logger's log() method", () => {
      // act
      service.log("test-log-message", "test-log-context");

      // assert
      expect(testWinstonLogger.log).toHaveBeenNthCalledWith(
        1,
        "test-log-message",
        "test-log-context"
      );
    });
  });

  describe("error()", () => {
    it("should call winston logger's error() method", () => {
      // act
      service.error(
        "test-error-message",
        "test-error-trace",
        "test-error-context",
      );

      // assert
      expect(testWinstonLogger.error).toHaveBeenNthCalledWith(
        1,
        "test-error-message",
        "test-error-trace",
        "test-error-context",
      );
    });
  });

  describe("warn()", () => {
    it("should call winston logger's warn() method", () => {
      // act
      service.warn("test-warn-message", "test-warn-context");

      // assert
      expect(testWinstonLogger.warn).toHaveBeenNthCalledWith(
        1,
        "test-warn-message",
        "test-warn-context"
      );
    });
  });

  describe("debug()", () => {
    it("should call winston logger's debug() method", () => {
      // act
      service.debug("test-debug-message", "test-debug-context");

      // assert
      expect(testWinstonLogger.debug).toHaveBeenNthCalledWith(
        1,
        "test-debug-message",
        "test-debug-context"
      );
    });
  });

  describe("verbose()", () => {
    it("should call winston logger's verbose() method", () => {
      // act
      service.verbose("test-verbose-message", "test-verbose-context");

      // assert
      expect(testWinstonLogger.verbose).toHaveBeenNthCalledWith(
        1,
        "test-verbose-message",
        "test-verbose-context"
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
      expect(testWinstonLogger.setLogLevels).toHaveBeenNthCalledWith(1, expectedLevels);
    });
  });
});