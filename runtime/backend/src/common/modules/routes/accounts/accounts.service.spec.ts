/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountDTO } from '../../../../common/models';
import { QueriesService } from '../../services/queries/queries.service';
import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  let service: AccountsService;
  let queriesService: QueriesService;

  let data, saveFn, initializeUnorderedBulkOpFn;
  const aggregateFn = jest.fn((param) => {
    return {
      param: () => param,
      exec: () =>
        Promise.resolve([
          {
            data: [{}],
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
    static aggregate(param) {
      return aggregateFn(param);
    }
  }
  let mockDate: Date;

  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        QueriesService,
        {
          provide: getModelToken('Account'),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    queriesService = module.get<QueriesService>(QueriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test on find()', () => {
    it('should call correct method', async () => {
      const expectedQuery = {};
      const expectedResult = {
        data: [{}],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      };
      const findMock = jest
        .spyOn(queriesService, 'find')
        .mockResolvedValue(expectedResult);
      const result = await service.find(expectedQuery);
      expect(findMock).toBeCalledWith({}, MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('test on updateBatch()', () => {
    it('should call collection.initializeUnorderedBulkOp() from model', async () => {
      const updateAccountDtos = {
        address: 'test-address',
      };
      await service.updateBatch([updateAccountDtos]);
      expect(initializeUnorderedBulkOpFn).toHaveBeenCalled();
    });

    it('should have correct result', async () => {
      const expectedResult: any = {};
      const result = await service.updateBatch([new AccountDTO()]);
      expect(result).toEqual(expectedResult);
    });
  });
});
