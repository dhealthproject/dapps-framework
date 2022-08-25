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
import { QueryParameters } from "@/common/concerns/Queryable";

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

    it("should have correct result when metadata is empty", async () => {
      const expectedResult: PaginatedResultDTO<AccountDocument> = new PaginatedResultDTO(
        [{} as AccountDocument],
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

  describe("typecastField() -->", () => {
    it("should return correct result", () => {
      const testInput = {
        testString: "abc",
        testNumber: "123",
        testBoolean: "true",
        testArray: ["abc", "2", "true"],
      };
      const result = service.sanitizeSearchQuery(testInput);
      expect(result).toStrictEqual({
        testString: "abc",
        testNumber: { $in: [123, "123"] },
        testBoolean: true,
        testArray: { $in: ["abc", 2, "2", true] },
      });
    });
  });

  //@todo Write tests for getQueryConfig()
  //@todo Write tests for sanitizeSearchQuery()
  //@todo Write tests for exists()
  //@todo Write tests for count()
  //@todo Write tests for findOne()
  //@todo Write tests for createOrUpdate()
  //@todo Write tests for updateBatch()
});
