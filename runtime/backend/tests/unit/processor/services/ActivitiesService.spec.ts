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
import { ActivitiesService } from "../../../../src/processor/services/ActivitiesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/processor/models/ActivitySchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";

describe("common/WebHooksService", () => {
  let service: ActivitiesService;
  let queriesService: QueryService<ActivityDocument, ActivityModel>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        QueryService,
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    queriesService = module.get<QueryService<ActivityDocument, ActivityModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
    it("should call count() from queryService", async () => {
      // prepare
      const queryServiceCountCall = jest
        .spyOn(queriesService, "count")
        .mockResolvedValue(1);

      // act
      await service.count({} as ActivityQuery);

      // assert
      expect(queryServiceCountCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("exists()", () => {
    it("should return correct result", async () => {
      // prepare
      const queryServiceFindOneCall = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as ActivityDocument);

      // act
      const result = await service.exists({} as ActivityQuery);

      // assert
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(1, {}, MockModel, true);
      expect(result).toBe(true);
    });
  });

  describe("find()", () => {
    it("should call find() from queryService", async () => {
      // prepare
      const queryServiceFindCall = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue({} as PaginatedResultDTO<ActivityDocument>);

      // act
      await service.find({} as ActivityQuery);

      // assert
      expect(queryServiceFindCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("findOne()", () => {
    it("should call findOne() from queryService", async () => {
      // prepare
      const queryServiceFindOneCall = jest
      .spyOn(queriesService, "findOne")
      .mockResolvedValue({} as ActivityDocument);

      // act
      await service.findOne({} as ActivityQuery);

      // assert
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("createOrUpdate()", () => {
    it("should call createOrUpdate() from queryService", async () => {
      // prepare
      const queryServiceCreateOrUpdateCall = jest
      .spyOn(queriesService, "createOrUpdate")
      .mockResolvedValue({} as ActivityDocument);

      // act
      await service.createOrUpdate({} as ActivityQuery, {} as ActivityModel);

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
      .spyOn(queriesService, "updateBatch")
      .mockResolvedValue(1);

      // act
      await service.updateBatch([{}]);

      // assert
      expect(queryServiceUpdateBatchCall).toHaveBeenNthCalledWith(1, MockModel, [{}]);
    });
  });
});