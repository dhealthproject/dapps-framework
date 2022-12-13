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
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { AccountSessionDocument, AccountSessionModel, AccountSessionQuery } from "../../../../src/common/models/AccountSessionSchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";

describe("common/AccountSessionsService", () => {
  let service: AccountSessionsService;
  let queriesService: QueryService<AccountSessionDocument, AccountSessionModel>;
  let mockDate: Date;

  // for each AccountService test we create a testing module
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountSessionsService,
        QueryService,
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<AccountSessionsService>(AccountSessionsService);
    queriesService = module.get<QueryService<AccountSessionDocument, AccountSessionModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
    it("should use QueryService.count() method with correct query", async () => {
      // prepare
      const expectedResult = 2;
      const countMock = jest
        .spyOn(queriesService, "count")
        .mockResolvedValue(expectedResult);

      // act
      const result = await service.count(new AccountSessionQuery());

      // assert
      expect(countMock).toBeCalledWith(new AccountSessionQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("exists()", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = true;
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as AccountSessionDocument);

      // act
      const result = await service.exists(new AccountSessionQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AccountSessionQuery(), MockModel, true);
      expect(result).toEqual(expectedResult);
    });
  })

  describe("find()", () => {
    it("should use QueryService.find() method with correct query", async () => {
      // prepare
      const expectedResult = new PaginatedResultDTO(
        [{} as AccountSessionDocument],
        {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      );
      const findMock = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue(expectedResult);

      // act
      const result = await service.find(new AccountSessionQuery());

      // assert
      expect(findMock).toBeCalledWith(new AccountSessionQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findOne()", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue(expectedResult as AccountSessionDocument);

      // act
      const result = await service.findOne(new AccountSessionQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AccountSessionQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createOrUpdate()", () => {
    it("should use QueryService.createOrUpdate() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const createOrUpdateMock = jest
        .spyOn(queriesService, "createOrUpdate")
        .mockResolvedValue(expectedResult as AccountSessionDocument);
      const query = new AccountSessionQuery();
      const data = new MockModel();

      // act
      const result = await service.createOrUpdate(
        query,
        data,
      );

      // assert
      expect(createOrUpdateMock).toBeCalledWith(
        new AccountSessionQuery(),
        MockModel,
        data,
        {},
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe("updateBatch()", () => {

    // for each updateBatch() test we overwrite the
    // bulk operations functions from mongoose plugin
    let bulkMocks: any,
        finderMock: any,
        upsertMock: any;
    beforeEach(() => {
      upsertMock = { update: jest.fn() };
      finderMock = { upsert: jest.fn().mockReturnValue(upsertMock) };
      bulkMocks = {
        find: jest.fn().mockReturnValue(finderMock),
        execute: () => Promise.resolve({}),
      };

      // overwrites the internal bulk operation
      (service as any).model.collection = {
        initializeUnorderedBulkOp: () => bulkMocks,
      };
    });

    it("should call collection.initializeUnorderedBulkOp() from model", async () => {
      // prepare
      const accountDoc = new MockModel({
        address: "test-address",
        transactionsCount: 1,
      });
      (accountDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([accountDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should call finder and pass correct query by address", async () => {
      // prepare
      const accountDoc = new MockModel({
        address: "test-address",
        transactionsCount: 1,
      });
      (accountDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([accountDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should modify updatedAt field in $set routine", async () => {
      // prepare
      const accountDoc = new MockModel({
        address: "test-address",
        transactionsCount: 1,
      });
      (accountDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([accountDoc]);

      // assert
      expect(upsertMock.update).toHaveBeenCalled();
      expect(upsertMock.update).toHaveBeenCalledWith({
        $set: {
          ...(accountDoc),
          updatedAt: mockDate,
        },
      });
    });
  });
});
