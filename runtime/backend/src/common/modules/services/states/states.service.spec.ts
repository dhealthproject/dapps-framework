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
import { StatesService } from './states.service';

describe('StatesService', () => {
  let service: StatesService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatesService,
        {
          provide: getModelToken('State'),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<StatesService>(StatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
