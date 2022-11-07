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
import { ProcessingState } from "../../../../src/processor/models/ProcessingStatusDTO";
import { Activity } from "../../../../src/processor/models/ActivitySchema";


describe("common/ActivityDataSchema", () => {
  let activity: Activity;

  beforeEach(() => {
    activity = new Activity();
    (activity as any).address = "test-address";
    (activity as any).remoteIdentifier = "test-remote-identifier";
    (activity as any).slug = "test-slug";
    (activity as any).dateSlug = "test-date-slug";
    (activity as any).provider = "test-provider";
    (activity as any).activityAssets = [];
    (activity as any).activityData = {};
    (activity as any).processingState = ProcessingState.Processed;
  });
  
  describe("get toQuery() -->", () => {
    it("should return correct result", () => {
      // act
      const result = activity.toQuery;

      // assert
      expect(result).toEqual({
        address: activity.address,
        slug: activity.slug,
        dateSlug: activity.dateSlug,
        remoteIdentifier: activity.remoteIdentifier,
        processingState: activity.processingState,
      });
    });
  });
});