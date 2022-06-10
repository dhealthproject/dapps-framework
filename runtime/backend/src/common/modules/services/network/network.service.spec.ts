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
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkService, ConfigService],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test on getBlockTimestamp()', () => {
    it('should have correct flow and result when response is not empty', async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve({}),
      }));
      (service as any).blockRepository = {
        getBlockByHeight: getBlockByHeightCall,
      };
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, 'getNetworkTimestampFromUInt64')
        .mockReturnValue(1);
      const result = await service.getBlockTimestamp(1);
      expect(getBlockByHeightCall).toBeCalled();
      expect(getNetworkTimestampFromUInt64Call).toBeCalled();
      expect(result).toEqual(1000);
    });

    it('should throw correct error when response is empty', async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve(),
      }));
      (service as any).blockRepository = {
        getBlockByHeight: getBlockByHeightCall,
      };
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, 'getNetworkTimestampFromUInt64')
        .mockReturnValue(1);
      await service.getBlockTimestamp(1).catch((err: Error) => {
        expect(getBlockByHeightCall).toBeCalled();
        expect(getNetworkTimestampFromUInt64Call).toBeCalledTimes(0);
        expect(err.message).toEqual('Cannot query block from height');
      });
    });
  });

  describe('test on getNetworkTimestampFromUInt64()', () => {
    it('should have correct flow and result', () => {
      const timestamp = { compact: () => 1000 };
      const configGetCall = jest.spyOn(configService, 'get').mockReturnValue(1);
      const expectedResult = timestamp.compact() / 1000 + 1;
      const result = service.getNetworkTimestampFromUInt64(timestamp as any);
      expect(configGetCall).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
