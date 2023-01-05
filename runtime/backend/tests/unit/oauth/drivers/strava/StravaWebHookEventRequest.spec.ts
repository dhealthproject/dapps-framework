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
import { StravaWebHookEventRequest } from "../../../../../src/oauth/drivers/strava";

describe("common/StravaWebHookEventRequest", () => {
  it("should be defined", () => {
    // act
    const instance = new StravaWebHookEventRequest();

    // assert
    expect(instance).toBeDefined();
  });

  describe("get remoteIdentifier()", () => {
    it("should return correct result", () => {
      // prepare
      const instance = new StravaWebHookEventRequest();
      instance.owner_id = "test-owner_id";
      const expectedResult = instance.owner_id;

      // act
      const result  = instance.remoteIdentifier;

      // assert
      expect(result).toBe(expectedResult);
    });
  });
});