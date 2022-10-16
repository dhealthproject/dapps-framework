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
import { StravaWebHookSubscriptionRequest } from "../../../../../src/common/drivers/strava";

describe("common/StravaWebHookEventRequest", () => {
  it("should be defined", () => {
    // act
    const instance = new StravaWebHookSubscriptionRequest();

    // assert
    expect(instance).toBeDefined();
  });
});