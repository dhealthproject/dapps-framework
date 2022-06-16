/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountDTO, AccountsDiscoveryState, State } from 'src/common/models';
import { AccountsService } from '../../routes/accounts/accounts.service';
import { NetworkService } from '../../services/network/network.service';
import { QueriesService } from '../../services/queries/queries.service';
import { StatesService } from '../../services/states/states.service';
import { AccountsDiscoveryService } from './accounts-discovery.service';

//XXX extract to mocks concern
const createTransactionRepositoryCall: any = jest.fn(
  (url) => () => `transactionRepository-${url}`,
);
const createBlockRepositoryCall: any = jest.fn(
  (url) => () => `blockRepository-${url}`,
);
const RepositoryFactoryHttpMock: any = jest.fn((url) => ({
  createTransactionRepository: createTransactionRepositoryCall(url),
  createBlockRepository: createBlockRepositoryCall(url),
}));

class TransactionOverwrite {}

class TransferTransaction extends TransactionOverwrite {
  address: string;
  hash = 'test-hash';
  aggregateHash = false;
  recipientAddress: any;
  transactionInfo: any;
  constructor(address: string, hash?: string, aggregateHash?: boolean) {
    super();
    this.address = address;
    this.hash = hash;
    this.aggregateHash = aggregateHash;
    this.recipientAddress = { plain: () => this.address };
    this.transactionInfo = {
      height: { compact: () => 1 },
      hash: this.aggregateHash ? null : this.hash,
      aggregateHash: this.aggregateHash ? this.hash : null,
    };
  }
}

describe('AccountsDiscoveryService', () => {
  let service: AccountsDiscoveryService;
  let configService: ConfigService;
  let accountsService: AccountsService;
  let statesService: StatesService;
  let networkService: NetworkService;
  let logger: Logger;

  let data: any, saveFn: any, initializeUnorderedBulkOpFn: any;
  //XXX extract to mocks concern
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
  //XXX extract to mocks concern
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
  //XXX extract to mocks concern
  let mockDate: Date;

  //XXX extract to mocks concern
  beforeAll(() => {
    //XXX extract to mocks concern
    jest.mock('@dhealth/sdk', () => ({
      RepositoryFactoryHttp: RepositoryFactoryHttpMock,
      TransactionGroup: { Confirmed: 1 },
      Order: { Asc: 1 },
      Transaction: TransactionOverwrite,
      TransferTransaction: TransferTransaction,
      UInt64: { fromUint: (num: number) => num },
    }));
  });

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
        StatesService,
        NetworkService,
        {
          provide: getModelToken('Account'),
          useValue: MockModel,
        },
        {
          provide: getModelToken('State'),
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
    statesService = module.get<StatesService>(StatesService);
    networkService = module.get<NetworkService>(NetworkService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test on onModuleInit()', () => {
    it('should have correct flow and initialized result', async () => {
      const expectedLogger = new Logger(
        '[Cron] ' + AccountsDiscoveryService.name,
      );
      const getCall = jest
        .spyOn(configService, 'get')
        .mockReturnValue('test-source');
      const discoverCall = jest.spyOn(service, 'discover').mockResolvedValue();
      await service.onModuleInit();
      expect((service as any).logger).toEqual(expectedLogger);
      expect(getCall).toBeCalledWith('dappPublicKey');
      expect((service as any).discoverySource).toEqual('test-source');
      expect(discoverCall).toBeCalledTimes(1);
    });
  });

  // describe('test on discover()', () => {
  //   it('should have correct flow and initialized result', async () => {
  //     (service as any).logger = logger;
  //     const syncStateCall = jest
  //       .spyOn(service, 'syncState')
  //       .mockResolvedValue();
  //     const runDiscoveryCall = jest
  //       .spyOn(service, 'runDiscovery')
  //       .mockResolvedValue();
  //     await service.discover();
  //     expect(logger.log).toBeCalledWith('Service starting...');
  //     expect(logger.log).toBeCalledWith('Syncing states...');
  //     expect(syncStateCall).toBeCalledTimes(1);
  //     expect(runDiscoveryCall).toBeCalledTimes(1);
  //     expect(logger.debug).toBeCalledWith('Runtime duration: 0s');
  //     expect((service as any).accountsMap).toEqual(
  //       new Map<string, AccountDTO>(),
  //     );
  //   });
  // });

  // describe('test on syncState()', () => {
  //   it('should have correct flow and result', async () => {
  //     const state: State = {
  //       name: AccountsDiscoveryService.name,
  //       data: {
  //         currentTxPage: 1,
  //         latestTxHash: 'test-hash',
  //       },
  //     };
  //     const findOneCall = jest
  //       .spyOn(statesService, 'findOne')
  //       .mockResolvedValue(state);
  //     await service.syncState();
  //     expect(findOneCall).toHaveBeenCalledWith({
  //       name: AccountsDiscoveryService.name,
  //     });
  //     expect((service as any).state).toEqual(state);
  //   });
  // });

  // describe('test on runDiscovery()', () => {
  //   it('should have correct flow', async () => {
  //     (service as any).logger = logger;
  //     (service as any).accountsMap = new Map();
  //     const discoverAccountsCall = jest
  //       .spyOn(service, 'discoverAccounts')
  //       .mockResolvedValue();
  //     const updateFirstTransactionsTimeCall = jest
  //       .spyOn(service, 'updateFirstTransactionsTime')
  //       .mockResolvedValue();
  //     const saveAccountsCall = jest
  //       .spyOn(service, 'saveAccounts')
  //       .mockResolvedValue();
  //     await service.runDiscovery();
  //     expect(logger.log).toBeCalledWith('Discovering accounts...');
  //     expect(discoverAccountsCall).toBeCalledTimes(1);
  //     expect(logger.log).toBeCalledWith('Updating first transaction time...');
  //     expect(updateFirstTransactionsTimeCall).toBeCalledTimes(1);
  //     expect(logger.log).toBeCalledWith('Updating accounts...');
  //     expect(saveAccountsCall).toBeCalledTimes(1);
  //   });
  // });

  // describe('test on discoverAccounts()', () => {
  //   it('should have correct flow with no state & isLastPage = true', async () => {
  //     (networkService as any).transactionRepository = { search: () => ({}) };
  //     const searchCall = jest
  //       .spyOn(networkService.transactionRepository, 'search')
  //       .mockReturnValue({
  //         toPromise: () =>
  //           Promise.resolve({
  //             data: [],
  //             isLastPage: true,
  //           } as any),
  //       } as any);
  //     const handleTransactionsCall = jest
  //       .spyOn(service, 'handleTransactions')
  //       .mockResolvedValue();
  //     const saveStateCall = jest
  //       .spyOn(service, 'saveState')
  //       .mockResolvedValue();
  //     await service.discoverAccounts();
  //     expect(searchCall).toBeCalledTimes(1);
  //     expect(handleTransactionsCall).toBeCalledTimes(1);
  //     expect(saveStateCall).toBeCalledTimes(1);
  //   });

  //   it('should have correct flow with state & isLastPage = false', async () => {
  //     const state: State = {
  //       name: AccountsDiscoveryService.name,
  //       data: {
  //         currentTxPage: 2,
  //         latestTxHash: 'test-hash',
  //       },
  //     };
  //     (service as any).state = state;
  //     (networkService as any).transactionRepository = { search: () => ({}) };
  //     const searchCall = jest
  //       .spyOn(networkService.transactionRepository, 'search')
  //       .mockReturnValue({
  //         toPromise: () =>
  //           Promise.resolve({
  //             data: [],
  //             isLastPage: false,
  //           } as any),
  //       } as any);
  //     const handleTransactionsCall = jest
  //       .spyOn(service, 'handleTransactions')
  //       .mockResolvedValue();
  //     const saveStateCall = jest
  //       .spyOn(service, 'saveState')
  //       .mockResolvedValue();
  //     await service.discoverAccounts();
  //     expect(searchCall).toBeCalledTimes(10);
  //     expect(handleTransactionsCall).toBeCalledTimes(10);
  //     expect(saveStateCall).toBeCalledTimes(1);
  //   });
  // });

  // describe('test on handleTransactions()', () => {
  //   it("should have correct flow and result when state doesn't exist", async () => {
  //     const transactions: any = [];
  //     for (let i = 0; i < 3; i++) {
  //       transactions.push(
  //         new TransferTransaction(`address${i}`, `hash${i}`, false),
  //       );
  //     }
  //     const handleTransactionCall = jest
  //       .spyOn(service, 'handleTransaction')
  //       .mockResolvedValue();
  //     await service.handleTransactions(transactions);
  //     expect(handleTransactionCall).toBeCalledTimes(3);
  //     for (let i = 0; i < transactions.length; i++) {
  //       expect(handleTransactionCall).toHaveBeenNthCalledWith(
  //         i + 1,
  //         transactions[i],
  //       );
  //     }
  //   });

  //   it('should have correct flow and result with transactionInfo.hash when state does exist', async () => {
  //     const stateData: AccountsDiscoveryState = {
  //       currentTxPage: 1,
  //       latestTxHash: 'hash2',
  //     };
  //     const state: State = {
  //       name: AccountsDiscoveryService.name,
  //       data: stateData,
  //     };
  //     (service as any).state = state;
  //     const transactions: any = [];
  //     for (let i = 1; i <= 3; i++) {
  //       transactions.push(
  //         new TransferTransaction(`address${i}`, `hash${i}`, false),
  //       );
  //     }
  //     const handleTransactionCall = jest
  //       .spyOn(service, 'handleTransaction')
  //       .mockResolvedValue();
  //     await service.handleTransactions(transactions);
  //     expect(transactions.length).toEqual(1);
  //     expect(transactions[0].transactionInfo.hash).toEqual('hash3');
  //     expect(handleTransactionCall).toBeCalledTimes(1);
  //     expect(handleTransactionCall).toHaveBeenCalledWith(transactions[0]);
  //   });

  //   it('should have correct flow and result with transactionInfo.aggregateHash when state does exist', async () => {
  //     const stateData: AccountsDiscoveryState = {
  //       currentTxPage: 1,
  //       latestTxHash: 'hash2',
  //     };
  //     const state: State = {
  //       name: AccountsDiscoveryService.name,
  //       data: stateData,
  //     };
  //     (service as any).state = state;
  //     const transactions: any = [];
  //     for (let i = 1; i <= 3; i++) {
  //       transactions.push(
  //         new TransferTransaction(`address${i}`, `hash${i}`, true),
  //       );
  //     }
  //     const handleTransactionCall = jest
  //       .spyOn(service, 'handleTransaction')
  //       .mockResolvedValue();
  //     await service.handleTransactions(transactions);
  //     expect(transactions.length).toEqual(1);
  //     expect(transactions[0].transactionInfo.aggregateHash).toEqual('hash3');
  //     expect(handleTransactionCall).toBeCalledTimes(1);
  //     expect(handleTransactionCall).toHaveBeenCalledWith(transactions[0]);
  //   });
  // });

  // describe('test on handleTransaction()', () => {
  //   it('should have correct flow when accountsMap contain address', async () => {
  //     const transaction = new TransferTransaction('test-address');
  //     const account = { transactionsCount: 1 };
  //     (service as any).accountsMap = new Map<string, AccountDTO>();
  //     const getCall = jest
  //       .spyOn((service as any).accountsMap, 'get')
  //       .mockReturnValue(account);
  //     const createAccountDTOCall = jest
  //       .spyOn(service, 'createAccountDTO')
  //       .mockResolvedValue(account as any);
  //     await service.handleTransaction(transaction as any);
  //     expect(getCall).toBeCalledTimes(1);
  //     expect(createAccountDTOCall).toBeCalledTimes(0);
  //     expect(account.transactionsCount).toEqual(2);
  //   });

  //   it("should have correct flow when accountsMap doesn't contain address", async () => {
  //     const transaction = new TransferTransaction('test-address');
  //     const account = { transactionsCount: 1 };
  //     (service as any).accountsMap = new Map<string, AccountDTO>();
  //     const getCall = jest
  //       .spyOn((service as any).accountsMap, 'get')
  //       .mockReturnValue(null);
  //     const setCall = jest
  //       .spyOn((service as any).accountsMap, 'set')
  //       .mockReturnValue((service as any).accountsMap);
  //     const createAccountDTOCall = jest
  //       .spyOn(service, 'createAccountDTO')
  //       .mockResolvedValue(account as any);
  //     await service.handleTransaction(transaction as any);
  //     expect(getCall).toBeCalledTimes(1);
  //     expect(createAccountDTOCall).toBeCalledTimes(1);
  //     expect(setCall).toBeCalledWith('test-address', account);
  //   });
  // });

  // describe('test on createAccountDTO()', () => {
  //   it("should have correct flow and result when db doesn't contain account", async () => {
  //     const transaction = new TransferTransaction('test-address');
  //     const findCall = jest
  //       .spyOn(accountsService, 'find')
  //       .mockResolvedValue({ data: [] } as any);
  //     const expectedResult = {
  //       address: transaction.recipientAddress.plain(),
  //       transactionsCount: 1,
  //       firstTransactionAtBlock: transaction.transactionInfo.height.compact(),
  //     };
  //     const result = await service.createAccountDTO(transaction as any);
  //     expect(findCall).toBeCalledWith({ address: 'test-address' });
  //     expect(result).toEqual(expectedResult);
  //   });

  //   it('should have correct flow and result when db does contain account', async () => {
  //     const transaction = new TransferTransaction('test-address');
  //     const account = {
  //       address: transaction.recipientAddress.plain(),
  //       transactionsCount: 1,
  //       firstTransactionAtBlock: transaction.transactionInfo.height.compact(),
  //     };
  //     const expectedResult = {
  //       address: account.address,
  //       transactionsCount: account.transactionsCount + 1,
  //       firstTransactionAtBlock: account.firstTransactionAtBlock,
  //     };
  //     const findCall = jest
  //       .spyOn(accountsService, 'find')
  //       .mockResolvedValue({ data: [account] } as any);
  //     const result = await service.createAccountDTO(transaction as any);
  //     expect(findCall).toBeCalledWith({ address: 'test-address' });
  //     expect(result).toEqual(expectedResult);
  //   });
  // });

  // describe('test on updateFirstTransactionsTime()', () => {
  //   it('should have correct flow and result', async () => {
  //     (service as any).accountsMap = new Map<string, AccountDTO>();
  //     (service as any).accountsMap.set('test', { firstTransactionAtBlock: 1 });
  //     const updateTimeCall = jest
  //       .spyOn(networkService, 'getBlockTimestamp')
  //       .mockResolvedValue(1);
  //     const expectedResult = new Date(1);
  //     await service.updateFirstTransactionsTime();
  //     expect(updateTimeCall).toBeCalledWith(1);
  //     expect(
  //       (service as any).accountsMap.get('test').firstTransactionAt,
  //     ).toEqual(expectedResult);
  //   });

  //   it('should not update account if firstTransactionAt already has value', async () => {
  //     (service as any).accountsMap = new Map<string, AccountDTO>();
  //     (service as any).accountsMap.set('test', {
  //       firstTransactionAtBlock: 1,
  //       firstTransactionAt: new Date(1),
  //     });
  //     const updateTimeCall = jest
  //       .spyOn(networkService, 'getBlockTimestamp')
  //       .mockResolvedValue(2);
  //     await service.updateFirstTransactionsTime();
  //     expect(updateTimeCall).toBeCalledTimes(0);
  //     expect((service as any).accountsMap.get('test')).toEqual({
  //       firstTransactionAtBlock: 1,
  //       firstTransactionAt: new Date(1),
  //     });
  //   });
  // });

  // describe('test on saveAccounts()', () => {
  //   it('should call updateBatch() from AccountsService', async () => {
  //     const accountDto = { address: 'test-address', transactionsCount: 1 };
  //     const updateBatchCall = jest
  //       .spyOn(accountsService, 'updateBatch')
  //       .mockResolvedValue({} as any);
  //     await service.saveAccounts([accountDto]);
  //     expect(updateBatchCall).toBeCalledWith([accountDto]);
  //   });
  // });

  // describe('test on saveState()', () => {
  //   it('should have correct flow and result with hash', async () => {
  //     const currentTxPage = 1;
  //     const result = {
  //       data: [{ transactionInfo: { hash: 'test-hash' } }],
  //     };
  //     const updateOneCall = jest
  //       .spyOn(statesService, 'updateOne')
  //       .mockResolvedValue({} as any);
  //     const expectedParam = {
  //       name: AccountsDiscoveryService.name,
  //       data: {
  //         currentTxPage,
  //         latestTxHash: 'test-hash',
  //       },
  //     };
  //     await service.saveState(currentTxPage, result as any);
  //     expect(updateOneCall).toBeCalledWith(expectedParam);
  //   });

  //   it('should have correct flow and result with aggregateHash', async () => {
  //     const currentTxPage = 1;
  //     const result = {
  //       data: [{ transactionInfo: { aggregateHash: 'test-hash' } }],
  //     };
  //     const updateOneCall = jest
  //       .spyOn(statesService, 'updateOne')
  //       .mockResolvedValue({} as any);
  //     const expectedParam = {
  //       name: AccountsDiscoveryService.name,
  //       data: {
  //         currentTxPage,
  //         latestTxHash: 'test-hash',
  //       },
  //     };
  //     await service.saveState(currentTxPage, result as any);
  //     expect(updateOneCall).toBeCalledWith(expectedParam);
  //   });

  //   it('should return with empty result', async () => {
  //     const currentTxPage = 1;
  //     const result: any = {
  //       data: [],
  //     };
  //     const updateOneCall = jest
  //       .spyOn(statesService, 'updateOne')
  //       .mockResolvedValue({} as any);
  //     await service.saveState(currentTxPage, result as any);
  //     expect(updateOneCall).toBeCalledTimes(0);
  //   });
  // });
});
