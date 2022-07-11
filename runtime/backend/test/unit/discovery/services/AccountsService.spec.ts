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
import { AccountsService } from "../../../../src/discovery/services/AccountsService";
import { Account, AccountModel, AccountQuery } from "../../../../src/discovery/models/AccountSchema";

describe("discovery/AccountsService", () => {
  let service: AccountsService;
  let queriesService: QueryService<Account, AccountModel>;
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
    queriesService = module.get<QueryService<Account, AccountModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("find() -->", () => {
    it("should use QueryService.find() method with correct query", async () => {
      // prepare
      const expectedResult = {
        data: [{} as Account],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      };
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

  describe("updateBatch() -->", () => {

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
      (accountDoc as any).toDocument = accountDoc.data;

      // act
      await service.updateBatch([accountDoc]);

      // assert
      expect(upsertMock.update).toHaveBeenCalled();
      expect(upsertMock.update).toHaveBeenCalledWith({
        $set: {
          ...(accountDoc.data),
          updatedAt: mockDate,
        },
      });
    });
  });

  // @todo Missing tests for method `AccountsService.findOne()`
  // @todo Missing tests for method `AccountsService.updateOne()`
});
