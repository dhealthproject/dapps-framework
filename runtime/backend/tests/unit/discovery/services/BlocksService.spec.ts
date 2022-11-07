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
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { QueryService } from "../../../../src/common/services/QueryService";
import { BlocksService } from "../../../../src/discovery/services/BlocksService";
import { BlockDocument, BlockModel, BlockQuery } from "../../../../src/discovery/models/BlockSchema";

describe("discovery/BlocksService", () => {
  let service: BlocksService;
  let queriesService: QueryService<BlockDocument, BlockModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        QueryService,
        {
          provide: getModelToken("Block"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
    queriesService = module.get<QueryService<BlockDocument, BlockModel>>(QueryService);
  });

  describe("exists()", () => {
    it("should return correct result", async () => {
      // prepare
      const queriesServiceFindOneCall = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as BlockDocument);
      const query = new BlockQuery();

      // act
      const result = await service.exists(new BlockQuery());

      // assert
      expect(queriesServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        query,
        MockModel,
        true,
      );
      expect(result).toBe(true);
    });
  });
});