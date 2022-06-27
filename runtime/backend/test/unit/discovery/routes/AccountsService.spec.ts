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
import { QueryService } from "../../../../src/common/services/QueryService";
import { AccountsService } from "../../../../src/discovery/services/AccountsService";
import {
  Account,
  AccountDocument,
  AccountQuery,
} from "../../../../src/discovery/models/AccountSchema";

describe("discovery/AccountsService", () => {
  let service: AccountsService;
  let queriesService: QueryService<AccountDocument>;

  let data: any, saveFn: any, initializeUnorderedBulkOpFn: any;
  const aggregateFn = jest.fn((param) => {
    return {
      param: () => param,
      exec: () =>
        Promise.resolve([
          {
            data: [new Account()],
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
    queriesService = module.get<QueryService<AccountDocument>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("find() -->", () => {
    it("should call correct method", async () => {
      const expectedResult = {
        data: [{} as AccountDocument],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      };
      const findMock = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue(expectedResult);
      const result = await service.find(new AccountQuery());
      expect(findMock).toBeCalledWith(new AccountQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("updateBatch() -->", () => {
    it("should call collection.initializeUnorderedBulkOp() from model", async () => {
      const accountDoc = {
        address: "test-address",
        transactionsCount: 1,
      } as AccountDocument;
      await service.updateBatch([accountDoc]);
      expect(initializeUnorderedBulkOpFn).toHaveBeenCalled();
    });

    it("should have correct result", async () => {
      const expectedResult: any = {};
      const result = await service.updateBatch([{} as AccountDocument]);
      expect(result).toEqual(expectedResult);
    });
  });
});
