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
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountDocument, AccountModel, AccountQuery } from "../../../../src/common/models/AccountSchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";

describe("common/AccountsService", () => {
  let service: AccountsService;
  let queriesService: QueryService<AccountDocument, AccountModel>;
  let mockDate: Date;

  // for each AccountService test we create a testing module
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        QueryService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    queriesService = module.get<QueryService<AccountDocument, AccountModel>>(QueryService);
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
      const result = await service.count(new AccountQuery());

      // assert
      expect(countMock).toBeCalledWith(new AccountQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("exists()", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = true;
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as AccountDocument);

      // act
      const result = await service.exists(new AccountQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AccountQuery(), MockModel, true);
      expect(result).toEqual(expectedResult);
    });
  })

  describe("find()", () => {
    it("should use QueryService.find() method with correct query", async () => {
      // prepare
      const expectedResult = new PaginatedResultDTO(
        [{} as AccountDocument],
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
      const result = await service.find(new AccountQuery());

      // assert
      expect(findMock).toBeCalledWith(new AccountQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findOne()", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue(expectedResult as AccountDocument);

      // act
      const result = await service.findOne(new AccountQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AccountQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createOrUpdate()", () => {
    it("should use QueryService.createOrUpdate() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const createOrUpdateMock = jest
        .spyOn(queriesService, "createOrUpdate")
        .mockResolvedValue(expectedResult as AccountDocument);
      const query = new AccountQuery();
      const data = new MockModel();

      // act
      const result = await service.createOrUpdate(
        query,
        data,
      );

      // assert
      expect(createOrUpdateMock).toBeCalledWith(
        new AccountQuery(),
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
    beforeEach(async () => {
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
