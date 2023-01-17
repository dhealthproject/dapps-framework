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
import { OnAuthClosed } from "../../../../src/common/events/OnAuthClosed";

describe("common/OnAuthClosed", () => {
  describe("create()", () => {
    it("should run correctly & return correct instance", () => {
      // prepare
      [null, "test-challenge"].forEach((challenge: string) => {
        // act
        const result = OnAuthClosed.create(challenge);

        // assert
        expect(result).toBeDefined();
        expect(result.challenge).toBe(challenge);
      });
    });
  });
});