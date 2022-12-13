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
import { ActivityDTO } from "../../../../src/users/models/ActivityDTO";
import { Activity, ActivityDocument } from "../../../../src/users/models/ActivitySchema";

describe("users/ActivitySchema", () => {
  describe("toQuery()", () => {
    it("should return correct value", () => {
      // prepare
      const address = "test-address";
      const slug = "test-slug";
      const dateSlug = "test-dateSlug";
      const remoteIdentifier = "test-remoteIdentifier";
      const processingState = "test-processingState";
      const payoutState = "test-payoutState";
      const activity: Activity = new Activity();
      (activity as any).address = address;
      (activity as any).slug = slug;
      (activity as any).dateSlug = dateSlug;
      (activity as any).remoteIdentifier = remoteIdentifier;
      (activity as any).processingState = processingState;
      (activity as any).payoutState = payoutState;

      // act
      const stateToQuery = activity.toQuery;

      // assert
      expect(stateToQuery).toEqual({
        address,
        slug,
        dateSlug,
        remoteIdentifier,
        processingState,
        payoutState,
      });
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const address = "test-address";
      const slug = "test-slug";
      const activity: Activity = new Activity();
      (activity as any).address = address;
      (activity as any).slug = slug;
      const expectedResult = { address, slug };

      // act
      const result = Activity.fillDTO(activity as ActivityDocument, new ActivityDTO());

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});