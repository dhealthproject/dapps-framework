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
import { LogDTO } from "../../../../src/common/models/LogDTO";
import { Log, LogDocument, LogQuery } from "../../../../src/common/models/LogSchema";
import { Queryable, QueryParameters } from "../../../../src/common/concerns/Queryable";

describe("notifier/LogSchema", () => {
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
  });

  describe("toQuery() -->", () => {
    it("should return correct value", () => {
      // prepare
      const timestamp = new Date();
      const level = "test-level";
      const message = "test-message";
      const meta = { key: "value" };
      const label = "test-label";
      const log: Log = new Log();
      (log as any).timestamp = timestamp;
      (log as any).level = level;
      (log as any).message = message;
      (log as any).meta = meta;
      (log as any).label = label;

      // act
      const logToQuery = log.toQuery;

      // assert
      expect(logToQuery).toEqual({
        timestamp,
        level,
        label,
      });
    });
  });

  describe("fillDTO() -->", () => {
    it("should return correct instance", () => {
      // prepare
      const timestamp = new Date();
      const level = "test-level";
      const message = "test-message";
      const meta = { key: "value" };
      const label = "test-label";
      const log: Log = new Log();
      (log as any).timestamp = timestamp;
      (log as any).level = level;
      (log as any).message = message;
      (log as any).meta = meta;
      (log as any).label = label;
      const expectedResult = { timestamp, level, message, meta, label };

      // act
      const result = Log.fillDTO(
        log as LogDocument,
        new LogDTO(),
      );

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});

describe("notifier/LogQuery", () => {
  describe("constructor", () => {
    it("should create correct instance", () => {
      // prepare
      const expectedResult = new Queryable<LogDocument>(
        {} as LogDocument, {} as QueryParameters
      );

      // act
      const logQuery = new LogQuery({} as LogDocument, {} as QueryParameters);

      // assert
      expect(logQuery).toEqual(expectedResult);
    });

    it("should create correct instance without queryParams", () => {
      // prepare
      const expectedResult = new Queryable<LogDocument>(
        {} as LogDocument
      );

      // act
      const logQuery = new LogQuery({} as LogDocument);

      // assert
      expect(logQuery).toEqual(expectedResult);
    })
  });
});