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
import { Queryable } from "../../../../src/common/concerns/Queryable";
import { ActivityDataDTO } from "../../../../src/users/models/ActivityDataDTO";
import { ActivityData, ActivityDataDocument, ActivityDataQuery } from "../../../../src/users/models/ActivityDataSchema";

describe("users/ActivityDataSchema", () => {
  describe("toQuery()", () => {
    it("should return correct value", () => {
      // prepare
      const address = "test-address";
      const slug = "test-slug";
      const sport = "test-sport";
      const activity: ActivityData = new ActivityData();
      (activity as any).address = address;
      (activity as any).slug = slug;
      (activity as any).sport = sport;

      // act
      const stateToQuery = activity.toQuery;

      // assert
      expect(stateToQuery).toEqual({ address, slug, sport });
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const slug = "test-slug";
      const sport = "test-sport";
      const elapsedTime = "test-elapsedTime";
      const distance = "test-distance";
      const elevation = "test-elevation";
      const calories = "test-calories";
      const isManual = true;
      const activityData: ActivityData = new ActivityData();
      (activityData as any).slug = slug;
      (activityData as any).sport = sport;
      (activityData as any).elapsedTime = elapsedTime;
      (activityData as any).distance = distance;
      (activityData as any).elevation = elevation;
      (activityData as any).calories = calories;
      (activityData as any).isManual = isManual;
      const expectedResult = {
        slug,
        sport,
        elapsedTime,
        distance,
        elevation,
        calories,
        isManual
      };

      // act
      const result = ActivityData.fillDTO(activityData as ActivityDataDocument, new ActivityDataDTO());

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});

describe("users/ActivityDataQuery", () => {
  describe("constructor", () => {
    it("should set fields and return correct instance", () => {
      // prepare
      const document = {} as ActivityDataDocument;
      const queryParams = {
        pageNumber: 1,
        pageSize: 20,
        sort: "_id",
        order: "asc",
      };

      // act
      const result = new ActivityDataQuery(document, queryParams);

      // assert
      expect(result).toBeInstanceOf(Queryable);
      expect(result.document).toEqual(document);
      expect(result.pageNumber).toBe(queryParams.pageNumber);
      expect(result.pageSize).toBe(queryParams.pageSize);
      expect(result.sort).toBe(queryParams.sort);
      expect(result.order).toBe(queryParams.order);
    });

    it("should set default query parameter fields", () => {
      // prepare
      const document = {} as ActivityDataDocument;

      // act
      const result = new ActivityDataQuery(document);

      // assert
      expect(result).toBeInstanceOf(Queryable);
      expect(result.document).toEqual(document);
      expect(result.pageNumber).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.sort).toBe("_id");
      expect(result.order).toBe("asc");
    });
  });
});