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
import { StravaWebHookSubscriptionFields, StravaWebHookSubscriptionRequest } from "../../../../../src/oauth/drivers/strava";

describe("common/StravaWebHookEventRequest", () => {
  it("should be defined", () => {
    // act
    const instance = new StravaWebHookSubscriptionRequest();

    // assert
    expect(instance).toBeDefined();
  });

  describe("get subscriptionValidationObject()", () => {
    it("should return correct result", () => {
      // prepare
      const instance = new StravaWebHookSubscriptionRequest();
      instance.hub = new StravaWebHookSubscriptionFields();
      const expectedResult = instance.hub;

      // act
      const result  = instance.subscriptionValidationObject;

      // assert
      expect(result).toBe(expectedResult);
    });
  });
});