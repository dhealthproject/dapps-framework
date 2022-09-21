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
import { AccountIntegrationDTO } from "@/common/models/AccountIntegrationDTO";
import { AccountIntegration, AccountIntegrationDocument } from "../../../../src/common/models/AccountIntegrationSchema";

describe("common/AccountIntegrationSchema", () => {
  describe("toQuery() -->", () => {
    it("should return correct value", () => {
      // prepare
      const address = "test-address";
      const accountIntegration: AccountIntegration = new AccountIntegration();
      (accountIntegration as any).address = address;

      // act
      const accountToQuery = accountIntegration.toQuery;

      // assert
      expect(accountToQuery).toEqual({ address });
    });

    it("should return name value", () => {
      // prepare
      const address = "test-address";
      const name = "test-name";
      const accountIntegration: AccountIntegration = new AccountIntegration();
      (accountIntegration as any).address = address;
      (accountIntegration as any).name = name;

      // act
      const accountToQuery = accountIntegration.toQuery;

      // assert
      expect(accountToQuery).toEqual({ address, name });
    });
  });

  describe("fillDTO() -->", () => {
    it("should return correct instance", () => {
      // prepare
      const address = "test-address";
      const name = "test-name";
      const accountIntegration: AccountIntegration = new AccountIntegration();
      (accountIntegration as any).address = address;
      (accountIntegration as any).name = name;
      const expectedResult = { address, name };

      // act
      const result = AccountIntegration.fillDTO(
        accountIntegration as AccountIntegrationDocument,
        {} as AccountIntegrationDTO
      );

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});