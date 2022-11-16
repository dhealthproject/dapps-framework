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
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

// internal dependencies
import { StatisticsService } from '../../../../src/statistics/services/StatisticsService';
import { MockModel } from '../../../mocks/global';
import { StatisticsDocument, StatisticsModel, StatisticsQuery } from '../../../../src/statistics/models/StatisticsSchema';
import { QueryService } from '../../../../src/common/services/QueryService';
import { PaginatedResultDTO } from '../../../../src/common/models/PaginatedResultDTO';

describe('statistics/StatisticsService', () => {
  let service: StatisticsService;
  let queryService: QueryService<
    StatisticsDocument,
    StatisticsModel
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        QueryService,
        {
          provide: getModelToken("Statistics"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    queryService = module.get<QueryService<StatisticsDocument, StatisticsModel>>(QueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
    it("should call count() from queryService", async () => {
      // prepare
      const queryServiceCountCall = jest
        .spyOn(queryService, "count")
        .mockResolvedValue(1);

      // act
      await service.count({} as StatisticsQuery);

      // assert
      expect(queryServiceCountCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("exists()", () => {
    it("should return correct result", async () => {
      // prepare
      const queryServiceFindOneCall = jest
        .spyOn(queryService, "findOne")
        .mockResolvedValue({} as StatisticsDocument);

      // act
      const result = await service.exists({} as StatisticsQuery);

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
        .mockResolvedValue({} as PaginatedResultDTO<StatisticsDocument>);

      // act
      await service.find({} as StatisticsQuery);

      // assert
      expect(queryServiceFindCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });

    it("should return correct result", async () => {
      // prepare
      const findCall = jest
        .spyOn(queryService, "find")
        .mockResolvedValue({} as PaginatedResultDTO<StatisticsDocument>);
      const statisticsQuery = new StatisticsQuery();

      // act
      const result = await service.find(
        new StatisticsQuery(),
      );

      // assert
      expect(findCall).toHaveBeenNthCalledWith(1, statisticsQuery, MockModel);
      expect(result).toStrictEqual({});
    });
  });

  describe("findOne()", () => {
    it("should call findOne() from queryService", async () => {
      // prepare
      const queryServiceFindOneCall = jest
      .spyOn(queryService, "findOne")
      .mockResolvedValue({} as StatisticsDocument);

      // act
      await service.findOne({} as StatisticsQuery);

      // assert
      expect(queryServiceFindOneCall).toHaveBeenNthCalledWith(1, {}, MockModel);
    });
  });

  describe("createOrUpdate()", () => {
    it("should call createOrUpdate() from queryService", async () => {
      // prepare
      const queryServiceCreateOrUpdateCall = jest
      .spyOn(queryService, "createOrUpdate")
      .mockResolvedValue({} as StatisticsDocument);

      // act
      await service.createOrUpdate({} as StatisticsQuery, {} as StatisticsModel);

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
