/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
const createTransactionRepositoryCall = jest.fn(
  (url) => () => `transactionRepository-${url}`,
);
const createBlockRepositoryCall = jest.fn(
  (url) => () => `blockRepository-${url}`,
);
const RepositoryFactoryHttpMock = jest.fn((url) => ({
  createTransactionRepository: createTransactionRepositoryCall(url),
  createBlockRepository: createBlockRepositoryCall(url),
}));
jest.mock('@dhealth/sdk', () => ({
  RepositoryFactoryHttp: RepositoryFactoryHttpMock,
  TransactionGroup: { Confirmed: 1 },
  Order: { Asc: 1 },
  Tranasction: Transaction,
  TransferTransaction: TransferTransaction,
  UInt64: { fromUint: (num: number) => num },
}));

class Transaction {}

class TransferTransaction extends Transaction {
  address: string;
  constructor(address: string) {
    super();
    this.address = address;
  }
  recipientAddress = { plain: () => this.address };
  transactionInfo = { height: { compact: () => 1 } };
}

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountDTO } from 'src/common/models';
import { AccountsService } from '../../routes/accounts/accounts.service';
import { QueriesService } from '../../services/queries/queries.service';
import { AccountsDiscoveryService } from './accounts-discovery.service';

describe('AddAccountsService', () => {
  let service: AccountsDiscoveryService;
  let configService: ConfigService;
  let accountsService: AccountsService;
  let logger: Logger;

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
        AccountsDiscoveryService,
        ConfigService,
        AccountsService,
        QueriesService,
        {
          provide: getModelToken('Account'),
          useValue: MockModel,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsDiscoveryService>(AccountsDiscoveryService);
    configService = module.get<ConfigService>(ConfigService);
    accountsService = module.get<AccountsService>(AccountsService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
