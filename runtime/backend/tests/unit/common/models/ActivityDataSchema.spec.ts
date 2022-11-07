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
import { ActivityDataDTO } from "../../../../src/processor/models/ActivityDataDTO";
import { ActivityData, ActivityDataDocument, ActivityDataQuery } from "../../../../src/processor/models/ActivityDataSchema";
import { GeolocationPointDTO } from "../../../../src/processor/models/GeolocationPointDTO";


describe("common/ActivityDataSchema", () => {
  let activityData: ActivityData;

  beforeEach(() => {
    activityData = new ActivityData();
    (activityData as any).slug = "test-slug";
    (activityData as any).address = "test-address";
    (activityData as any).name = "test-name";
    (activityData as any).sport = "test-sport";
    (activityData as any).startedAt = 123;
    (activityData as any).timezone = "test-timezone";
    (activityData as any).startLocation = new GeolocationPointDTO();
    (activityData as any).endLocation = new GeolocationPointDTO();
    (activityData as any).hasTrainerDevice = true;
    (activityData as any).elapsedTime = 123;
    (activityData as any).movingTime = 123;
    (activityData as any).distance = 123;
    (activityData as any).elevation = 123;
    (activityData as any).calories = 123;
  });
  
  describe("get toQuery() -->", () => {
    it("should return correct result", () => {
      // act
      const result = activityData.toQuery;

      // assert
      expect(result).toEqual({
        address: activityData.address,
        slug: activityData.slug,
        sport: activityData.sport,
      });
    });
  });

  describe("fillDTO()", () => {
    it("should return correct result", () => {
      // act
      const result = ActivityData.fillDTO(
        activityData as ActivityDataDocument,
        {} as ActivityDataDTO,
      );

      // assert
      expect(result).toEqual({
        slug: activityData.slug,
        sport: activityData.sport,
        elapsedTime: activityData.elapsedTime,
        distance: activityData.distance,
        elevation: activityData.elevation,
        calories: activityData.calories,
      });
    });
  });

  describe("class ActivityDataQuery", () => {
    it("should be defined and has create correct instance", () => {
      // act
      const result = new ActivityDataQuery(
        activityData as ActivityDataDocument,
      );

      // assert
      expect(result).toBeDefined();
      expect(result.document).toBe(activityData);
      expect(result.filterQuery).toBeUndefined();
    });
  });
});