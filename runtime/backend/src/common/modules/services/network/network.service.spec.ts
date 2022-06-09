/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

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
jest.mock('@dhealth/sdk', () => ({
  RepositoryFactoryHttp: RepositoryFactoryHttpMock,
  TransactionGroup: { Confirmed: 1 },
  Order: { Asc: 1 },
  Tranasction: Transaction,
  TransferTransaction: TransferTransaction,
  UInt64: { fromUint: (num: number) => num },
}));

import { NetworkService } from './network.service';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkService, ConfigService],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
