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
import { Account } from "../../../../src/common/models/AccountSchema";

describe("common/AccountSchema", () => {
  describe("toQuery() -->", () => {
    it("should return correct value", () => {
      // prepare
      const address = "test-address";
      const account: Account = new Account();
      (account as any).address = address;

      // act
      const accountToQuery = account.toQuery;

      // assert
      expect(accountToQuery).toEqual({ address });
    });
  });
});