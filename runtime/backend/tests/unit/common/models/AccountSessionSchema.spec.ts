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
import { AccountSession, AccountSessionDocument } from "../../../../src/common/models/AccountSessionSchema";
import { AccountSessionDTO } from "../../../../src/common/models/AccountSessionDTO";

describe("common/AccountSessionSchema", () => {
  describe("toQuery()", () => {
    it("should return correct value", () => {
      // prepare
      const address = "test-address";
      const accountSession: AccountSession = new AccountSession();
      (accountSession as any).address = address;

      // act
      const accountToQuery = accountSession.toQuery;

      // assert
      expect(accountToQuery).toEqual({ address });
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const address = "test-address";
      const accessToken = "test-accessToken";
      const refreshTokenHash = "test-refreshTokenHash";
      const lastSessionHash = "test-lastSessionHash";
      const referralCode = "test-referralCode";
      const referredBy = "test-referredBy";
      const accountSession: AccountSession = new AccountSession();
      (accountSession as any).address = address;
      (accountSession as any).accessToken = accessToken;
      (accountSession as any).refreshTokenHash = refreshTokenHash;
      (accountSession as any).lastSessionHash = lastSessionHash;
      (accountSession as any).referralCode = referralCode;
      (accountSession as any).referredBy = referredBy;
      const accountSessionDTO: AccountSessionDTO = new AccountSessionDTO();

      // act
      const result = AccountSession.fillDTO(
        accountSession as AccountSessionDocument,
        accountSessionDTO,
      );

      // assert
      expect(result).toEqual({
        address,
        accessToken,
        refreshTokenHash,
        lastSessionHash,
        referralCode,
        referredBy,
      });
    });
  });
});