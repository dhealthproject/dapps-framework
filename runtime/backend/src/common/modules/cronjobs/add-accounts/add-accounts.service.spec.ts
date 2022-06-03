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
import { AddAccountsService } from './add-accounts.service';

describe('AddAccountsService', () => {
  let service: AddAccountsService;
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
        AddAccountsService,
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

    service = module.get<AddAccountsService>(AddAccountsService);
    configService = module.get<ConfigService>(ConfigService);
    accountsService = module.get<AccountsService>(AccountsService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test on onModuleInit()', () => {
    it('should have correct flow', async () => {
      const getConfigCall = jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce('test-dapp-pubkey')
        .mockReturnValueOnce([{ url: 'test-url' }]);
      const handleCronCall = jest
        .spyOn(service, 'handleCron')
        .mockResolvedValue();
      await service.onModuleInit();
      expect(getConfigCall).toBeCalled();
      expect(createTransactionRepositoryCall).toBeCalled();
      expect(createBlockRepositoryCall).toBeCalled();
      expect(handleCronCall).toBeCalled();
    });

    it('should successfully update states', async () => {
      const expectedDappPubKey = 'test-dapp-pubkey';
      const url = 'test-url';
      const expectedTransactionRepository = `transactionRepository-${url}`;
      const expectedBlockRepository = `blockRepository-${url}`;
      jest
        .spyOn(configService, 'get')
        .mockReturnValueOnce(expectedDappPubKey)
        .mockReturnValueOnce([{ url }]);
      jest.spyOn(service, 'handleCron').mockResolvedValue();
      await service.onModuleInit();
      expect((service as any).dappPublicKey).toEqual(expectedDappPubKey);
      expect((service as any).transactionRepositories.length).toEqual(1);
      expect((service as any).transactionRepositories).toEqual([
        expectedTransactionRepository,
      ]);
      expect((service as any).blockRepositories.length).toEqual(1);
      expect((service as any).blockRepositories).toEqual([
        expectedBlockRepository,
      ]);
    });
  });

  describe('test on handleCron()', () => {
    it('should have correct flow', async () => {
      (service as any).logger = logger;
      const addAccountsCall = jest
        .spyOn(service, 'addAccounts')
        .mockResolvedValue();
      await service.handleCron();
      expect(logger.log).toBeCalledWith('AddAccountsService starting...');
      expect((service as any).recipients).toBeInstanceOf(Map);
      expect((service as any).recipients.size).toEqual(0);
      expect(addAccountsCall).toBeCalled();
      expect(logger.debug).toBeCalledWith('Runtime duration: 0s');
    });
  });

  describe('test on addAccounts()', () => {
    it('should have correct flow', async () => {
      (service as any).logger = logger;
      (service as any).dappPublicKey = 'test-pubkey';
      (service as any).recipients = new Map<string, AccountDTO>();
      (service as any).recipients.set('test', {});
      const discoverAccountsCall = jest
        .spyOn(service, 'discoverAccounts')
        .mockResolvedValue();
      const updateFirstTransactionsTimeCal = jest
        .spyOn(service, 'updateFirstTransactionsTime')
        .mockResolvedValue();
      const saveAccountsCall = jest
        .spyOn(service, 'saveAccounts')
        .mockResolvedValue();
      await service.addAccounts();
      expect(logger.log).toBeCalledWith('Discovering accounts...');
      expect(discoverAccountsCall).toBeCalledWith('test-pubkey');
      expect(logger.log).toBeCalledWith('Updating first transaction time...');
      expect(updateFirstTransactionsTimeCal).toBeCalledTimes(1);
      expect(logger.log).toBeCalledWith('Updating accounts...');
      expect(saveAccountsCall).toBeCalledWith(
        Array.from((service as any).recipients.values()),
      );
    });
  });

  describe('test on discoverAccounts()', () => {
    it('should have correct flow', async () => {
      (service as any).logger = logger;
      const searchCall = jest.fn(() => ({ toPromise: () => ({}) }));
      (service as any).transactionRepositories = [
        { search: searchCall },
        { search: searchCall },
      ];
      const handleRequestCall = jest
        .spyOn(service, 'handleRequests')
        .mockResolvedValueOnce(true);
      await service.discoverAccounts('test-pubkey');
      expect(searchCall).toBeCalledTimes(100);
      expect(handleRequestCall).toBeCalledTimes(1);
      expect(logger.debug).toBeCalledWith(
        `Processing transaction page: 101...`,
      );
    });
  });

  describe('test on handleTransaction()', () => {
    it('should increment transactionCount when account exists in map', () => {
      const accountDto = { address: 'test-address', transactionsCount: 1 };
      (service as any).recipients = new Map<string, AccountDTO>();
      (service as any).recipients.set('test-address', accountDto);
      const createAccountDTOCall = jest
        .spyOn(service, 'createAccountDTO')
        .mockReturnValue(accountDto);
      const transaction: Transaction = new TransferTransaction('test-address');
      service.handleTransaction(transaction as any);
      expect(accountDto.transactionsCount).toEqual(2);
      expect(createAccountDTOCall).toBeCalledTimes(0);
    });

    it('should create new account dto and add to map if not exists', () => {
      const accountDto = { address: 'test-address', transactionsCount: 1 };
      (service as any).recipients = new Map<string, AccountDTO>();
      const createAccountDTOCall = jest
        .spyOn(service, 'createAccountDTO')
        .mockReturnValue(accountDto);
      const transaction: Transaction = new TransferTransaction('test-address');
      service.handleTransaction(transaction as any);
      expect((service as any).recipients.get('test-address')).toEqual(
        accountDto,
      );
      expect(accountDto.transactionsCount).toEqual(1);
      expect(createAccountDTOCall).toBeCalledTimes(1);
    });
  });

  describe('test on createAccountDTO()', () => {
    it('should return correct result', () => {
      const transaction: TransferTransaction = new TransferTransaction(
        'test-address',
      );
      const expectedResult = {
        address: transaction.recipientAddress.plain(),
        transactionsCount: 1,
        firstTransactionAtBlock: transaction.transactionInfo.height.compact(),
      };
      const result = service.createAccountDTO(transaction as any);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('test on updateTime()', () => {
    it('should have correct flow and result', async () => {
      const accountDto = { address: 'test-address', transactionsCount: 1 };
      (service as any).recipients = new Map<string, AccountDTO>();
      (service as any).recipients.set('test-address', accountDto);
      const getBlockTimestampCalll = jest
        .spyOn(service, 'getBlockTimestamp')
        .mockResolvedValue(1);
      await service.updateTime('test-address', 1, 0);
      expect(getBlockTimestampCalll).toBeCalled();
      expect(
        (service as any).recipients.get('test-address').firstTransactionAt,
      ).toEqual(new Date(1));
    });
  });

  describe('test on saveAccounts()', () => {
    it('should updateBatch from AccountsService', async () => {
      const accountDto = { address: 'test-address', transactionsCount: 1 };
      const updateBatchCall = jest
        .spyOn(accountsService, 'updateBatch')
        .mockResolvedValue({} as any);
      await service.saveAccounts([accountDto]);
      expect(updateBatchCall).toBeCalledWith([accountDto]);
    });
  });

  describe('test on getBlockTimestamp()', () => {
    it('should have correct flow and result when response is not empty', async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve({}),
      }));
      (service as any).blockRepositories = [
        { getBlockByHeight: getBlockByHeightCall },
        { getBlockByHeight: getBlockByHeightCall },
      ];
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, 'getNetworkTimestampFromUInt64')
        .mockReturnValue(1);
      const result = await service.getBlockTimestamp(1, 0);
      expect(getBlockByHeightCall).toBeCalled();
      expect(getNetworkTimestampFromUInt64Call).toBeCalled();
      expect(result).toEqual(1000);
    });

    it('should throw correct error when response is empty', async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve(),
      }));
      (service as any).blockRepositories = [
        { getBlockByHeight: getBlockByHeightCall },
        { getBlockByHeight: getBlockByHeightCall },
      ];
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, 'getNetworkTimestampFromUInt64')
        .mockReturnValue(1);
      await service.getBlockTimestamp(1, 0).catch((err: Error) => {
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

  describe('test on updateFirstTransactionsTime()', () => {
    it('should have correct flow', async () => {
      (service as any).blockRepositories = [{}, {}];
      (service as any).recipients = new Map<string, AccountDTO>();
      (service as any).recipients.set('test', { firstTransactionAtBlock: 1 });
      const updateTimeCall = jest
        .spyOn(service, 'updateTime')
        .mockResolvedValue();
      const promiseAllCall = jest.spyOn(Promise, 'all').mockResolvedValue([]);
      await service.updateFirstTransactionsTime();
      expect(updateTimeCall).toBeCalled();
      expect(promiseAllCall).toBeCalled();
    });

    it('should have fire Promise.all() when number of transactions reach node list length * 30', async () => {
      (service as any).blockRepositories = [{}, {}];
      (service as any).recipients = new Map<string, AccountDTO>();
      for (let i = 0; i < 31; i++) {
        (service as any).recipients.set(`test${i}`, {
          firstTransactionAtBlock: 1,
        });
      }
      const updateTimeCall = jest
        .spyOn(service, 'updateTime')
        .mockResolvedValue();
      const promiseAllCall = jest.spyOn(Promise, 'all').mockResolvedValue([]);
      await service.updateFirstTransactionsTime();
      expect(updateTimeCall).toBeCalled();
      expect(promiseAllCall).toBeCalled();
    });
  });

  describe('test on handleRequests()', () => {
    it('should have correct flow and result = true when request result is not empty', async () => {
      const promiseAllCall = jest
        .spyOn(Promise, 'all')
        .mockResolvedValue([{ data: [{}], isLastPage: true }]);
      const handleTransactionCall = jest
        .spyOn(service, 'handleTransaction')
        .mockReturnValue();
      const result = await service.handleRequests([]);
      expect(result).toBe(true);
      expect(promiseAllCall).toBeCalled();
      expect(handleTransactionCall).toBeCalled();
    });

    it('should have correct flow and result = false when request result is not empty', async () => {
      const promiseAllCall = jest
        .spyOn(Promise, 'all')
        .mockResolvedValue([{ data: [{}], isLastPage: false }]);
      const handleTransactionCall = jest
        .spyOn(service, 'handleTransaction')
        .mockReturnValue();
      const result = await service.handleRequests([]);
      expect(result).toBe(false);
      expect(promiseAllCall).toBeCalled();
      expect(handleTransactionCall).toBeCalled();
    });

    it('should have correct flow and result when request result is null', async () => {
      (service as any).logger = logger;
      const promiseAllCall = jest
        .spyOn(Promise, 'all')
        .mockRejectedValue('test-error');
      const handleTransactionCall = jest
        .spyOn(service, 'handleTransaction')
        .mockReturnValue();
      const result = await service.handleRequests([]);
      expect(logger.error).toBeCalledWith('test-error');
      expect(result).toBe(true);
      expect(promiseAllCall).toBeCalled();
      expect(handleTransactionCall).toBeCalledTimes(0);
    });
  });
});
