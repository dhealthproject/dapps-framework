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
import { StatusDTO } from "../../../../src/common/models/StatusDTO";

describe("common/StatusDTO", () => {
  describe("create()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = new StatusDTO();
      expectedResult.code = 200;
      expectedResult.status = true;

      // act
      const result = StatusDTO.create(200);

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});