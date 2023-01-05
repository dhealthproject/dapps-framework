/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
let loggerLogCall = jest.fn();
const loggerMock = {
  setContext: jest.fn(),
  log: loggerLogCall,
  debug: jest.fn(),
  error: jest.fn(),
};
jest.mock("../../../../src/common/services/LogService", () => ({
  LogService: jest.fn().mockImplementation(() => loggerMock)
}));

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
import { ActivitiesService } from "../../../../src/users/services/ActivitiesService";
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/users/models/ActivitySchema";
import { OnActivityCreated } from "../../../../src/oauth/events/OnActivityCreated";
import { AccountIntegrationDocument } from "../../../../src/common/models/AccountIntegrationSchema";
import { LogService } from "../../../../src/common/services/LogService";
import { ResponseStatusDTO } from "../../../../src/common/models/ResponseStatusDTO";
import { OnActivityDownloaded } from "../../../../src/oauth/events/OnActivityDownloaded";
import { ProcessingState } from "../../../../src/users/models/ProcessingStatusDTO";
import { EventHandlerStrategyFactory } from "../../../../src/oauth/drivers/EventHandlerStrategyFactory";
import { StravaEventHandlerStrategy } from "../../../../src/oauth/drivers/strava/StravaEventHandlerStrategy";
import { BasicWebHookEventRequest } from "../../../../src/oauth/drivers/BasicWebHookEventRequest";

describe("processor/WebHooksService", () => {
  let service: WebHooksService;
  let queryService: QueryService<ActivityDocument, ActivityModel>;
  let oauthService: OAuthService;
  let activitiesService: ActivitiesService;
  let eventHandlerStrategyFactory: EventHandlerStrategyFactory;
  let stravaEventHandlerStrategy: StravaEventHandlerStrategy;
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
        LogService,
        EventHandlerStrategyFactory,
        StravaEventHandlerStrategy,
      ],
    }).compile();

    service = module.get<WebHooksService>(WebHooksService);
    queryService = module.get<QueryService<ActivityDocument, ActivityModel>>(QueryService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    oauthService = module.get<OAuthService>(OAuthService);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
    eventHandlerStrategyFactory = module.get<EventHandlerStrategyFactory>(EventHandlerStrategyFactory);
    stravaEventHandlerStrategy = module.get<StravaEventHandlerStrategy>(StravaEventHandlerStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    loggerLogCall.mockImplementation(() => ({}));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("eventHandler()", () => {
    it("should create from event handler's factory & call method", async () => {
      // prepare
      const eventHandlerStrategyFactoryCreateCall = jest
        .spyOn(eventHandlerStrategyFactory, "create")
        .mockReturnValue(stravaEventHandlerStrategy);
      const stravaEventHandlerStrategyEventHandlerCall = jest
        .spyOn(stravaEventHandlerStrategy, "eventHandler")
        .mockResolvedValue({} as ActivityDocument);

      // act
      const result = await service.eventHandler(
        "test-providerName",
        "test-userAddress",
        {} as BasicWebHookEventRequest
      );

      // assert
      expect(eventHandlerStrategyFactoryCreateCall).toHaveBeenCalledTimes(1);
      expect(stravaEventHandlerStrategyEventHandlerCall).toHaveBeenNthCalledWith(
        1,
        "test-providerName",
        "test-userAddress",
        {},
      );
      expect(result).toEqual({});
    });
  });

  describe("onActivityCreated()", () => {
    it("should call correct methods & run correctly", async () => {
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
        .mockResolvedValue({
          name: "test-name",
        } as AccountIntegrationDocument);
      const oauthServiceCallProviderAPICall = jest
        .spyOn(oauthService, "callProviderAPI")
        .mockResolvedValue({
          data: "test-data",
        } as ResponseStatusDTO);
      const oauthServiceExtractProviderEntityCall = jest
        .spyOn(oauthService, "extractProviderEntity")
        .mockReturnValue({
          slug: "test-slug",
          address: "test-address",
        } as any);
      const eventEmitterEmitCall = jest
        .spyOn(eventEmitter, "emit")
        .mockReturnValue(true);
      const expectedError = new Error("test-error");
      // loggerLogCall.mockImplementation(() => { throw expectedError });
      const onSuccessActivityUpdateCall = jest
        .spyOn((service as any), "onSuccessActivityUpdate")
        .mockResolvedValue(true);

      // act
      await service.onActivityCreated(OnActivityCreated.create("test-slug"));

      // assert
      expect(activitiesServiceFindOneCall).toHaveBeenNthCalledWith(1, new ActivityQuery({
        slug: "test-slug",
      } as ActivityDocument));
      expect(oauthServiceGetIntegrationCall).toHaveBeenNthCalledWith(
        1,
        "test-provider",
        "test-address",
      );
      expect(oauthServiceCallProviderAPICall).toHaveBeenNthCalledWith(
        1,
        `/activities/${activity.remoteIdentifier}`,
        { name: "test-name" },
      )
      expect(oauthServiceExtractProviderEntityCall).toHaveBeenNthCalledWith(
        1,
        "test-name",
        "test-data",
        2
      )
      expect(eventEmitterEmitCall).toHaveBeenNthCalledWith(
        1,
        "oauth.activity.downloaded",
        OnActivityDownloaded.create(activity.slug),
      )
      expect(onSuccessActivityUpdateCall).toHaveBeenNthCalledWith(
        1,
        activity,
        { slug: "test-slug", address: "test-address" },
      )
    });

    it("stop if there's no data provider authorization", async () => {
      // prepare
      const activity = {
        provider: "test-provider",
        address: "test-address",
      } as ActivityDocument;
      const activitiesServiceFindOneCall = jest
        .spyOn(activitiesService, "findOne")
        .mockResolvedValue(activity);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockResolvedValue(null);
      const onErrorCall = jest
        .spyOn((service as any), "onError")
        .mockReturnValue(true);

      // act
      const result = await service.onActivityCreated(OnActivityCreated.create("test-slug"));

      // assert
      expect(activitiesServiceFindOneCall).toHaveBeenNthCalledWith(1, new ActivityQuery({
        slug: "test-slug",
      } as ActivityDocument));
      expect(oauthServiceGetIntegrationCall).toHaveBeenNthCalledWith(
        1,
        "test-provider",
        "test-address",
      );
      expect(onErrorCall).toHaveBeenNthCalledWith(
        1,
        loggerMock,
        activity,
        `` +
          `Missing OAuth authorization for ${activity.provider} with ` +
          `dHealth address "${activity.address}" and activity slug: ` +
          `"${activity.slug}".`,)
      expect(result).toBeUndefined();
    });

    it("should throw an error if error happens in event handling process", async () => {
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
        .mockResolvedValue({
          name: "test-name",
        } as AccountIntegrationDocument);
      const oauthServiceCallProviderAPICall = jest
        .spyOn(oauthService, "callProviderAPI")
        .mockResolvedValue({
          data: "test-data",
        } as ResponseStatusDTO);
      const oauthServiceExtractProviderEntityCall = jest
        .spyOn(oauthService, "extractProviderEntity")
        .mockReturnValue({
          slug: "test-slug",
          address: "test-address",
        } as any);
      const eventEmitterEmitCall = jest
        .spyOn(eventEmitter, "emit")
        .mockReturnValue(true);
      const expectedError = new Error("test-error");
      // loggerLogCall.mockImplementation(() => { throw expectedError });
      const onSuccessActivityUpdateCall = jest
        .spyOn((service as any), "onSuccessActivityUpdate")
        .mockRejectedValue(expectedError);
      const onErrorCall = jest
        .spyOn((service as any), "onError")
        .mockReturnValue(true);
      const expectedMsg: string = `` +
      `An error happened for ${activity.provider} during request with ` +
      `dHealth address "${activity.address}" and activity slug: ` +
      `"${activity.slug}". Error: "${expectedError}"`;

      // act
      await service.onActivityCreated(OnActivityCreated.create("test-slug"));

      // assert
      expect(activitiesServiceFindOneCall).toHaveBeenNthCalledWith(1, new ActivityQuery({
        slug: "test-slug",
      } as ActivityDocument));
      expect(oauthServiceGetIntegrationCall).toHaveBeenNthCalledWith(
        1,
        "test-provider",
        "test-address",
      );
      expect(oauthServiceCallProviderAPICall).toHaveBeenNthCalledWith(
        1,
        `/activities/${activity.remoteIdentifier}`,
        { name: "test-name" },
      )
      expect(oauthServiceExtractProviderEntityCall).toHaveBeenNthCalledWith(
        1,
        "test-name",
        "test-data",
        2
      )
      expect(eventEmitterEmitCall).toHaveBeenNthCalledWith(
        1,
        "oauth.activity.downloaded",
        OnActivityDownloaded.create(activity.slug),
      )
      expect(onSuccessActivityUpdateCall).toHaveBeenNthCalledWith(
        1,
        activity,
        { slug: "test-slug", address: "test-address" },
      )
      expect(onErrorCall).toHaveBeenNthCalledWith(
        1,
        loggerMock,
        activity,
        expectedMsg,
        expectedError.stack,
      );
    });
  });

  describe("onError()", () => {
    it("should log error without stack if stack was not provided", async () => {
      // prepare
      const messageParamValue = "test-message";
      const onFailureActivityUpdateCall = jest
        .spyOn((service as any), "onFailureActivityUpdate")
        .mockResolvedValue(true);

      // act
      await (service as any).onError(
        loggerMock,
        {},
        messageParamValue,
      );

      // assert
      expect(loggerMock.error).toHaveBeenNthCalledWith(1, messageParamValue);
      expect(onFailureActivityUpdateCall).toHaveBeenNthCalledWith(1, {});
    });

    it("should log error with stack if stack was provided", async () => {
      // prepare
      const messageParamValue = "test-message";
      const stackParamValue = "test-stack";
      const onFailureActivityUpdateCall = jest
        .spyOn((service as any), "onFailureActivityUpdate")
        .mockResolvedValue(true);

      // act
      await (service as any).onError(
        loggerMock,
        {},
        messageParamValue,
        stackParamValue,
      );

      // assert
      expect(loggerMock.error).toHaveBeenNthCalledWith(1, messageParamValue, stackParamValue);
      expect(onFailureActivityUpdateCall).toHaveBeenNthCalledWith(1, {});
    });
  });

  describe("onFailureActivityUpdate()", () => {
    it("should call createOrUpdate() from activitiesService", async () => {
      // prepare
      const activity = {
        slug: "test-slug",
      };
      const activitiesServiceCreateOrUpdateCall = jest
        .spyOn(activitiesService, "createOrUpdate")
        .mockResolvedValue(activity as ActivityDocument);

      // act
      await (service as any).onFailureActivityUpdate(activity);

      // assert
      expect(activitiesServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        new ActivityQuery({
          slug: activity.slug,
        } as ActivityDocument),
        { processingState: ProcessingState.Failed },
      );
    });
  });

  describe("onSuccessActivityUpdate()", () => {
    it("should call createOrUpdate() from activitiesService", async () => {
      // prepare
      const activity = {
        slug: "test-slug",
      };
      const activitiesServiceCreateOrUpdateCall = jest
        .spyOn(activitiesService, "createOrUpdate")
        .mockResolvedValue(activity as ActivityDocument);

      // act
      await (service as any).onSuccessActivityUpdate(activity, {});

      // assert
      expect(activitiesServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        new ActivityQuery({
          slug: activity.slug,
        } as ActivityDocument),
        { activityData: {}, processingState: ProcessingState.Processed },
      );
    });
  });
});
