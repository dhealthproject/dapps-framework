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
import { StravaActivityDataDTO } from "../../../../../src/oauth/drivers/strava/StravaActivityDataDTO";

describe("common/ActivityDataDTO", () => {
  let mockDate: Date;
  beforeEach(() => {
    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
  });

  describe("createFromDTO()", () => {
    it("should use basic fields from Strava API", () => {
      // prepare
      const expectedName = "fake-name";
      const expectedSport = "fake-sport";

      // act
      const instance = StravaActivityDataDTO.createFromDTO({
        // the following fields use Strava's API field names
        name: expectedName,
        sport_type: expectedSport,
      });
  
      // assert
      expect(instance).toBeDefined();
      expect("name" in instance).toBe(true);
      expect("sport" in instance).toBe(true);
      expect(instance.name).toBe(expectedName);
      expect(instance.sport).toBe(expectedSport);
    });

    it("should transform Strava API fields into backend columns", () => {
      // prepare
      const expectedData = {
        // the following fields use database field names
        name: "fake-name",
        sport: "fake-sport",
        startedAt: mockDate.valueOf(),
        timezone: "fake-timezone",
        startLocation: [1, 2],
        endLocation: [3, 4],
        hasTrainerDevice: false,
        elapsedTime: 5,
        movingTime: 6,
        distance: 7,
        elevation: 8,
        kilojoules: 9,
        calories: 10,
      };

      // act
      const instance = StravaActivityDataDTO.createFromDTO({
        // the following fields use Strava's API field names
        name: expectedData.name,
        sport_type: expectedData.sport,
        start_date: expectedData.startedAt,
        timezone: expectedData.timezone,
        start_latlng: [1, 2],
        end_latlng: [3, 4],
        trainer: false,
        elapsed_time: 5,
        moving_time: 6,
        distance: 7,
        total_elevation_gain: 8,
        kilojoules: 9,
        calories: 10,
      });
  
      // assert
      expect(instance).toBeDefined();
      expect(instance.name).toBe(expectedData.name);
      expect(instance.sport).toBe(expectedData.sport);
      expect(instance.startedAt).toBe(mockDate.valueOf());
      expect(instance.timezone).toBe(expectedData.timezone);
      expect(instance.startLocation).toStrictEqual(expectedData.startLocation);
      expect(instance.endLocation).toStrictEqual(expectedData.endLocation);
      expect(instance.hasTrainerDevice).toBe(expectedData.hasTrainerDevice);
      expect(instance.elapsedTime).toBe(expectedData.elapsedTime);
      expect(instance.movingTime).toBe(expectedData.movingTime);
      expect(instance.distance).toBe(expectedData.distance);
      expect(instance.elevation).toBe(expectedData.elevation);
      expect(instance.kilojoules).toBe(expectedData.kilojoules);
      expect(instance.calories).toBe(expectedData.calories);
    });

    it("should have suffer score as -1 if it's null", () => {
      // prepare
      const expectedData = {
        // the following fields use database field names
        name: "fake-name",
        sport: "fake-sport",
        startedAt: mockDate.valueOf(),
        timezone: "fake-timezone",
        startLocation: [1, 2],
        endLocation: [3, 4],
        hasTrainerDevice: false,
        elapsedTime: 5,
        movingTime: 6,
        distance: 7,
        elevation: 8,
        kilojoules: 9,
        calories: 10,
        isManual: false,
        sufferScore: -1,
      };

      const instance = StravaActivityDataDTO.createFromDTO({
        // the following fields use Strava's API field names
        name: expectedData.name,
        sport_type: expectedData.sport,
        start_date: expectedData.startedAt,
        timezone: expectedData.timezone,
        start_latlng: [1, 2],
        end_latlng: [3, 4],
        trainer: false,
        elapsed_time: 5,
        moving_time: 6,
        distance: 7,
        total_elevation_gain: 8,
        kilojoules: 9,
        calories: 10,
        manual: false,
        suffer_score: null,
      });

      expect(instance).toBeDefined();
      expect(instance.name).toBe(expectedData.name);
      expect(instance.sport).toBe(expectedData.sport);
      expect(instance.startedAt).toBe(mockDate.valueOf());
      expect(instance.timezone).toBe(expectedData.timezone);
      expect(instance.startLocation).toStrictEqual(expectedData.startLocation);
      expect(instance.endLocation).toStrictEqual(expectedData.endLocation);
      expect(instance.hasTrainerDevice).toBe(expectedData.hasTrainerDevice);
      expect(instance.elapsedTime).toBe(expectedData.elapsedTime);
      expect(instance.movingTime).toBe(expectedData.movingTime);
      expect(instance.distance).toBe(expectedData.distance);
      expect(instance.elevation).toBe(expectedData.elevation);
      expect(instance.kilojoules).toBe(expectedData.kilojoules);
      expect(instance.calories).toBe(expectedData.calories);
      expect(instance.isManual).toBe(expectedData.isManual);
      expect(instance.sufferScore).toBe(expectedData.sufferScore);
      expect(instance.sufferScore).toBe(-1);
    });
  });

  describe("toDocument()", () => {
    let activityDataDTO: StravaActivityDataDTO,
        expectedData: any;
    beforeEach(() => {
      expectedData = {
        // the following fields use database field names
        name: "fake-name",
        sport: "fake-sport",
        startedAt: mockDate.valueOf(),
        timezone: "fake-timezone",
        startLocation: [1, 2],
        endLocation: [3, 4],
        hasTrainerDevice: false,
        elapsedTime: 5,
        movingTime: 6,
        distance: 7,
        elevation: 8,
        kilojoules: 9,
        calories: 10,
        isManual: false,
        sufferScore: 11,
      };

      activityDataDTO = StravaActivityDataDTO.createFromDTO({
        // the following fields use Strava's API field names
        name: expectedData.name,
        sport_type: expectedData.sport,
        start_date: expectedData.startedAt,
        timezone: expectedData.timezone,
        start_latlng: [1, 2],
        end_latlng: [3, 4],
        trainer: false,
        elapsed_time: 5,
        moving_time: 6,
        distance: 7,
        total_elevation_gain: 8,
        kilojoules: 9,
        calories: 10,
        manual: false,
        suffer_score: 11,
      });
    });

    it ("should return only relevant database columns", () => {
      // act
      const document = activityDataDTO.toDocument();

      // assert
      expect(document).toBeDefined();
      expect(document).toStrictEqual(expectedData);
    });
  });
});