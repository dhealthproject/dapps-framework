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
import { OperationsService } from "../../../../src/processor/services/OperationsService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { OperationDocument, OperationModel, OperationQuery } from "../../../../src/processor/models/OperationSchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";


describe("common/OperationsService", () => {
  let service: OperationsService;
  let queriesService: QueryService<OperationDocument, OperationModel>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationsService,
        QueryService,
        {
          provide: getModelToken("Operation"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<OperationsService>(OperationsService);
    queriesService = module.get<QueryService<OperationDocument, OperationModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
    it("should call count() from queriesService", async () => {
      // prepare
      const queryServiceCountCall = jest
        .spyOn(queriesService, "count")
        .mockResolvedValue(1);

      // act
      await service.count({} as OperationQuery);

      // assert
      expect(queryServiceCountCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("exists()", () => {
    it("should return correct result", async () => {
      // prepare
      const queryServiceFindOneCall = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as OperationDocument);

      // act
      const result = await service.exists({} as OperationQuery);

      // assert
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(1, {}, MockModel, true);
      expect(result).toBe(true);
    });
  });

  describe("find()", () => {
    it("should call find() from queriesService", async () => {
      // prepare
      const queryServiceFindCall = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue({} as PaginatedResultDTO<OperationDocument>);

      // act
      await service.find({} as OperationQuery);

      // assert
      expect(queryServiceFindCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("findOne()", () => {
    it("should call findOne() from queriesService", async () => {
      // prepare
      const queryServiceFindOneCall = jest
      .spyOn(queriesService, "findOne")
      .mockResolvedValue({} as OperationDocument);

      // act
      await service.findOne({} as OperationQuery);

      // assert
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("createOrUpdate()", () => {
    it("should call createOrUpdate() from queriesService", async () => {
      // prepare
      const queryServiceCreateOrUpdateCall = jest
      .spyOn(queriesService, "createOrUpdate")
      .mockResolvedValue({} as OperationDocument);

      // act
      await service.createOrUpdate({} as OperationQuery, {} as OperationModel);

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
    it("should call updateBatch() from queriesService", async () => {
      // prepare
      const queryServiceUpdateBatchCall = jest
      .spyOn(queriesService, "updateBatch")
      .mockResolvedValue(1);

      // act
      await service.updateBatch([{}]);

      // assert
      expect(queryServiceUpdateBatchCall).toHaveBeenNthCalledWith(1, MockModel, [{}]);
    });
  });
});