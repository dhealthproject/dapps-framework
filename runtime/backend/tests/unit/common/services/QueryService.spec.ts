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
import { Documentable } from "../../../../src/common/concerns/Documentable";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";
import {
  Queryable,
  QueryParameters,
} from "../../../../src/common/concerns/Queryable";
import {
  AccountDocument,
  AccountModel,
  AccountQuery,
} from "../../../../src/common/models/AccountSchema";
import {
  StateDocument,
  StateQuery,
} from "../../../../src/common/models/StateSchema";
import {
  MongoPipelineFacet,
  MongoQueryPipeline,
  MongoQueryUnion,
  MongoRoutineCount,
} from "../../../../src/common/types";

// Mock the query service to enable *testing* of protected
// methods such as `sanitizeSearchQuery` and `getAggregateFindQuery`
class MockQueryService extends QueryService<AccountDocument, AccountModel> {
  public sanitizeSearchQuery(searchQuery: any): any {
    return super.sanitizeSearchQuery(searchQuery);
  }

  public getAggregateFindQuery<
    T2ndDocument extends Documentable & { collectionName: string },
    T3rdDocument extends Documentable & { collectionName: string } = any,
    T4thDocument extends Documentable & { collectionName: string } = any,
  >(
    query: Queryable<AccountDocument>,
    unionWith?: Map<
      string,
      Queryable<T2ndDocument | T3rdDocument | T4thDocument>
    >,
    metadata?: MongoRoutineCount[],
  ): MongoQueryPipeline {
    return super.getAggregateFindQuery(query, unionWith, metadata);
  }
}

// Mock the *aggregate()* model function so that it returns
// different types of query results, e.g. an empty result set,
// a populated result set and a combined result set
let baseAggregateFn = jest.fn((param) => {
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

let emptyAggregateFn = jest.fn((param) => {
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

let mixinAggregateFn = jest.fn((param) => {
  return {
    param: () => param,
    exec: () =>
      Promise.resolve([
        {
          data: [
            {
              address: "fake-address1",
              name: "fake-state",
            } as AccountDocument & StateDocument,
          ],
          metadata: [{ total: 1 }],
        },
      ]),
  };
});

/**
 * @todo extract mocks to mocks concern
 * @todo re-write tests to use **way** less `any` typings
 */
describe("common/QueryService", () => {
  let service: MockQueryService;
  let testModel: Model<any>;

  let data: any, saveFn: any, initializeUnorderedBulkOpFn: any;

  // CAUTION [INIT]
  // initializing aggregateFn with a single-document
  let aggregateFn = baseAggregateFn;

  // @todo this class must be removed, and use MockModel
  // @todo MockModel class exported in global mocks
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
    deleteOne(query: any) {
      return {
        exec: async () => jest.fn(),
      };
    }
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

    aggregateFn.mockClear();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
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

  describe("exists()", () => {
    it("should return correct result", async () => {
      // prepare
      const findOneCall = jest
        .spyOn(service as any, "findOne")
        .mockResolvedValue({});

      // act
      const result = await (service as any).exists();

      // assert
      expect(findOneCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });

  describe("findWithTotal()", () => {
    beforeEach(() => {
      aggregateFn = baseAggregateFn;
      aggregateFn.mockClear();
    });

    it("should call aggregate() from model", async () => {
      await service.findWithTotal(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalled();
    });

    it("should have correct result", async () => {
      const expectedResult: PaginatedResultDTO<AccountDocument> =
        new PaginatedResultDTO([{} as AccountDocument], {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        });
      const result = await service.findWithTotal(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        testModel,
      );
      expect(result).toStrictEqual(expectedResult);
    });

    it("should type resulting entities correctly", async () => {
      const expectedResult: PaginatedResultDTO<AccountDocument> =
        new PaginatedResultDTO([{} as AccountDocument], {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        });
      const result = await service.findWithTotal(
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
      // prepare
      const expectedResult: PaginatedResultDTO<AccountDocument> =
        new PaginatedResultDTO([], {
          pageNumber: 1,
          pageSize: 20,
          total: 0,
        });

      // overwrites the aggregate() mock to return empty result set
      aggregateFn = emptyAggregateFn;

      // act
      const result = await service.findWithTotal(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        testModel,
      );

      // assert
      expect(result).toStrictEqual(expectedResult);
    });

    it("should have correct sort: address", async () => {
      await service.findWithTotal(
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
      await service.findWithTotal(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        testModel,
      );
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
      await service.findWithTotal(
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
      await service.findWithTotal(
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

    it("should add operations to query", async () => {
      // act
      await service.findWithTotal(
        new AccountQuery(
          { id: "non-existing" } as AccountDocument,
          { pageNumber: 2, pageSize: 17 } as QueryParameters,
        ),
        testModel,
        { $exists: { $eq: "a" } },
      );

      // assert
      expect(aggregateFn).toHaveBeenCalledWith([
        { $eq: "a" },
        {
          $facet: {
            data: [{ $skip: 17 }, { $limit: 17 }, { $sort: { _id: 1 } }],
            metadata: [{ $count: "total" }],
          },
        },
      ]);
    });
  });

  describe("findOne()", () => {
    it("should return correct result when stripDocument is true", async () => {
      // prepare
      const model = new MockModel();
      const mongoQueryLeanCall = jest.fn().mockResolvedValue({});
      const mongoQuerySelectCall = jest.fn().mockReturnValue({
        lean: mongoQueryLeanCall,
      });
      const findOneCall = jest.spyOn(model as any, "findOne").mockReturnValue({
        select: mongoQuerySelectCall,
      });

      // act
      const result = await service.findOne({} as any, model, true);

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
      const findOneCall = jest.spyOn(model as any, "findOne").mockReturnValue({
        exec: mongoQueryExecCall,
      });

      // act
      const result = await service.findOne({} as any, model);

      // assert
      expect(findOneCall).toHaveBeenCalledTimes(1);
      expect(mongoQueryExecCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({});
    });
  });

  describe("createOrUpdate()", () => {
    it("should return correct result", async () => {
      // prepare
      const model = new MockModel();
      const getQueryConfigCall = jest
        .spyOn(service as any, "getQueryConfig")
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
      await service.createOrUpdate({} as Queryable<AccountDocument>, model, {});

      // assert
      expect(getQueryConfigCall).toHaveBeenCalledTimes(1);
      expect(mockModelfindOneAndUpdateCall).toHaveBeenCalledTimes(1);
      expect(execCall).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteOne", () => {
    it("should delete entry", async () => {
      const mockDeleteCall = jest.fn().mockReturnValue({ exec: async () => jest.fn() });
      const model = new MockModel("a");
      (model as any).deleteOne = mockDeleteCall;

      await service.deleteOne({ findOneAndRemove: jest.fn() } as any, model);

      expect(mockDeleteCall).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateBatch()", () => {
    it("should return 0 if update was not successful", async () => {
      // prepare
      const model = new MockModel();
      const executeCall = jest.fn().mockResolvedValue(undefined);
      const updateCall = jest.fn().mockReturnValue({});
      const upsertCall = jest.fn().mockReturnValue({
        update: updateCall,
      });
      const findCall = jest.fn().mockReturnValue({
        upsert: upsertCall,
      });
      const mockModelInitializeUnorderedBulkOpCall = jest
        .spyOn(model.collection, "initializeUnorderedBulkOp")
        .mockReturnValue({
          find: findCall,
          execute: executeCall,
        });

      // act
      const result = await service.updateBatch(model, [{} as AccountDocument]);

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
        update: updateCall,
      });
      const findCall = jest.fn().mockReturnValue({
        upsert: upsertCall,
      });
      const executeCall = jest.fn().mockResolvedValue({
        nInserted: 1,
        nModified: 3,
        nUpserted: 3,
      });
      const mockModelInitializeUnorderedBulkOpCall = jest
        .spyOn(model.collection, "initializeUnorderedBulkOp")
        .mockReturnValue({
          find: findCall,
          execute: executeCall,
        });

      // act
      const result = await service.updateBatch(model, [{} as AccountDocument]);

      // assert
      expect(mockModelInitializeUnorderedBulkOpCall).toHaveBeenCalledTimes(1);
      expect(findCall).toHaveBeenCalledTimes(1);
      expect(upsertCall).toHaveBeenCalledTimes(1);
      expect(updateCall).toHaveBeenCalledTimes(1);
      expect(executeCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(7);
    });
  });

  describe("union()", () => {
    let fakeGroup1: [string, Queryable<any>],
      fakeGroup2: [string, Queryable<any>],
      fakeGroup3: [string, Queryable<any>];
    beforeEach(() => {
      fakeGroup1 = [
        "fake-group1",
        new AccountQuery({
          id: "non-existing1",
          address: "fake-address1",
          collectionName: "fake-collection1",
        } as AccountDocument),
      ];
      fakeGroup2 = [
        "fake-group2",
        new AccountQuery({
          id: "non-existing2",
          address: "fake-address2",
          collectionName: "fake-collection2",
        } as AccountDocument),
      ];
      fakeGroup3 = [
        "fake-group3",
        new StateQuery({
          id: "non-existing3",
          name: "fake-state",
          collectionName: "fake-collection3",
        } as StateDocument),
      ];

      aggregateFn = mixinAggregateFn;
      aggregateFn.mockClear();
    });

    it("should create correct spec and no metadata by default", async () => {
      // prepare
      aggregateFn = jest.fn((param) => {
        return {
          param: () => param,
          exec: () =>
            Promise.resolve([
              {
                data: [],
                metadata: [],
              },
            ]),
        };
      });

      // act
      await service.union<StateDocument>(
        new AccountQuery({ id: "non-existing1" } as AccountDocument),
        testModel,
        new Map([fakeGroup3]),
        undefined,
      );

      // assert
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing1" } }, // fake query (not tested here)
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
          },
        },
        {
          $unionWith: {
            coll: "fake-collection3",
            pipeline: [
              { $match: { id: "non-existing3", name: "fake-state" } }, // fakeGroup3 (L503)
              {
                $facet: {
                  // default "main document pagination"
                  data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
                },
              },
              { $group: { _id: "fake-group3" } }, // fakeGroup3 (L503)
            ],
          },
        },
      ]);
    });

    it("should add $facet metadata spec given metadata parameter", async () => {
      // act
      await service.union<StateDocument>(
        new AccountQuery({ id: "non-existing1" } as AccountDocument),
        testModel,
        new Map([fakeGroup3]),
        [{ $count: "total" }],
      );

      // assert
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing1" } }, // fake query (not tested here)
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
            metadata: [{ $count: "total" }],
          },
        },
        {
          $unionWith: {
            coll: "fake-collection3",
            pipeline: [
              { $match: { id: "non-existing3", name: "fake-state" } },
              {
                $facet: {
                  // default "main document pagination"
                  data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
                },
              },
              { $group: { _id: "fake-group3" } }, // fakeGroup3 (L503)
            ],
          },
        },
      ]);
    });

    it("should create a correctly typed combination of documents", async () => {
      // prepare
      type TResultDocument = AccountDocument & StateDocument;

      // act
      const result: PaginatedResultDTO<TResultDocument> =
        await service.union<StateDocument>(
          new AccountQuery({ id: "non-existing" } as AccountDocument),
          testModel,
          new Map([fakeGroup3]),
          undefined,
        );

      // assert
      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(1); // fake content from mock
      expect("address" in result.data[0]).toBe(true); // L518
      expect("name" in result.data[0]).toBe(true); // L518
      expect(result.data[0].address).toBe("fake-address1");
      expect(result.data[0].name).toBe("fake-state");
    });

    it("should use default query cursor given no cursor", async () => {
      // prepare
      type TResultDocument = AccountDocument & StateDocument;

      // act
      const result: PaginatedResultDTO<TResultDocument> =
        await service.union<StateDocument>(
          new AccountQuery({ id: "non-existing1" } as AccountDocument),
          testModel,
          new Map([fakeGroup3]),
          undefined,
        );

      // assert
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing1" } }, // fake query (not tested here)
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
          },
        },
        {
          $unionWith: {
            coll: "fake-collection3",
            pipeline: [
              { $match: { id: "non-existing3", name: "fake-state" } }, // fakeGroup3 (L503)
              {
                $facet: {
                  // default "main document pagination"
                  data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
                },
              },
              { $group: { _id: "fake-group3" } }, // fakeGroup3 (L503)
            ],
          },
        },
      ]);

      expect(result.pagination).toBeDefined();
      expect("pageNumber" in result.pagination).toBe(true);
      expect("pageSize" in result.pagination).toBe(true);
      expect(result.pagination.pageNumber).toBe(1);
      expect(result.pagination.pageSize).toBe(20);
    });

    it("should permit query cursor overwrite given query", async () => {
      // prepare
      type TResultDocument = AccountDocument & StateDocument;

      // act
      const result: PaginatedResultDTO<TResultDocument> =
        await service.union<StateDocument>(
          new AccountQuery({ id: "non-existing1" } as AccountDocument, {
            pageSize: 100,
            pageNumber: 5,
            sort: "address",
            order: "desc",
          }),
          testModel,
          new Map([fakeGroup3]),
          undefined,
        );

      // assert
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing1" } }, // fake query (not tested here)
        {
          $facet: {
            data: [{ $skip: 400 }, { $limit: 100 }, { $sort: { address: -1 } }],
          },
        },
        {
          $unionWith: {
            coll: "fake-collection3",
            pipeline: [
              { $match: { id: "non-existing3", name: "fake-state" } }, // fakeGroup3 (L503)
              {
                $facet: {
                  // default "main document pagination"
                  data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
                },
              },
              { $group: { _id: "fake-group3" } }, // fakeGroup3 (L503)
            ],
          },
        },
      ]);

      expect(result.pagination).toBeDefined();
      expect("pageNumber" in result.pagination).toBe(true);
      expect("pageSize" in result.pagination).toBe(true);
      expect(result.pagination.pageNumber).toBe(5); // L683
      expect(result.pagination.pageSize).toBe(100); // L683
    });

    it("should use default query cursor for union group given no cursor", async () => {
      // prepare
      type TResultDocument = AccountDocument & StateDocument;

      // act
      const result: PaginatedResultDTO<TResultDocument> =
        await service.union<StateDocument>(
          new AccountQuery({ id: "non-existing1" } as AccountDocument),
          testModel,
          new Map([fakeGroup3]),
          undefined,
        );

      // assert
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing1" } }, // fake query (not tested here)
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
          },
        },
        {
          $unionWith: {
            coll: "fake-collection3",
            pipeline: [
              { $match: { id: "non-existing3", name: "fake-state" } }, // fakeGroup3 (L503)
              {
                $facet: {
                  data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
                },
              },
              { $group: { _id: "fake-group3" } }, // fakeGroup3 (L503)
            ],
          },
        },
      ]);
    });

    it("should permit query cursor overwrite for union groups", async () => {
      // prepare
      type TResultDocument = AccountDocument & StateDocument;
      const fakeGroup4: [string, Queryable<any>] = [
        "fake-group4",
        new AccountQuery(
          {
            id: "non-existing4",
            address: "fake-address4",
            collectionName: "fake-collection4",
          } as AccountDocument,
          { pageSize: 100, pageNumber: 5, sort: "address", order: "desc" },
        ),
      ];

      // act
      const result: PaginatedResultDTO<TResultDocument> =
        await service.union<StateDocument>(
          new AccountQuery({ id: "non-existing1" } as AccountDocument), // default query cursor
          testModel,
          new Map([fakeGroup4]),
          undefined,
        );

      // assert
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: "non-existing1" } }, // fake query (not tested here)
        {
          $facet: {
            // default "main document pagination"
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
          },
        },
        {
          $unionWith: {
            coll: "fake-collection4", // L787
            pipeline: [
              { $match: { id: "non-existing4", address: "fake-address4" } }, // fakeGroup3 (L503)
              {
                $facet: {
                  // custom union pagination and sort
                  data: [
                    { $skip: 400 },
                    { $limit: 100 },
                    { $sort: { address: -1 } },
                  ],
                },
              }, // fakeGroup4 (L758)
              { $group: { _id: "fake-group4" } }, // fakeGroup3 (L503)
            ],
          },
        },
      ]);

      expect(result.pagination).toBeDefined();
      expect("pageNumber" in result.pagination).toBe(true);
      expect("pageSize" in result.pagination).toBe(true);
      expect(result.pagination.pageNumber).toBe(1); // default main navigation
      expect(result.pagination.pageSize).toBe(20); // default main navigation
    });
  });

  describe("aggregate()", () => {
    it("should call aggregate() from model", async () => {
      await service.aggregate([], testModel);
      expect(aggregateFn).toHaveBeenCalled();
    });
  });

  describe("sanitizeSearchQuery()", () => {
    it("should bypass fields that are undefined", () => {
      // prepare
      const typecastFieldCall = jest
        .spyOn(service as any, "typecastField")
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
      });
    });
  });

  describe("typecastField()", () => {
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

  describe("getAggregateFindQuery()", () => {
    let fakeGroup1: [string, Queryable<any>],
      fakeGroup2: [string, Queryable<any>];
    beforeEach(() => {
      fakeGroup1 = [
        "fake-group1",
        new AccountQuery({
          id: "non-existing1",
          collectionName: "fake-collection1",
        } as AccountDocument),
      ];
      fakeGroup2 = [
        "fake-group2",
        new AccountQuery({
          id: "non-existing2",
          collectionName: "fake-collection2",
        } as AccountDocument),
      ];
    });

    it("should always contain $match and $facet", () => {
      // act
      const query: MongoQueryPipeline = service.getAggregateFindQuery(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        undefined,
        undefined,
      );

      // assert
      expect(query.length).toBe(2);
      expect("$match" in query[0]).toBe(true); // match always first
      expect("$facet" in query[1]).toBe(true); // facet always second
    });

    it("should not contain metadata by default", () => {
      // act
      const query: MongoQueryPipeline = service.getAggregateFindQuery(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        undefined,
        undefined,
      );

      // assert
      expect(query.length).toBe(2);
      expect("$facet" in query[1]).toBe(true); // facet always second
      expect("metadata" in query[1]).toBe(false); // metadata part of facet
    });

    it("should contain total metadata given metadata", () => {
      // act
      const query: MongoQueryPipeline = service.getAggregateFindQuery(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        undefined,
        [{ $count: "total" }],
      );

      // assert
      expect(query.length).toBe(2);
      expect("$facet" in query[1]).toBe(true); // facet always second

      const facetStage = query[1] as MongoPipelineFacet; // shortcut
      expect(facetStage.$facet).toBeDefined();
      expect("metadata" in facetStage.$facet).toBe(true); // metadata part of facet
      expect(facetStage.$facet.metadata).toBeDefined();
      expect(facetStage.$facet.metadata.length).toBe(1);
    });

    it("should contain union queries given union specification", () => {
      // act
      const query: MongoQueryPipeline = service.getAggregateFindQuery(
        new AccountQuery({ id: "non-existing" } as AccountDocument),
        new Map([fakeGroup1, fakeGroup2]),
        undefined,
      );

      // assert
      expect(query.length).toBe(4); // match + facet + 2 union groups
      expect("$unionWith" in query[2]).toBe(true); // union always third
      expect("$unionWith" in query[3]).toBe(true); // union also in fourth

      const unionStage1 = query[2] as MongoQueryUnion; // shortcut
      const unionStage2 = query[3] as MongoQueryUnion; // shortcut
      expect(unionStage1.$unionWith).toBeDefined();
      expect(unionStage2.$unionWith).toBeDefined();

      [unionStage1, unionStage2].forEach((stage) => {
        expect("coll" in stage.$unionWith).toBe(true);
        expect("pipeline" in stage.$unionWith).toBe(true);
        expect(stage.$unionWith.pipeline).toBeDefined();
        expect(stage.$unionWith.pipeline.length).toBe(3); // match + union
        expect("$group" in stage.$unionWith.pipeline[2]).toBe(true); // group always second
      });
    });

    it("should contain correct groups and collection given union", () => {
      // act
      const query: MongoQueryPipeline = service.getAggregateFindQuery(
        new AccountQuery({
          id: "non-existing0",
          collectionName: "fake-collection0",
        } as AccountDocument),
        new Map([fakeGroup1, fakeGroup2]),
        undefined,
      );

      // assert
      expect(query.length).toBe(4); // match + facet + 2 union groups

      // shortcuts
      type TStageSpec = {
        coll: string;
        group: string;
        union: MongoQueryUnion;
      };
      const stagesSpecification: TStageSpec[] = [
        {
          coll: "fake-collection1",
          group: "fake-group1",
          union: query[2] as MongoQueryUnion,
        },
        {
          coll: "fake-collection2",
          group: "fake-group2",
          union: query[3] as MongoQueryUnion,
        },
      ];

      // assert
      stagesSpecification.forEach((stageSpec: TStageSpec) => {
        expect("coll" in stageSpec.union.$unionWith).toBe(true);
        expect("pipeline" in stageSpec.union.$unionWith).toBe(true);
        expect(stageSpec.union.$unionWith.pipeline).toBeDefined();
        expect(stageSpec.union.$unionWith.pipeline.length).toBe(3); // match + union
        expect(stageSpec.union.$unionWith.coll).toBe(stageSpec.coll); // uses Account class
        expect("$group" in stageSpec.union.$unionWith.pipeline[2]).toBe(true); // group always third
        expect(
          "_id" in (stageSpec.union.$unionWith.pipeline[2] as any).$group,
        ).toBe(true);
        expect((stageSpec.union.$unionWith.pipeline[2] as any).$group._id).toBe(
          stageSpec.group,
        );
      });
    });
  });
});
