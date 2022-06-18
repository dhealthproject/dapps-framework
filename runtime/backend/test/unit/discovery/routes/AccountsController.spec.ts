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
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";
import { AccountsService } from "../../../../src/discovery/services/AccountsService";
import { AccountsController } from "../../../../src/discovery/routes/AccountsController";
import { AccountDTO } from "../../../../src/discovery/models/AccountDTO";
import {
  Account,
  AccountQuery,
} from "../../../../src/discovery/models/AccountSchema";

describe("discovery/AccountsController", () => {
  let controller: AccountsController;
  let accountsService: AccountsService;

  let data: any, saveFn: any, initializeUnorderedBulkOpFn: any;
  const aggregateFn = jest.fn((param) => {
    return {
      param: () => param,
      exec: () =>
        Promise.resolve([
          {
            data: [{} as AccountDTO],
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
      controllers: [AccountsController],
      providers: [
        AccountsService,
        QueryService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("test on find()", () => {
    it("should call correct method and respond with DTO", async () => {
      const expectedResult = new PaginatedResultDTO<Account>();
      expectedResult.data = [new Account()];
      expectedResult.pagination = {
        pageNumber: 1,
        pageSize: 20,
        total: 1,
      };
      const findCall = jest
        .spyOn(accountsService, "find")
        .mockResolvedValue(expectedResult);

      const mappedToDTOResult = { ...expectedResult, data: [{} as AccountDTO] };
      const result = await controller.find(new AccountQuery());
      expect(findCall).toBeCalledWith(new AccountQuery());
      expect(result).toEqual(mappedToDTOResult);
    });
  });
});
