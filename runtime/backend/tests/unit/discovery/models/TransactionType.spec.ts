/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { TransactionType } from "@dhealth/sdk";

// internal dependencies
import { getTransactionType } from "../../../../src/discovery/models/TransactionTypes";

describe("discovery/TransactionType", () => {
  describe("getTransactionType()", () => {
    it("should return transaction type: transfer", () => {
      // act
      const result = getTransactionType(TransactionType.TRANSFER);

      // assert
      expect(result).toBe("transfer");
    });

    it("should return transaction type: custom", () => {
      // act
      const result = getTransactionType(TransactionType.RESERVED);

      // assert
      expect(result).toBe("custom");
    });
  })
});