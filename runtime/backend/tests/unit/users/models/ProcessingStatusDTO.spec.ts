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
import { ProcessingStatusDTO } from "../../../../src/users/models/ProcessingStatusDTO";

describe("users/ProcessingStatusDTO", () => {
  describe("static create()", () => {
    it("should create instance with correct status", () => {
      // act
      const result = ProcessingStatusDTO.create(1);

      // assert
      expect(result).toBeInstanceOf(ProcessingStatusDTO);
      expect(result.status).toBe(1);
    });
  });
});