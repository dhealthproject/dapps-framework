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
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { QueryService } from "../../../../src/common/services/QueryService";
import { PayoutsService } from "../../../../src/payout/services/PayoutsService";
import { PayoutDocument, PayoutModel, PayoutQuery } from "../../../../src/payout/models/PayoutSchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";

describe("payout/PayoutsService", () => {
  let service: PayoutsService;
  let queryService: QueryService<PayoutDocument, PayoutModel>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayoutsService,
        QueryService,
        {
          provide: getModelToken("Payout"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<PayoutsService>(PayoutsService);
    queryService = module.get<QueryService<PayoutDocument, PayoutModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
    it("should call count() from queryService", async () => {
      // prepare
      const queryServiceCountCall = jest
        .spyOn(queryService, "count")
        .mockResolvedValue(1);

      // act
      await service.count({} as PayoutQuery);

      // assert
      expect(queryServiceCountCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("exists()", () => {
    it("should return correct result", async () => {
      // prepare
      const queryServiceFindOneCall = jest
        .spyOn(queryService, "findOne")
        .mockResolvedValue({} as PayoutDocument);

      // act
      const result = await service.exists({} as PayoutQuery);

      // assert
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(1, {}, MockModel, true);
      expect(result).toBe(true);
    });
  });

  describe("find()", () => {
    it("should call find() from queryService", async () => {
      // prepare
      const queryServiceFindCall = jest
        .spyOn(queryService, "find")
        .mockResolvedValue({} as PaginatedResultDTO<PayoutDocument>);

      // act
      await service.find({} as PayoutQuery);

      // assert
      expect(queryServiceFindCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("findOne()", () => {
    it("should call findOne() from queryService", async () => {
      // prepare
      const queryServiceFindOneCall = jest
      .spyOn(queryService, "findOne")
      .mockResolvedValue({} as PayoutDocument);

      // act
      await service.findOne({} as PayoutQuery);

      // assert
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("createOrUpdate()", () => {
    it("should call createOrUpdate() from queryService", async () => {
      // prepare
      const queryServiceCreateOrUpdateCall = jest
      .spyOn(queryService, "createOrUpdate")
      .mockResolvedValue({} as PayoutDocument);

      // act
      await service.createOrUpdate({} as PayoutQuery, {} as PayoutModel);

      // assert
      expect(queryServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        {},
        MockModel,
        {},
        {},
      );
    });
  });

  describe("updateBatch()", () => {
    it("should call updateBatch() from queryService", async () => {
      // prepare
      const queryServiceUpdateBatchCall = jest
      .spyOn(queryService, "updateBatch")
      .mockResolvedValue(1);

      // act
      await service.updateBatch([{}]);

      // assert
      expect(queryServiceUpdateBatchCall).toHaveBeenNthCalledWith(1, MockModel, [{}]);
    });
  });
});