/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// import overwrites for @dhealth/sdk
// These following mocks are used in this unit test series.
// Mocks a subset of "@dhealth/sdk" including classes:
// - TransactionGroup to test transaction state filtering
// - TransferTransaction to define fixed transactionInfo
// - Order to test list ordering features
// - PublicAccount to return a valid Address
// - Address to always return a formattable valid Address
jest.mock("@dhealth/sdk", () => ({
  TransactionGroup: { Confirmed: "1", Unconfirmed: "2", Partial: "3" },
  TransactionType: { TRANSFER: "fake" },
  Order: { Asc: "asc", Desc: "desc" },
  TransferTransaction: {
    transactionInfo: {
      hash: "fakeHash",
      aggregateHash: "fakeAggregateHash",
    },
    type: "fake",
    recipientAddress: "anotherFake",
  },
  PublicAccount: {
    createFromPublicKey: (pk: string, n: number) => ({ address: { plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" } }),
  },
  Address: {
    createFromRawAddress: (a: string) => ({ plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" }),
  }
}));

// external dependencies
import { Address, Order, TransferTransaction, TransactionGroup, TransactionType } from "@dhealth/sdk"; // mocked!
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { DappConfig } from "../../../../src/common/models/DappConfig";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { State } from "../../../../src/common/models/StateSchema";
import { AccountsService } from "../../../../src/discovery/services/AccountsService";
import { Account, AccountQuery } from "../../../../src/discovery/models/AccountSchema";
import { DiscoverAccounts } from "../../../../src/discovery/schedulers/DiscoverAccounts/DiscoverAccounts";
import { AccountDiscoveryStateData } from "../../../../src/discovery/models/AccountDiscoveryStateData";

// configuration resources
import dappConfigLoader from "../../../../config/dapp";

// Mocks the actual discovery:DiscoverAccounts command to
// allow testing of the `runWithOptions` method.
class MockDiscoverAccounts extends DiscoverAccounts {
  public realRunWithOptions(options?: any) {
    return this.runWithOptions(options);
  }

  // mocks the internal StateService
  protected statesService: any = { updateOne: jest.fn() };

  // mocks the internal StateService
  protected accountsService: any = { updateBatch: jest.fn(), findOne: jest.fn() };

  // mocks **getters** for protected properties
  // being filled in processTransactionsPage()
  public getDiscoveredAddresses(): string[] { return this.discoveredAddresses; }
  public getTransactionsByAddress(): Map<string, string[]> { return this.transactionsByAddress; }
  public getTransactions(): TransferTransaction[] { return this.transactions; }
}

/**
 * @todo extract mocks to mocks concern
 * @todo re-write tests to use **way** less `any` typings
 */
describe("discovery/DiscoverAccounts", () => {
  let service: MockDiscoverAccounts;
  let configService: ConfigService;
  let accountsService: AccountsService;
  let statesService: StateService;
  let networkService: NetworkService;
  let logger: Logger;
  let expectedDappConfig: DappConfig = dappConfigLoader();

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AccountsService,
        QueryService,
        StateService,
        NetworkService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel, // test/mocks/global.ts
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel, // test/mocks/global.ts
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        MockDiscoverAccounts,
      ],
    }).compile();

    service = module.get<MockDiscoverAccounts>(MockDiscoverAccounts);
    configService = module.get<ConfigService>(ConfigService);
    accountsService = module.get<AccountsService>(AccountsService);
    statesService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
    logger = module.get<Logger>(Logger);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getStateData() -->", () => {
    it("should use correct account discovery state values", () => {
      // act
      const data: AccountDiscoveryStateData = (service as any).getStateData();

      // assert
      expect("latestTxPage" in data).toBe(true);
      expect("latestTxHash" in data).toBe(true);
      expect(data.latestTxPage).toBe(1);
      expect(data.latestTxHash).toBeUndefined();
    });

    it("should watch state values update", () => {
      // prepare
      (service as any).lastPageNumber = 39;
      (service as any).lastTransactionHash = "fakeHash1";

      // act
      const data: AccountDiscoveryStateData = (service as any).getStateData();

      // assert
      expect("latestTxPage" in data).toBe(true);
      expect("latestTxHash" in data).toBe(true);
      expect(data.latestTxPage).toBe(39);
      expect(data.latestTxHash).toBe("fakeHash1");
    });
  });

  describe("processTransactionsPage() -->", () => {
    it("should create transaction hash index and return last processed hash", () => {
      // prepare
      (service as any).extractTransactionHash = jest.fn();

      // act
      (service as any).processTransactionsPage(undefined, [
        {} as TransferTransaction,
        {} as TransferTransaction,
      ]);

      // assert
      expect((service as any).extractTransactionHash).toHaveBeenCalledTimes(2);
    });

    it("should add only transfer transactions to processed transactions", () => {
      // prepare
      const fakeTx = { type: TransactionType.TRANSFER, recipientAddress: { plain: jest.fn() } };

      // act
      (service as any).processTransactionsPage(undefined, [
        { ...fakeTx, transactionInfo: { hash: "fakeHash1" } },
        { ...fakeTx, transactionInfo: { hash: "fakeHash2" } },
        { type: TransactionType.HASH_LOCK, transactionInfo: { hash: "fakeHash2" } },
      ]);
      const actualResult: TransferTransaction[] = service.getTransactions();

      // assert
      expect(actualResult).toBeDefined();
      expect(actualResult.length).toBe(2); // <--- dropped hashlock transaction
    });

    it("should discover unique list of account addresses", () => {
      // prepare
      const fakeTx = {
        type: TransactionType.TRANSFER,
        recipientAddress: {
          plain: jest.fn().mockReturnValue("always the same"),
        },
      };

      // act
      (service as any).processTransactionsPage(undefined, [
        { ...fakeTx, transactionInfo: { hash: "fakeHash1" } },
        { ...fakeTx, transactionInfo: { hash: "fakeHash2" } },
      ]);
      const actualResult: string[] = service.getDiscoveredAddresses();

      // assert
      expect(actualResult).toBeDefined();
      expect(actualResult.length).toBe(1); // <--- only 1 ("always the same")
    });

    it("should store copy of transfer transactions by account address", () => {
      // prepare
      const fakeTx = {
        type: TransactionType.TRANSFER,
        recipientAddress: {
          plain: jest.fn().mockReturnValue("by address A"),
        },
      };

      // act
      (service as any).processTransactionsPage(undefined, [
        { ...fakeTx, transactionInfo: { hash: "fakeHash1" } },
        { ...fakeTx, transactionInfo: { hash: "fakeHash2" } },
      ]);
      const actualResult: Map<string, string[]> = service.getTransactionsByAddress();

      // assert
      expect(actualResult.has("by address A")).toBe(true);
      expect(actualResult.get("by address A")).toBeDefined();
      expect(actualResult.get("by address A").length).toBe(2);
    });

    it("should return last processed transaction hash", () => {
      // prepare
      const fakeTx = { type: TransactionType.TRANSFER, recipientAddress: { plain: jest.fn() } };

      // act
      const actualResult: string = (service as any).processTransactionsPage(undefined, [
        { ...fakeTx, transactionInfo: { hash: "fakeHash1" } },
        { ...fakeTx, transactionInfo: { hash: "fakeHash2" } },
      ]);

      // assert
      expect(actualResult).toBe("fakeHash2");
    });
  });

  describe("findOrCreateAccount() -->", () => {
    // for each findOrCreateAccount() test, we mock a *fake*
    // list of processed transactions to test that the correct
    // functions are called with correct queries to database
    beforeEach(() => {
      (service as any).transactionsByAddress = new Map<string, string[]>([
        ["address A", ["fakeHash1", "fakeHash2"]]
      ]);
      (service as any).transactions = [
        { transactionInfo: { hash: "fakeHash1", height: { compact: jest.fn() } } },
        { transactionInfo: { hash: "fakeHash2", height: { compact: jest.fn() } } }
      ];
    });

    it("should use AccountsService to findOne document by address", async () => {
      // act
      await (service as any).findOrCreateAccount(
        "address A",
        "fakeHash1",
      );

      // assert
      expect((service as any).accountsService.findOne).toHaveBeenCalled();
      expect((service as any).accountsService.findOne).toHaveBeenCalledWith(
        new AccountQuery(undefined, "address A"),
      );
    });

    it("should read transaction confirmation height for created document", async () => {
      // act
      await (service as any).findOrCreateAccount(
        "address A",
        "fakeHash1",
      );

      // assert
      expect((service as any).transactions[0].transactionInfo.height.compact).toHaveBeenCalled();
    });

    it("should use correct values for newly created document", async () => {
      // act
      const actualResult: Account = await (service as any).findOrCreateAccount(
        "address A",
        "fakeHash1",
      );

      // assert
      expect(actualResult.address).toBe("address A");
      expect(actualResult.transactionsCount).toBe(2);
    });

    it("should increment number of transactions given existing document", async () => {
      // prepare
      (service as any).accountsService = { findOne: jest.fn().mockReturnValue({
        address: "address B",
        transactionsCount: 37,
      }) };

      // act
      const actualResult: Account = await (service as any).findOrCreateAccount(
        "address A",
        "fakeHash1",
      );

      // assert
      expect(actualResult.address).toBe("address B");
      expect(actualResult.transactionsCount).toBe(39); // 37 + the 2 from beforeEach
    });
  });

  describe("discover() -->", () => {
    const emptyPageSearcherMock = jest.fn().mockReturnValue({
      toPromise: jest.fn().mockReturnValue({
        data: [],
        isLastPage: true,
      }),
    });
    beforeEach(() => {
      (service as any).logger = logger;
      (service as any).discoverySource = Address.createFromRawAddress("mocked");
      (service as any).networkService = {
        getTransactionRepository: () => ({
          search: emptyPageSearcherMock
        }),
      };
      (service as any).processTransactionsPage = jest.fn();

      // clear mocks
      emptyPageSearcherMock.mockClear();
    });

    it("should use correct configuration and logging", async () => {
      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(logger.debug).toHaveBeenNthCalledWith(1, "Starting discovery with \"DiscoverAccounts\"", undefined);
      expect(logger.debug).toHaveBeenNthCalledWith(2, "Discovery is tracking the account: \"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY\"", undefined);
      expect(logger.debug).toHaveBeenLastCalledWith("Updating 0 accounts documents in database", undefined);
    });

    it("should use correct page number given existing pre-execution state", async () => {
      // prepare: sets pre-execution state data
      (service as any).state = new State(); 
      (service as any).state.name = "discovery:DiscoverAccounts";
      (service as any).state.data = {
        latestTxPage: 39,
        latestTxHash: "hash56",
      };

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(logger.debug).toHaveBeenCalledWith("Now reading 5 pages including page 39", undefined);
    });

    it("should use transaction repository with correctly paged transaction query", async () => {
      // prepare: overwrites configuration
      (service as any).configService.get = jest.fn().mockReturnValue(expectedDappConfig.dappPublicKey);
      // prepare: sets pre-execution state data
      (service as any).state = new State(); 
      (service as any).state.name = "discovery:DiscoverAccounts";
      (service as any).state.data = {
        latestTxPage: 39,
        latestTxHash: "hash56",
      };

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(emptyPageSearcherMock).toHaveBeenCalledTimes(1);
      expect(emptyPageSearcherMock).toHaveBeenCalledWith({
        signerPublicKey: expectedDappConfig.dappPublicKey,
        group: TransactionGroup.Confirmed, // mocked!
        embedded: true,
        order: Order.Asc, // mocked!
        pageNumber: 39,
        pageSize: 100,
      });
    });

    it("should stop searching given search results last page", async () => {
      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(emptyPageSearcherMock).toHaveBeenCalledTimes(1);
    });

    it("should issue 5 requests consecutively given full pages", async () => {
      // prepare: overwrites configuration
      (service as any).configService.get = jest.fn().mockReturnValue(expectedDappConfig.dappPublicKey);
      // prepare: search results page is *not* last page
      const fullPageSearcherMock = jest.fn().mockReturnValue({
        toPromise: jest.fn().mockReturnValue({
          data: [],
          isLastPage: false,
        }),
      });
      (service as any).networkService = {
        getTransactionRepository: () => ({
          search: fullPageSearcherMock
        }),
      };

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(fullPageSearcherMock).toHaveBeenCalledTimes(5);
      expect(fullPageSearcherMock).toHaveBeenNthCalledWith(5, {
        signerPublicKey: expectedDappConfig.dappPublicKey,
        group: TransactionGroup.Confirmed,
        embedded: true,
        order: Order.Asc,
        pageNumber: 5, // <---- page incremented
        pageSize: 100,
      });
    });
  });
});
