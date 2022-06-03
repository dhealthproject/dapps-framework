/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Account, AccountQueryDTO, PaginatedResutDto } from '../../../models';
import { QueriesService } from './queries.service';

describe('QueriesService', () => {
  let service: QueriesService;
  let testModel: Model<any>;

  let data, saveFn, initializeUnorderedBulkOpFn;
  let aggregateFn = jest.fn((param) => {
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
      providers: [QueriesService],
    }).compile();

    service = module.get<QueriesService>(QueriesService);
    testModel = new MockModel() as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test on find()', () => {
    it('should call aggregate() from model', async () => {
      await service.find({ id: 'non-existed' } as AccountQueryDTO, testModel);
      expect(aggregateFn).toHaveBeenCalled();
    });

    it('should have correct result', async () => {
      const expectedResult: PaginatedResutDto<any> = {
        data: [{}],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      };
      const result = await service.find(
        { id: 'non-existed' } as AccountQueryDTO,
        testModel,
      );
      expect(result).toStrictEqual(expectedResult);
    });

    it('should have correct result when metadata is empty', async () => {
      const expectedResult: PaginatedResutDto<Account> = {
        data: [],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 0,
        },
      };
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
      const result = await service.find(
        { id: 'non-existed' } as AccountQueryDTO,
        testModel,
      );
      expect(result).toStrictEqual(expectedResult);
    });

    it('should have correct sort: address', async () => {
      await service.find(
        { id: 'non-existed', sort: 'address' } as AccountQueryDTO,
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: 'non-existed' } },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { address: 1 } }],
            metadata: [{ $count: 'total' }],
          },
        },
      ]);
    });

    it('should have correct order: asc', async () => {
      await service.find(
        { id: 'non-existed', order: 'desc' } as AccountQueryDTO,
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: 'non-existed' } },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: 1 } }],
            metadata: [{ $count: 'total' }],
          },
        },
      ]);
    });

    it('should have correct order: desc', async () => {
      await service.find(
        { id: 'non-existed', order: 'desc' } as AccountQueryDTO,
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: 'non-existed' } },
        {
          $facet: {
            data: [{ $skip: 0 }, { $limit: 20 }, { $sort: { _id: -1 } }],
            metadata: [{ $count: 'total' }],
          },
        },
      ]);
    });

    it('should have correct pageNumber: 1 and pageSize: 77', async () => {
      await service.find(
        { id: 'non-existed', pageNumber: 2, pageSize: 17 } as AccountQueryDTO,
        testModel,
      );
      expect(aggregateFn).toHaveBeenCalledWith([
        { $match: { id: 'non-existed' } },
        {
          $facet: {
            data: [{ $skip: 17 }, { $limit: 17 }, { $sort: { _id: 1 } }],
            metadata: [{ $count: 'total' }],
          },
        },
      ]);
    });
  });

  describe('test on validifyFindQuery()', () => {
    it('should return correct result', () => {
      const testInput = {
        testString: 'abc',
        testNumber: '123',
        testBoolean: 'true',
        testArray: ['abc', '2', 'true'],
      };
      const result = service.validifyFindQuery(testInput);
      expect(result).toStrictEqual({
        testString: 'abc',
        testNumber: { $in: [123, '123'] },
        testBoolean: true,
        testArray: { $in: ['abc', 2, '2', true] },
      });
    });
  });
});
