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
import { BlockDTO } from "../../../../src/discovery/models/BlockDTO";
import { Block, BlockDocument } from "../../../../src/discovery/models/BlockSchema";

describe("discovery/BlockSchema", () => {
  describe("toQuery()", () => {
    it("should return correct database query", () => {
      // prepare
      const block: Block = new Block();
      (block as any).height = 1;
      (block as any).harvester = "test-harvester";
      (block as any).timestamp = 123456;
      (block as any).countTransactions = 1;

      // act
      const blockToQuery = block.toQuery;

      // assert
      expect("height" in blockToQuery).toBe(true);
      expect("harvester" in blockToQuery).toBe(true);
      expect("timestamp" in blockToQuery).toBe(true);
      expect("countTransactions" in blockToQuery).toBe(true);
      expect(blockToQuery.height).toBe(block.height);
      expect(blockToQuery.harvester).toBe(block.harvester);
      expect(blockToQuery.timestamp).toBe(block.timestamp);
      expect(blockToQuery.countTransactions).toBe(block.countTransactions);
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const assetDocument = {
        height: 1,
        harvester: "test-harvester",
        timestamp: 123456,
        countTransactions: 1,
        createdAt: new Date(),
      } as BlockDocument;

      // act
      const result = Block.fillDTO(assetDocument, new BlockDTO());

      // assert
      expect(result).toEqual({
        height: 1,
        harvester: "test-harvester",
        timestamp: 123456,
        countTransactions: 1,
      });
    });
  });
});