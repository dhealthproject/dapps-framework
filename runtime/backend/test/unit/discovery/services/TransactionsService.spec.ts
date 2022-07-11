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
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
import { Transaction, TransactionModel, TransactionQuery } from "../../../../src/discovery/models/TransactionSchema";

describe("discovery/TransactionsService", () => {
  let service: TransactionsService;
  let queriesService: QueryService<Transaction, TransactionModel>;
  let mockDate: Date;

  // for each AccountService test we create a testing module
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        QueryService,
        {
          provide: getModelToken("Transaction"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    queriesService = module.get<QueryService<Transaction, TransactionModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("find() -->", () => {
    it("should use QueryService.find() method with correct query", async () => {
      // prepare
      const expectedResult = {
        data: [{} as Transaction],
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
      const result = await service.find(new TransactionQuery());

      // assert
      expect(findMock).toBeCalledWith(new TransactionQuery(), MockModel);
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
      const transactionDoc = new MockModel({
        signerAddress: "test-address",
        transactionHash: "fakeHash1",
      });
      (transactionDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([transactionDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should call finder and pass correct query by signer and hash", async () => {
      // prepare
      const transactionDoc = new MockModel({
        signerAddress: "test-address",
        transactionHash: "fakeHash1",
      });
      (transactionDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([transactionDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should modify updatedAt field in $set routine", async () => {
      // prepare
      const transactionDoc = new MockModel({
        signerAddress: "test-address",
        transactionHash: "fakeHash1",
      });
      (transactionDoc as any).toQuery = jest.fn();
      (transactionDoc as any).toDocument = transactionDoc.data;

      // act
      await service.updateBatch([transactionDoc]);

      // assert
      expect(upsertMock.update).toHaveBeenCalled();
      expect(upsertMock.update).toHaveBeenCalledWith({
        $set: {
          ...(transactionDoc.data),
          updatedAt: mockDate,
        },
      });
    });
  });

  // @todo Missing tests for method `TransactionsService.findOne()`
  // @todo Missing tests for method `TransactionsService.updateOne()`
});
