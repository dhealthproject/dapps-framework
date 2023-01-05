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
import { getModelToken } from "@nestjs/mongoose";
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import { EventHandlerStrategyFactory } from "../../../../src/oauth/drivers/EventHandlerStrategyFactory";
import { StravaEventHandlerStrategy } from "../../../../src/oauth/drivers/strava/StravaEventHandlerStrategy";
import { MockModel } from "../../../mocks/global";
import { ActivitiesService } from "../../../../src/users/services/ActivitiesService";
import { QueryService } from "../../../../src/common/services/QueryService";

describe("common/EventHandlerStrategyFactory", () => {
  let factory: EventHandlerStrategyFactory

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventHandlerStrategyFactory,
        StravaEventHandlerStrategy,
        ActivitiesService,
        QueryService,
        EventEmitter2,
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
      ],
    }).compile();

    factory = module.get<EventHandlerStrategyFactory>(EventHandlerStrategyFactory);
  });

  it("should be defined", () => {
    expect(factory).toBeDefined();
  });

  describe("create()", () => {
    it("should return correct result", () => {
      const expectedResults = [
        (factory as any).stravaEventHandlerStrategy
      ];
      ["strava"].forEach((providerName: string, index: number) => {
        // act
        const result = factory.create(providerName);

        // assert
        expect(result).toEqual(expectedResults[index]);
      });
    });
  });
});