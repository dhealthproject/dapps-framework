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
import { OAuthService } from "../../../../src/common/services/OAuthService";
import { WebHooksService } from "../../../../src/processor/services/WebHooksService";
import { ActivitiesService } from "../../../../src/processor/services/ActivitiesService";
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/processor/models/ActivitySchema";
import { StravaWebHookEventRequest } from "../../../../src/common/drivers/strava/StravaWebHookEventRequest";
import { OnActivityCreated } from "../../../../src/processor/events/OnActivityCreated";
import { LogService } from "../../../../src/common/services/LogService";
import { AccountIntegrationDocument } from "../../../../src/common/models/AccountIntegrationSchema";
import { ProcessingState } from "../../../../src/processor/models/ProcessingStatusDTO";
import { ActivityDataDocument } from "../../../../src/processor/models/ActivityDataSchema";
import { GeolocationPointDTO } from "../../../../src/processor/models/GeolocationPointDTO";

describe("common/WebHooksService", () => {
  let service: WebHooksService;
  let logger: LogService;
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
    logger = module.get<LogService>(LogService);
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

    it("should throw an error if any error was caught while processing", () => {
      // prepare
      const data = {
        object_type: "activity",
        aspect_type: "create",
        object_id: "12345",
        owner_id: "67890",
        subscription_id: 1,
        event_time: mockDate.valueOf() / 1000, // <-- Strava sends **seconds** not *milliseconds*
      };
      const errorMsg = "test-error";
      const countMock = jest.fn().mockRejectedValue(errorMsg);
      const createOrUpdateMock = jest.fn().mockReturnValue({ slug: "fake-slug" });
      (service as any).queryService = {
        count: countMock,
        createOrUpdate: createOrUpdateMock,
      };
      (service as any).eventEmitter = {
        emit: jest.fn()
      };
      const expectedError = new Error(`An error occurred while handling event ${data.object_id}: ${errorMsg}`);

      // act
      const result = service.eventHandler("strava", "fake-address", data);

      // assert
      expect(result).rejects.toThrow(expectedError);
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

  describe("onActivityCreated()", () => {
    it("should call onError() and return if data provider authorization doesn't exist", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
        slug: "test-slug",
      } as ActivityDocument;
      const activitiesServiceFindOneCall = jest
        .spyOn(activitiesService, "findOne")
        .mockResolvedValue(activity);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockResolvedValue(null);
      const onErrorCall = jest
        .spyOn((service as any), "onError")
        .mockResolvedValue({});
      const oauthServiceCallProviderAPICall = jest
        .spyOn(oauthService, "callProviderAPI")
        .mockResolvedValue({
          code: 200,
          status: true,
          data: {
            name: "test-name",
            sport_type: "test-sport",
            start_date: 123,
            timezone: "test-timezone",
            start_latlng: "test-start-latlng",
            end_latlng: "test-end-latlng",
            trainer: true,
            elapsed_time: 123,
            moving_time: 123,
            distance: 123,
            total_elevation_gain: 2,
            kilojoules: 123,
            calories: 123,
          }
        });
      const onSuccessActivityUpdateCall = jest
        .spyOn((service as any), "onSuccessActivityUpdate")
        .mockResolvedValue(true);

      // act
      await service.onActivityCreated({
        slug: "test-slug"
      } as OnActivityCreated);

      // assert
      expect(activitiesServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new ActivityQuery({
          slug: "test-slug",
        } as ActivityDocument)
      );
      expect(oauthServiceGetIntegrationCall).toHaveBeenNthCalledWith(
        1,
        activity.provider,
        activity.address,
      );
      expect(onErrorCall).toHaveBeenNthCalledWith(
        1,
        activity,
        `Missing OAuth authorization for ${activity.provider} with ` +
        `dHealth address "${activity.address}" and activity slug: ` +
        `"${activity.slug}".`,
      );
      expect(oauthServiceCallProviderAPICall).toHaveBeenCalledTimes(0);
      expect(onSuccessActivityUpdateCall).toHaveBeenCalledTimes(0);
    });

    it("should populate this activity's *data* in `activityData`", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
        slug: "test-slug",
      } as ActivityDocument;
      const activitiesServiceFindOneCall = jest
        .spyOn(activitiesService, "findOne")
        .mockResolvedValue(activity);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockResolvedValue({} as AccountIntegrationDocument);
      const onErrorCall = jest
        .spyOn((service as any), "onError")
        .mockResolvedValue({});
      const data = {
        name: "test-name",
        sport_type: "test-sport",
        start_date: 123,
        timezone: "test-timezone",
        start_latlng: "test-start-latlng",
        end_latlng: "test-end-latlng",
        trainer: true,
        elapsed_time: 123,
        moving_time: 123,
        distance: 123,
        total_elevation_gain: 2,
        kilojoules: 123,
        calories: 123,
      }
      const oauthServiceCallProviderAPICall = jest
        .spyOn(oauthService, "callProviderAPI")
        .mockResolvedValue({
          code: 200,
          status: true,
          data,
        });
      const onSuccessActivityUpdateCall = jest
        .spyOn((service as any), "onSuccessActivityUpdate")
        .mockResolvedValue(true);

      // act
      await service.onActivityCreated({
        slug: "test-slug"
      } as OnActivityCreated);

      // assert
      expect(activitiesServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new ActivityQuery({
          slug: "test-slug",
        } as ActivityDocument)
      );
      expect(oauthServiceGetIntegrationCall).toHaveBeenNthCalledWith(
        1,
        activity.provider,
        activity.address,
      );
      expect(oauthServiceCallProviderAPICall).toHaveBeenNthCalledWith(
        1,
        `/activities/${activity.remoteIdentifier}`,
        {},
      );
      expect(onSuccessActivityUpdateCall).toHaveBeenNthCalledWith(
        1,
        activity,
        {
          slug: activity.slug,
          address: activity.address,
          name: "test-name",
          sport: "test-sport",
          startedAt: 123,
          timezone: "test-timezone",
          startLocation: "test-start-latlng",
          endLocation: "test-end-latlng",
          hasTrainerDevice: true,
          elapsedTime: 123,
          movingTime: 123,
          distance: 123,
          elevation: 2,
          kilojoules: 123,
          calories: 123,
        },
      );
      expect(onErrorCall).toHaveBeenCalledTimes(0);
    });

    it("should call onError() if any error was caught", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
        slug: "test-slug",
      } as ActivityDocument;
      const activitiesServiceFindOneCall = jest
        .spyOn(activitiesService, "findOne")
        .mockResolvedValue(activity);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockResolvedValue({} as AccountIntegrationDocument);
      const onErrorCall = jest
        .spyOn((service as any), "onError")
        .mockResolvedValue({});
      const data = {
        sport_type: "test-sport",
        start_date: 123,
        timezone: "test-timezone",
        start_latlng: "test-start-latlng",
        end_latlng: "test-end-latlng",
        trainer: true,
        elapsed_time: 123,
        moving_time: 123,
        distance: 123,
        total_elevation_gain: 2,
        kilojoules: 123,
        calories: 123,
      }
      const oauthServiceCallProviderAPICall = jest
        .spyOn(oauthService, "callProviderAPI")
        .mockResolvedValue({
          code: 200,
          status: true,
          data,
        });
      const expectedError = new Error("test-error");
      const onSuccessActivityUpdateCall = jest
        .spyOn((service as any), "onSuccessActivityUpdate")
        .mockRejectedValue(expectedError);

      // act
      await service.onActivityCreated({
        slug: "test-slug"
      } as OnActivityCreated);

      // assert
      expect(activitiesServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new ActivityQuery({
          slug: "test-slug",
        } as ActivityDocument)
      );
      expect(oauthServiceGetIntegrationCall).toHaveBeenNthCalledWith(
        1,
        activity.provider,
        activity.address,
      );
      expect(oauthServiceCallProviderAPICall).toHaveBeenNthCalledWith(
        1,
        `/activities/${activity.remoteIdentifier}`,
        {},
      );
      expect(onSuccessActivityUpdateCall).toHaveBeenNthCalledWith(
        1,
        activity,
        {
          slug: activity.slug,
          address: activity.address,
          name: undefined,
          sport: "test-sport",
          startedAt: 123,
          timezone: "test-timezone",
          startLocation: "test-start-latlng",
          endLocation: "test-end-latlng",
          hasTrainerDevice: true,
          elapsedTime: 123,
          movingTime: 123,
          distance: 123,
          elevation: 2,
          kilojoules: 123,
          calories: 123,
        },
      );
      expect(onErrorCall).toHaveBeenNthCalledWith(
        1,
        activity,
        `An error happened for ${activity.provider} during request with ` +
          `dHealth address "${activity.address}" and activity slug: ` +
          `"${activity.slug}". Error: "${expectedError}"`,
        expectedError.stack,
      );
    });
  });

  describe("onError()", () => {
    it("should call errorLog() without stack if stack is undefined", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
        slug: "test-slug",
      } as ActivityDocument;
      const errorMessage = "test-error-message";
      const errorLogCall = jest
        .spyOn((service as any), "errorLog")
        .mockReturnValue(true);
      const onFailureActivityUpdateCall = jest
        .spyOn((service as any), "onFailureActivityUpdate")
        .mockResolvedValue(true);

      // act
      await (service as any).onError(
        activity,
        errorMessage,
      );

      // assert
      expect(errorLogCall).toHaveBeenNthCalledWith(1, errorMessage);
      expect(onFailureActivityUpdateCall).toHaveBeenNthCalledWith(1, activity);
    });

    it("should call errorLog() with stack if stack is defined", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
        slug: "test-slug",
      } as ActivityDocument;
      const errorMessage = "test-error-message";
      const stack = "test-error-stack";
      const errorLogCall = jest
        .spyOn((service as any), "errorLog")
        .mockReturnValue(true);
      const onFailureActivityUpdateCall = jest
        .spyOn((service as any), "onFailureActivityUpdate")
        .mockResolvedValue(true);

      // act
      await (service as any).onError(
        activity,
        errorMessage,
        stack,
      );

      // assert
      expect(errorLogCall).toHaveBeenNthCalledWith(1, errorMessage, stack);
      expect(onFailureActivityUpdateCall).toHaveBeenNthCalledWith(1, activity);
    });
  });

  describe("onFailureActivityUpdate", () => {
    it("should call correct method & return correct result", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
        slug: "test-slug",
      } as ActivityDocument;
      const activitiesServiceCreateOrUpdateCall = jest
        .spyOn(activitiesService, "createOrUpdate")
        .mockResolvedValue({
          ...activity, processingState: ProcessingState.Failed
        } as ActivityDocument);

      // act
      const result = await (service as any).onFailureActivityUpdate(activity);

      // assert
      expect(activitiesServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        new ActivityQuery({
          slug: activity.slug,
        } as ActivityDocument),
        { processingState: ProcessingState.Failed },
      );
      expect(result).toEqual({...activity, processingState: ProcessingState.Failed});
    });
  });

  describe("onSuccessActivityUpdate()", () => {
    it("should call createOrUpdate()", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
        slug: "test-slug",
      } as ActivityDocument;
      const activityData = {
        slug: "test-slug",
        address: "test-address",
        name: "test-name",
        sport: "test-sport",
        startedAt: 123,
        timezone: "test-timezone",
        startLocation: new GeolocationPointDTO(),
        endLocation: new GeolocationPointDTO(),
        hasTrainerDevice: true,
        elapsedTime: 123,
        movingTime: 123,
        distance: 123,
        elevation: 123,
        calories: 123,
      } as ActivityDataDocument;
      const activitiesServiceCreateOrUpdateCall = jest
        .spyOn(activitiesService, "createOrUpdate")
        .mockResolvedValue({
          ...activity, processingState: ProcessingState.Processed
        } as ActivityDocument);

      // act
      const result = await (service as any).onSuccessActivityUpdate(activity, activityData);

      // assert
      expect(activitiesServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        new ActivityQuery({
          slug: activity.slug,
        } as ActivityDocument),
        { activityData, processingState: ProcessingState.Processed },
      );
      expect(result).toEqual({...activity, processingState: ProcessingState.Processed})
    });
  });

  describe("debugLog()", () => {
    it("should call debug() from logger with context it it exists", () => {
      // prepare
      const loggerDebugCall = jest
        .spyOn(logger, "debug")
        .mockReturnValue();
      const message = "test-message";
      const context = "test-context";

      // act
      (service as any).debugLog(message, context);

      // assert
      expect(loggerDebugCall).toHaveBeenNthCalledWith(1, message, context);
    });

    it("should call debug() from logger without context if it doesn't exist", () => {
      // prepare
      const loggerDebugCall = jest
        .spyOn(logger, "debug")
        .mockReturnValue();
      const message = "test-message";

      // act
      (service as any).debugLog(message);

      // assert
      expect(loggerDebugCall).toHaveBeenNthCalledWith(1, message);
    });
  });

  describe("debugLog()", () => {
    it("should call error() from logger", () => {
      // prepare
      const loggerErrorCall = jest
      .spyOn(logger, "error")
      .mockReturnValue();
      const message = "test-message";
      const stack = "test-stack";
      const context = "test-context";

      // act
      (service as any).errorLog(message, stack, context);

      // assert
      expect(loggerErrorCall).toHaveBeenNthCalledWith(1, message, stack, context);
    });
  });
});
