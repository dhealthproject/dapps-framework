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
import { AssetDTO } from "../../../../src/discovery/models/AssetDTO";
import { Asset, AssetDocument } from "../../../../src/discovery/models/AssetSchema";

describe("discovery/AssetSchema", () => {
  describe("toQuery()", () => {
    it("should return correct database query", () => {
      // prepare
      const asset: Asset = new Asset();
      (asset as any).transactionHash = "fake-hash";
      (asset as any).userAddress = "fake-address";
      (asset as any).mosaicId = "fake-mosaic-id";

      // act
      const assetToQuery = asset.toQuery;

      // assert
      expect("transactionHash" in assetToQuery).toBe(true);
      expect("userAddress" in assetToQuery).toBe(true);
      expect("mosaicId" in assetToQuery).toBe(true);
      expect(assetToQuery.transactionHash).toBe(asset.transactionHash);
      expect(assetToQuery.userAddress).toBe(asset.userAddress);
      expect(assetToQuery.mosaicId).toBe(asset.mosaicId);
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const assetDocument = {
        transactionHash: "fake-hash",
        userAddress: "fake-address",
        mosaicId: "fake-mosaic-id",
        amount: 123,
        creationBlock: 1234,
        createdAt: new Date(),
      } as AssetDocument;

      // act
      const result = Asset.fillDTO(assetDocument, new AssetDTO());

      // assert
      expect(result).toEqual({
        transactionHash: "fake-hash",
        userAddress: "fake-address",
        assetId: "fake-mosaic-id",
        amount: 123,
        creationBlock: 1234,
      });
    });
  });
});