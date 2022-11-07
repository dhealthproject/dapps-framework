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
import { PayoutDTO } from "../../../../src/payout/models/PayoutDTO";
import { Payout, PayoutDocument } from "../../../../src/payout/models/PayoutSchema";

describe("payout/PayoutSchema", () => {
  describe("toQuery()", () => {
    it("should return correct value", () => {
      // prepare
      const slug = "test-slug";
      const collection = "test-collection";
      const address = "test-address";
      const payout: Payout = new Payout();
      (payout as any).subjectSlug = slug;
      (payout as any).subjectCollection = collection;
      (payout as any).userAddress = address;

      // act
      const payoutToQuery = payout.toQuery;

      // assert
      expect(payoutToQuery).toEqual({
        userAddress: address,
        subjectSlug: slug,
        subjectCollection: collection,
      });
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const slug = "test-slug";
      const collection = "test-collection";
      const address = "test-address";
      const assets = { mosaicId: "fake-id", amount: 1 };
      const payout: Payout = new Payout();
      (payout as any).subjectSlug = slug;
      (payout as any).subjectCollection = collection;
      (payout as any).userAddress = address;
      (payout as any).payoutAssets = assets;
      const expectedResult = { address, assets };

      // act
      const result = Payout.fillDTO(payout as PayoutDocument, new PayoutDTO());

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});