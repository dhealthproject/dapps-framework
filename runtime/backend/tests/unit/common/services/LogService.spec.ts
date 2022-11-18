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

// internal dependencies
import {
  TestFileTransportErrors,
  TestConsoleTransport,
  TestDailyRotateFileTransport,
  TestWinstonLogger,
} from "../../../mocks/global";
import { LogService } from "../../../../src/common/services/LogService";

describe("common/StateService", () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
      ],
    }).compile();

    service = module.get<LogService>(LogService);
    (service as any).context = "test-context";
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
        "info",
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
      expect(TestWinstonLogger.error).toHaveBeenNthCalledWith(
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
      expect(TestWinstonLogger.warn).toHaveBeenNthCalledWith(
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
      expect(TestWinstonLogger.debug).toHaveBeenNthCalledWith(
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
      expect(TestWinstonLogger.verbose).toHaveBeenNthCalledWith(
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
      expect(TestWinstonLogger.setLogLevels).toHaveBeenNthCalledWith(1, expectedLevels);
    });
  });
});