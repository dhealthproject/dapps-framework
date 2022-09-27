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
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { QueryService } from "../../../../src/common/services/QueryService";
import { WebHooksService } from "../../../../src/common/services/WebHooksService";
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/common/models/ActivitySchema";
import { StravaWebHookEventRequest } from "../../../../src/common/drivers/strava/StravaWebHookEventRequest";

describe("common/WebHooksService", () => {
  let service: WebHooksService;
  let queryService: QueryService<ActivityDocument, ActivityModel>;
  let mockDate: Date;

  const findOneCall = jest.fn(() => ({ exec: () => ({}) }));
  const saveOneCall = jest.fn(() => ({ exec: () => ({}) }));
  class MockModel {
    static findOne = findOneCall;
    static findOneAndUpdate = saveOneCall;
  }

  beforeEach(async () => {
    mockDate = new Date(2022, 0, 22); // <-- 0 is january
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        WebHooksService,
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<WebHooksService>(WebHooksService);
    queryService = module.get<QueryService<ActivityDocument, ActivityModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("eventHandler()", () => {
    it("should throw an error given missing obligatory fields", async () => {
      // prepare
      const expectedMsg: string = `Invalid webhook event payload.`;
      const fakeData: StravaWebHookEventRequest = {
        object_type: "activity",
        aspect_type: "create",
        object_id: undefined,
        owner_id: undefined,
        subscription_id: 1,
        event_time: 1,
      };

      try {
        // act
        await service.eventHandler("strava", "test", fakeData);
      }
      catch(e) {
        // assert
        expect((e as any).message).toMatch(expectedMsg);
      }
    });

    it("should throw an error given incompatible object type", async () => {
      // prepare
      const expectedMsg: string = `Incompatible webhook event payload.`;
      const baseData: StravaWebHookEventRequest = {
        object_type: undefined,
        aspect_type: undefined,
        object_id: "12345",
        owner_id: "67890",
        subscription_id: 1,
        event_time: 1,
      };

      try {
        // act
        await service.eventHandler("strava", "test", {
          ...baseData,
          object_type: "athlete", // <-- must be activity
          aspect_type: "create",
        });
      }
      catch(e) {
        // assert
        expect((e as any).message).toMatch(expectedMsg);
      }
    });

    it("should throw an error given incompatible aspect type", async () => {
      // prepare
      const expectedMsg: string = `Incompatible webhook event payload.`;
      const baseData: StravaWebHookEventRequest = {
        object_type: undefined,
        aspect_type: undefined,
        object_id: "12345",
        owner_id: "67890",
        subscription_id: 1,
        event_time: 1,
      };

      try {
        // act
        await service.eventHandler("strava", "test", {
          ...baseData,
          object_type: "activity",
          aspect_type: "update", // <-- must be create
        });
      }
      catch(e) {
        // assert
        expect((e as any).message).toMatch(expectedMsg);
      }
    });

    it ("should count previous daily activities for user", async () => {
      // prepare
      const countMock = jest.fn();
      const createOrUpdateMock = jest.fn();
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };

      // act
      await service.eventHandler("strava", "fake-address", {
        object_type: "activity",
        aspect_type: "create",
        object_id: "12345",
        owner_id: "67890",
        subscription_id: 1,
        event_time: mockDate.valueOf() / 1000, // <-- Strava sends **seconds** not *milliseconds*
      });

      // assert
      expect(countMock).toHaveBeenCalledTimes(1);
      expect(countMock).toHaveBeenCalledWith(
        new ActivityQuery({
          address: "fake-address",
          dateSlug: "20220122", // <-- using mockDate (L33)
        } as ActivityDocument),
        (service as any).model,
      );
    });

    it ("should count previous daily activities for user given different date", async () => {
      // prepare
      mockDate = new Date(2021, 7, 29); // <-- 7 for august
      const countMock = jest.fn();
      const createOrUpdateMock = jest.fn();
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };

      // act
      await service.eventHandler("strava", "fake-address", {
        object_type: "activity",
        aspect_type: "create",
        object_id: "12345",
        owner_id: "67890",
        subscription_id: 1,
        event_time: mockDate.valueOf() / 1000, // <-- Strava sends **seconds** not *milliseconds*
      });

      // assert
      expect(countMock).toHaveBeenCalledTimes(1);
      expect(countMock).toHaveBeenCalledWith(
        new ActivityQuery({
          address: "fake-address",
          dateSlug: "20210829", // <-- using mockDate (L33)
        } as ActivityDocument),
        (service as any).model,
      );
    });

    it ("should include date, count of activities and owner in activity slug", async () => {
      // prepare
      mockDate = new Date(2022, 0, 22); // <-- 0 is january
      const countMock = jest.fn().mockReturnValue(9); // <-- 9 previous activities today
      const createOrUpdateMock = jest.fn();
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      // Strava sends **seconds** not *milliseconds*
      const eventDate = mockDate;
      const eventTime = eventDate.valueOf() / 1000

      // act
      await service.eventHandler("strava", "fake-address", {
        object_type: "activity",
        aspect_type: "create",
        object_id: "12345",
        owner_id: "67890",
        subscription_id: 1,
        event_time: eventTime,
      });

      // assert
      expect(createOrUpdateMock).toHaveBeenCalledTimes(1);
      expect(createOrUpdateMock).toHaveBeenCalledWith(
        new ActivityQuery({
          address: "fake-address",
          slug: `20220122-10-67890`, // 9+1 ("10th" activity) from L194
        } as ActivityDocument),
        (service as any).model,
        {
          dateSlug: "20220122",
          createdAt: eventDate,
          provider: "strava",
        },
        {},
      );
    });

    it ("should use distinct and correct slug for multiple incoming events", async () => {
      // prepare
      mockDate = new Date(2022, 0, 22); // <-- 0 is january
      const countMock = jest.fn().mockReturnValue(9); // <-- 9 previous activities today
      const createOrUpdateMock = jest.fn();
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      // Strava sends **seconds** not *milliseconds*
      const eventDate = mockDate;
      const eventTime = eventDate.valueOf() / 1000;
      const eventData: any = {
        object_type: "activity",
        aspect_type: "create",
        object_id: undefined,
        owner_id: "67890",
        subscription_id: 1,
        event_time: eventTime,
      };

      // act
      await service.eventHandler("strava", "fake-player1", {
        ...eventData,
        object_id: "12345",
        owner_id: "11111",
      });
      await service.eventHandler("strava", "fake-player2", {
        ...eventData,
        object_id: "12346",
        owner_id: "99999",
      });

      // assert
      expect(createOrUpdateMock).toHaveBeenCalledTimes(2);
      expect(createOrUpdateMock).toHaveBeenNthCalledWith(1, 
        new ActivityQuery({
          address: "fake-player1",
          slug: `20220122-10-11111`,
        } as ActivityDocument),
        (service as any).model,
        {
          dateSlug: "20220122",
          createdAt: eventDate,
          provider: "strava",
        },
        {},
      );
      expect(createOrUpdateMock).toHaveBeenNthCalledWith(2, 
        new ActivityQuery({
          address: "fake-player2",
          slug: `20220122-10-99999`,
        } as ActivityDocument),
        (service as any).model,
        {
          dateSlug: "20220122",
          createdAt: eventDate,
          provider: "strava",
        },
        {},
      );
    });
  });
});
