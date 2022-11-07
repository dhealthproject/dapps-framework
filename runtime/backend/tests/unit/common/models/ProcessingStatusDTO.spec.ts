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
import { ProcessingStatusDTO } from "../../../../src/processor/models/ProcessingStatusDTO";


describe("common/ProcessingStatusDTO", () => {
  describe("create()", () => {
    it("should create correct instance", () => {
      // act
      const result = ProcessingStatusDTO.create(200);

      // assert
      expect(result).toBeDefined();
      expect(result.status).toBe(200);
    });
  });
});