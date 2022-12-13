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
import { OnActivityDownloaded } from "../../../../src/oauth/events/OnActivityDownloaded";

describe("oauth/OnActivityDownloaded", () => {
  describe("static create()", () => {
    it("should set slug and return instance of this event", () => {
      // prepare
      const expectedSlug = "test-slug";

      // act
      const result = OnActivityDownloaded.create(expectedSlug);

      // assert
      expect(result).toBeInstanceOf(OnActivityDownloaded);
      expect(result.slug).toEqual(expectedSlug);
    });
  });
});