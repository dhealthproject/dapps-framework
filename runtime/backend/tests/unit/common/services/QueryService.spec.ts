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
import { Model } from "mongoose";

// internal dependencies
import { QueryService } from "../../../../src/common/services/QueryService";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";
import { AccountDocument, AccountModel, AccountQuery } from "../../../../src/common/models/AccountSchema";
import { Queryable, QueryParameters } from "../../../../src/common/concerns/Queryable";

// Mock the query service to enable *testing* of protected
// methods such as `typecastField`.
class MockQueryService extends QueryService<AccountDocument, AccountModel> {
  public sanitizeSearchQuery(searchQuery: any): any {
    return super.sanitizeSearchQuery(searchQuery);
  }
}

/**
 * @todo extract mocks to mocks concern
 * @todo re-write tests to use **way** less `any` typings
 */
describe("common/QueryService", () => {
  let service: MockQueryService;
  let testModel: Model<any>;

  let data: any, saveFn: any, initializeUnorderedBulkOpFn: any;
  let aggregateFn = jest.fn((param) => {
    return {
      param: () => param,
      exec: () =>
        Promise.resolve([
          {
            data: [{} as AccountDocument],
            metadata: [{ total: 1 }],
          },
        ]),
    };
  });
  class MockModel {
    constructor(dto?: any) {
      data = dto;
    }
    save() {
      saveFn = jest.fn(() => data);
      return saveFn();
    }
    find() {
      return {
        exec: () => data,
      };
    }
    findOne = jest.fn();
    count = jest.fn();
    findOneAndUpdate = jest.fn();
    collection = {
      initializeUnorderedBulkOp: jest.fn(),
    };
    aggregate(param: any) {
      return aggregateFn(param);
    }
    static collection = {
      initializeUnorderedBulkOp: () => {
        initializeUnorderedBulkOpFn = jest.fn(() => {
          return {
            find: () => initializeUnorderedBulkOpFn(),
            update: () => initializeUnorderedBulkOpFn(),
            upsert: () => initializeUnorderedBulkOpFn(),
            execute: () => Promise.resolve({}),
          };
        });
        return initializeUnorderedBulkOpFn();
      },
    };
    static aggregate(param: any) {
      return aggregateFn(param);
    }
  }
  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MockQueryService],
    }).compile();

    service = module.get<MockQueryService>(MockQueryService);
    testModel = new MockModel() as any;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count() -->", () => {
    it("should return correct result", async () => {
      // prepare
      const model = new MockModel();
      const modelCountCall = jest
        .spyOn(model as any, "count")
        .mockResolvedValue(1);

      // act
      const result = await service.count({} as any, model);

      // assert
      expect(modelCountCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(1);
    });
  });

  describe("exists() -->", () => {
    it("should return correct result", async () => {
      // prepare
      const findOneCall = jest
        .spyOn((service as any), "findOne")
        .mockResolvedValue({});

      // act
      const result = await (service as any).exists();

      // assert
      expect(findOneCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });

  describe("find() -->", () => {
    it("should call aggregate() from model", async () => {
      await service.find(new AccountQuery({ id: "non-existing" } as AccountDocument), testModel);
      expect(aggregateFn).toHaveBeenCalled();
    });

    it("should have correct result", async () => {
      const expectedResult: PaginatedResultDTO<AccountDocument> = new PaginatedResultDTO(
        [{} as AccountDocument],
        {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      );
      const result = await service.find(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        testModel,
      );
      expect(result).toStrictEqual(expectedResult);
    });

    it("should type resulting entities correctly", async () => {
      const expectedResult: PaginatedResultDTO<AccountDocument> = new PaginatedResultDTO(
        [{} as AccountDocument],
        {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      );
      const result = await service.find(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        testModel,
      );
      expect(result).toStrictEqual(expectedResult);
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeDefined();
      expect(result.data.length).toStrictEqual(1);
      expect(result.data[0]).toBeDefined();
    });

    it("should have correct result when data is empty", async () => {
      const expectedResult: PaginatedResultDTO<AccountDocument> = new PaginatedResultDTO(
        [],
        {
          pageNumber: 1,
          pageSize: 20,
          total: 0,
        },
      );
      aggregateFn = jest.fn((param) => {
        return {
          param: () => param,
          exec: () =>
            Promise.resolve([
              {
                data: [], // <-- WARNING: empties the data array
                metadata: [],
              },
            ]),
        };
      });
      const result = await service.find(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        testModel,
      );
      expect(result).toStrictEqual(expectedResult);
    });

// CAUTION
// intermitent testing bug because of above in-test overwrite of `aggregateFn`.
// @todo This should use the `jest.fn`'s process to *reset* a stub in the beforeEach().
// CAUTION
    aggregateFn = jest.fn((param) => {
      return {
        param: () => param,
        exec: () =>
          Promise.resolve([
            {
              data: [{} as AccountDocument],
              metadata: [{ total: 1 }],
            },
          ]),
      };
    })

    it("should have correct sort: address", async () => {
      await service.find(
        new AccountQuery(
          { id: "non-existing" } as AccountDocument,
          { sort: "address" } as QueryParameters,
        ),
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing" } },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { address: 1 } }],
            metadata: [{ $count: "total" }],
          },
        },
      ]);
    });

    it("should have correct order: asc", async () => {
      await service.find(new AccountQuery({ id: "non-existing" } as AccountDocument), testModel);
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing" } },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
            metadata: [{ $count: "total" }],
          },
        },
      ]);
    });

    it("should have correct order: desc", async () => {
      await service.find(
        new AccountQuery(
          { id: "non-existing" } as AccountDocument,
          { order: "desc" } as QueryParameters,
        ),
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing" } },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: -1 } }],
            metadata: [{ $count: "total" }],
          },
        },
      ]);
    });

    it("should permit overwrite of pageNumber and pageSize", async () => {
      await service.find(
        new AccountQuery(
          { id: "non-existing" } as AccountDocument,
          { pageNumber: 2, pageSize: 17 } as QueryParameters,
        ),
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing" } },
        {
          $facet: {
            data: [{ $skip: 17 }, { $limit: 17 }, { $sort: { _id: 1 } }],
            metadata: [{ $count: "total" }],
          },
        },
      ]);
    });
  });

  describe("findOne() -->", () => {
    it("should return correct result when stripDocument is true", async () => {
      // prepare
      const model = new MockModel();
      const mongoQueryLeanCall = jest.fn().mockResolvedValue({});
      const mongoQuerySelectCall = jest
        .fn().mockReturnValue({
          lean: mongoQueryLeanCall,
        });
      const findOneCall = jest
        .spyOn(model as any, "findOne")
        .mockReturnValue({
          select: mongoQuerySelectCall,
        });

      // act
      const result = await service.findOne(
        {} as any,
        model,
        true
      );

      // assert
      expect(findOneCall).toHaveBeenCalledTimes(1);
      expect(mongoQuerySelectCall).toHaveBeenCalledTimes(1);
      expect(mongoQueryLeanCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({});
    });

    it("should return correct result when stripDocument is false", async () => {
      // prepare
      const model = new MockModel();
      const mongoQueryExecCall = jest.fn().mockResolvedValue({});
      const findOneCall = jest
        .spyOn(model as any, "findOne")
        .mockReturnValue({
          exec: mongoQueryExecCall,
        });

      // act
      const result = await service.findOne(
        {} as any,
        model,
      );

      // assert
      expect(findOneCall).toHaveBeenCalledTimes(1);
      expect(mongoQueryExecCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({});
    });
  });

  describe("createOrUpdate() -->", () => {
    it("should return correct result", async () => {
      // prepare
      const model = new MockModel();
      const getQueryConfigCall = jest
        .spyOn((service as any), "getQueryConfig")
        .mockReturnValue({
          searchQuery: {
            sort: "_id",
            order: "asc",
            pageNumber: 1,
            pageSize: 20,
            updateQuery: {},
          },
        });
      const execCall = jest.fn().mockResolvedValue(true);
      const mockModelfindOneAndUpdateCall = jest
        .spyOn(model as any, "findOneAndUpdate")
        .mockReturnValue({
          exec: execCall,
        });

      // act
      await service.createOrUpdate(
        {} as Queryable<AccountDocument>,
        model,
        {},
      );

      // assert
      expect(getQueryConfigCall).toHaveBeenCalledTimes(1);
      expect(mockModelfindOneAndUpdateCall).toHaveBeenCalledTimes(1);
      expect(execCall).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateBatch() -->", () => {
    it("should return 0 if update was not successful", async () => {
      // prepare
      const model = new MockModel();
      const executeCall = jest.fn().mockResolvedValue(undefined);
      const updateCall = jest.fn().mockReturnValue({});
      const upsertCall = jest.fn().mockReturnValue({
        update: updateCall
      });
      const findCall = jest.fn().mockReturnValue({
        upsert: upsertCall
      });
      const mockModelInitializeUnorderedBulkOpCall = jest
        .spyOn(model.collection, "initializeUnorderedBulkOp")
        .mockReturnValue({
          find: findCall,
          execute: executeCall
        });

      // act
      const result = await service.updateBatch(
        model,
        [{} as AccountDocument]
      );

      // assert
      expect(mockModelInitializeUnorderedBulkOpCall).toHaveBeenCalledTimes(1);
      expect(findCall).toHaveBeenCalledTimes(1);
      expect(upsertCall).toHaveBeenCalledTimes(1);
      expect(updateCall).toHaveBeenCalledTimes(1);
      expect(executeCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(0);
    });

    it("should return sum of nInserted, nModified and nUpserted", async () => {
      // prepare
      const model = new MockModel();
      const updateCall = jest.fn().mockReturnValue({});
      const upsertCall = jest.fn().mockReturnValue({
        update: updateCall
      });
      const findCall = jest.fn().mockReturnValue({
        upsert: upsertCall
      });
      const executeCall = jest.fn().mockResolvedValue({
        nInserted: 1,
        nModified: 3,
        nUpserted: 3
      });
      const mockModelInitializeUnorderedBulkOpCall = jest
        .spyOn(model.collection, "initializeUnorderedBulkOp")
        .mockReturnValue({
          find: findCall,
          execute: executeCall
        });

      // act
      const result = await service.updateBatch(
        model,
        [{} as AccountDocument]
      );

      // assert
      expect(mockModelInitializeUnorderedBulkOpCall).toHaveBeenCalledTimes(1);
      expect(findCall).toHaveBeenCalledTimes(1);
      expect(upsertCall).toHaveBeenCalledTimes(1);
      expect(updateCall).toHaveBeenCalledTimes(1);
      expect(executeCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(7);
    });
  });

  describe("sanitizeSearchQuery() -->", () => {
    it("should bypass fields that are undefined", () => {
      // prepare
      const typecastFieldCall = jest
        .spyOn((service as any), "typecastField")
        .mockReturnValue(true);

      // act
      const result = service.sanitizeSearchQuery({
        field1: true,
        field2: undefined,
        field3: true,
      });

      // assert
      expect(typecastFieldCall).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual({
        field1: true,
        field3: true,
      })
    });
  });

  describe("typecastField() -->", () => {
    it("should return correct result", () => {
      const testInput = {
        testString: "abc",
        testNumber: "123",
        testBoolean: "true",
        testArray: [["abc", "2"], ["true"]],
        testEmptyInnerArray: [[]] as any[],
      };
      const result = service.sanitizeSearchQuery(testInput);
      expect(result).toStrictEqual({
        testString: "abc",
        testNumber: { $in: [123, "123"] },
        testBoolean: true,
        testArray: { $in: ["abc", 2, "2", true] },
        testEmptyInnerArray: { $in: [] },
      });
    });
  });
});
