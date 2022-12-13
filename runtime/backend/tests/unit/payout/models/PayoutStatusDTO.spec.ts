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
import { PayoutStatusDTO } from "../../../../src/payout/models/PayoutStatusDTO";

describe("payout/PayoutStatusDTO", () => {
  describe("static create()", () => {
    it("should set status and return instance of this dto", () => {
      // prepare
      const expectedResult = {
        status: 1
      } as PayoutStatusDTO;

      // act
      const result = PayoutStatusDTO.create(1);

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});