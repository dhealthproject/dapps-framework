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
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { QueryService } from "../../../../src/common/services/QueryService";
import { CipherService } from "../../../../src/common/services/CipherService";
import { OAuthService } from "../../../../src/oauth/services/OAuthService";
import { WebHooksService } from "../../../../src/oauth/services/WebHooksService";
import { ActivitiesService } from "../../../../src/processor/services/ActivitiesService";
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/processor/models/ActivitySchema";
import { StravaWebHookEventRequest } from "../../../../src/oauth/drivers/strava/StravaWebHookEventRequest";
import { OnActivityCreated } from "../../../../src/oauth/events/OnActivityCreated";
import { LogService } from "../../../../src/common/services/LogService";

describe("processor/WebHooksService", () => {
  let service: WebHooksService;
  let queryService: QueryService<ActivityDocument, ActivityModel>;
  let oauthService: OAuthService;
  let activitiesService: ActivitiesService;
  let eventEmitter: EventEmitter2;
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
        WebHooksService,
        QueryService, // requirement from WebHooksService
        OAuthService, // requirement from WebHooksService
        ActivitiesService, // requirement from WebHooksService
        EventEmitter2, // requirement from WebHooksService
        ConfigService, // requirement from OAuthService
        CipherService, // requirement from OAuthService
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        }, // requirement from ActivitiesService
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel,
        }, // requirement from OAuthService
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        }, // requirement from WebHooksService
      ],
    }).compile();

    service = module.get<WebHooksService>(WebHooksService);
    queryService = module.get<QueryService<ActivityDocument, ActivityModel>>(QueryService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    oauthService = module.get<OAuthService>(OAuthService);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("eventHandler()", () => {
    beforeEach(() => {
      (service as any).activitiesService = {
        exists: jest.fn().mockReturnValue(false) // <-- activity does not exist
      }
    });
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

    it("should throw an error given already existing object_id", async () => {
      // prepare
      const expectedMsg: string = `This activity has been discovered before.`;
      const baseData: StravaWebHookEventRequest = {
        object_type: undefined,
        aspect_type: undefined,
        object_id: "12345",
        owner_id: "67890",
        subscription_id: 1,
        event_time: 1,
      };
      (service as any).activitiesService = {
        exists: jest.fn().mockReturnValue(true) // <-- activity exists
      }

      try {
        // act
        await service.eventHandler("strava", "test", {
          ...baseData,
          object_type: "activity",
          aspect_type: "create",
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
      const createOrUpdateMock = jest.fn().mockReturnValue({ slug: "fake-slug" });
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      (service as any).eventEmitter = {
        emit: jest.fn()
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
      const createOrUpdateMock = jest.fn().mockReturnValue({ slug: "fake-slug" });
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      (service as any).eventEmitter = {
        emit: jest.fn()
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

    it ("should include: date, count, activity id, owner in activity slug", async () => {
      // prepare
      mockDate = new Date(2022, 0, 22); // <-- 0 is january
      const countMock = jest.fn().mockReturnValue(9); // <-- 9 previous activities today
      const createOrUpdateMock = jest.fn().mockReturnValue({ slug: "fake-slug" });
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      (service as any).eventEmitter = {
        emit: jest.fn()
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
          slug: `20220122-10-12345-67890`, // 9+1 ("10th" activity) from L194
        } as ActivityDocument),
        (service as any).model,
        {
          remoteIdentifier: "12345",
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
      const createOrUpdateMock = jest.fn().mockReturnValue({ slug: "fake-slug" });
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      (service as any).eventEmitter = {
        emit: jest.fn()
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
          slug: `20220122-10-12345-11111`,
        } as ActivityDocument),
        (service as any).model,
        {
          remoteIdentifier: "12345",
          dateSlug: "20220122",
          createdAt: eventDate,
          provider: "strava",
        },
        {},
      );
      expect(createOrUpdateMock).toHaveBeenNthCalledWith(2, 
        new ActivityQuery({
          address: "fake-player2",
          slug: `20220122-10-12346-99999`,
        } as ActivityDocument),
        (service as any).model,
        {
          remoteIdentifier: "12346",
          dateSlug: "20220122",
          createdAt: eventDate,
          provider: "strava",
        },
        {},
      );
    });

    it ("should emit correct event 'processor.activity.created'", async () => {
      // prepare
      mockDate = new Date(2022, 0, 22); // <-- 0 is january
      const countMock = jest.fn().mockReturnValue(0);
      const createOrUpdateMock = jest.fn().mockReturnValue({ slug: "fake-slug" });
      const emitMock = jest.fn();
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      (service as any).eventEmitter = {
        emit: emitMock
      };
      const activitySlug = "20220122-1-12345-67890";

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
      expect(emitMock).toHaveBeenCalledTimes(1);
      expect(emitMock).toHaveBeenCalledWith(
        "processor.activity.created",
        OnActivityCreated.create(activitySlug),
      );
    });
  });
});
