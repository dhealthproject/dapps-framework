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
// - Address to always return a formattable valid Address
// - Order to test list ordering features
// - TransactionGroup to test transaction state filtering
// - TransactionType to test type enumerations for transactions
// - TransferTransaction to define fixed transactionInfo
jest.mock("@dhealth/sdk", () => ({
  Address: {
    createFromRawAddress: (a: string) => ({ plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" }),
  },
  Order: { Asc: "asc", Desc: "desc" },
  TransactionGroup: { Confirmed: "1", Unconfirmed: "2", Partial: "3" },
  TransactionType: { TRANSFER: "fake" },
  TransferTransaction: {
    transactionInfo: {
      hash: "fakeHash",
      aggregateHash: "fakeAggregateHash",
    },
    type: "fake",
  },
}));

// external dependencies
import {
  Address,
  Order,
  Transaction as SdkTransaction,
  TransferTransaction,
  TransactionGroup,
  TransactionType,
} from "@dhealth/sdk"; // mocked above ^^^^
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { MockModel, createTransaction } from "../../../mocks/global";
import { DappConfig } from "../../../../src/common/models/DappConfig";
import { State, StateQuery } from "../../../../src/common/models/StateSchema";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
import { DiscoverTransactions } from "../../../../src/discovery/schedulers/DiscoverTransactions/DiscoverTransactions";

// configuration resources
import dappConfigLoader from "../../../../config/dapp";

// Mocks the actual discovery:DiscoverTransactions command to
// allow testing of the `runWithOptions` method.
class MockDiscoverTransactions extends DiscoverTransactions {
  public realRunWithOptions(options?: any) {
    return this.runWithOptions(options);
  }

  // mocks the internal StateService
  protected stateService: any = { findOne: jest.fn(), updateOne: jest.fn() };

  // mocks the internal TransactionsService
  protected transactionsService: any = {
    updateBatch: jest.fn(),
    findOne: jest.fn(),
    createOrUpdate: jest.fn(),
  };

  // mocks **getters** for protected properties
  public getTransactions(): SdkTransaction[] { return this.transactions; }
}

/**
 * @todo extract mocks to mocks concern
 * @todo re-write tests to use **way** less `any` typings
 */
describe("discovery/DiscoverTransactions", () => {
  let service: MockDiscoverTransactions;
  let configService: ConfigService;
  let stateService: StateService;
  let networkService: NetworkService;
  let transactionService: TransactionsService;
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
        TransactionsService,
        QueryService,
        StateService,
        NetworkService,
        {
          provide: getModelToken("Transaction"),
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
        MockDiscoverTransactions,
      ],
    }).compile();

    service = module.get<MockDiscoverTransactions>(MockDiscoverTransactions);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
    transactionService = module.get<TransactionsService>(TransactionsService);
    logger = module.get<Logger>(Logger);

    (service as any).model = new MockModel();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getTransactionQuery()", () => {
    it("should use transfer transaction recipient given incoming query mode", () => {
      // prepare
      (service as any).discoverySource = Address.createFromRawAddress("mocked");
      (service as any).argv = ["incoming"];

      // act 
      const actualResult: any = (service as any).getTransactionQuery();

      // assert
      expect("recipientAddress" in actualResult).toBe(true);
      expect("address" in actualResult).toBe(false);
    });

    it("should use involved addresses given outgoing query mode", () => {
      // prepare
      (service as any).discoverySource = Address.createFromRawAddress("mocked");
      (service as any).argv = ["outgoing"];

      // act 
      const actualResult: any = (service as any).getTransactionQuery();

      // assert
      expect("address" in actualResult).toBe(true);
      expect("recipientAddress" in actualResult).toBe(false);
    });

    it("should use involved addresses given query mode \"both\"", () => {
      // prepare
      (service as any).discoverySource = Address.createFromRawAddress("mocked");
      (service as any).argv = ["both"];

      // act 
      const actualResult: any = (service as any).getTransactionQuery();

      // assert
      expect("address" in actualResult).toBe(true);
      expect("recipientAddress" in actualResult).toBe(false);
    });

    it("should ignore transaction type given empty list", () => {
      // prepare
      (service as any).discoverySource = Address.createFromRawAddress("mocked");
      (service as any).argv = ["incoming"];

      // act 
      const actualResult: any = (service as any).getTransactionQuery(undefined, []); // empty types

      // assert
      expect("type" in actualResult).toBe(false);
    });
  });

  describe("discover()", () => {
    let transactionsQuery: any;
    const emptyPageSearcherMock = jest.fn().mockReturnValue({
      toPromise: jest.fn().mockReturnValue({
        data: [],
        isLastPage: true,
      }),
    });

    // for each discover call, we mock the network service to
    // fake network requests and create a generic REST request
    beforeEach(() => {
      (service as any).argv = ["incoming"];
      (service as any).logger = logger;
      (service as any).discoverySource = Address.createFromRawAddress("mocked");
      (service as any).networkService = {
        getTransactionRepository: () => ({
          search: emptyPageSearcherMock
        }),
      };

      // clear mocks
      emptyPageSearcherMock.mockClear();

      // batch prepare
      transactionsQuery = {
        embedded: true,
        order: Order.Desc,
        pageNumber: 1,
        pageSize: 100,
        recipientAddress: (service as any).discoverySource,
        type: [TransactionType.TRANSFER],
      };
    });

    describe("given empty transactions search result", () => {

      it("should use correct configuration and logging", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(logger.debug).toHaveBeenNthCalledWith(1, "Starting transactions discovery for source \"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY\"");
        expect(logger.debug).toHaveBeenNthCalledWith(2, "Last discovery ended with page: \"1\"");
      });

      it("should include only confirmed transfer transactions by default", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(emptyPageSearcherMock).toHaveBeenCalled();
        expect(emptyPageSearcherMock).toHaveBeenCalledTimes(1);
        expect(emptyPageSearcherMock).toHaveBeenCalledWith({
          ...transactionsQuery,
          group: TransactionGroup.Confirmed,
        });
      });

      it("should include unconfirmed transactions given includeUnconfirmed", async () => {
        // act
        await service.discover({
          includeUnconfirmed: true,
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(emptyPageSearcherMock).toHaveBeenCalled();
        expect(emptyPageSearcherMock).toHaveBeenCalledTimes(2);
        expect(emptyPageSearcherMock).toHaveBeenNthCalledWith(1, {
          ...transactionsQuery,
          group: TransactionGroup.Confirmed,
        });
        expect(emptyPageSearcherMock).toHaveBeenNthCalledWith(2, {
          ...transactionsQuery,
          group: TransactionGroup.Unconfirmed,
        });
      });

      it("should include partial transactions given includePartial", async () => {
        // act
        await service.discover({
          includePartial: true,
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(emptyPageSearcherMock).toHaveBeenCalled();
        expect(emptyPageSearcherMock).toHaveBeenCalledTimes(2);
        expect(emptyPageSearcherMock).toHaveBeenNthCalledWith(1, {
          ...transactionsQuery,
          group: TransactionGroup.Confirmed,
        });
        expect(emptyPageSearcherMock).toHaveBeenNthCalledWith(2, {
          ...transactionsQuery,
          group: TransactionGroup.Partial,
        });
      });

      it("should include all transactions given includeUnconfirmed and includePartial", async () => {
        // act
        await service.discover({
          includeUnconfirmed: true,
          includePartial: true,
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(emptyPageSearcherMock).toHaveBeenCalled();
        expect(emptyPageSearcherMock).toHaveBeenCalledTimes(3);
        expect(emptyPageSearcherMock).toHaveBeenNthCalledWith(1, {
          ...transactionsQuery,
          group: TransactionGroup.Confirmed,
        });
        expect(emptyPageSearcherMock).toHaveBeenNthCalledWith(2, {
          ...transactionsQuery,
          group: TransactionGroup.Unconfirmed,
        });
        expect(emptyPageSearcherMock).toHaveBeenNthCalledWith(3, {
          ...transactionsQuery,
          group: TransactionGroup.Partial,
        });
      });
    });

    describe("given non-empty transactions search result", () => {
      let nonemptyPageSearcherMock: any,
          expectedTransactions: SdkTransaction[] = [];
      // each non-empty result fills a transactions array such
      // that the transaction search is faked to respond.
      beforeEach(() => {
        expectedTransactions = [
          createTransaction("fakeHash1") as any,
          createTransaction("fakeHash2") as any,
          createTransaction("fakeHash3") as any,
        ];
        nonemptyPageSearcherMock = jest.fn().mockReturnValue({
          toPromise: jest.fn().mockReturnValue({
            data: expectedTransactions,
            isLastPage: false,
          }),
        });
  
        // overwrites specific mocks
        (service as any).networkService = {
          getTransactionRepository: () => ({
            search: nonemptyPageSearcherMock
          }),
        };
      });

      it("should read 5 transaction pages from operating node", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });
  
        // assert
        expect(nonemptyPageSearcherMock).toHaveBeenCalled();
        expect(nonemptyPageSearcherMock).toHaveBeenCalledTimes(5);
      });

      it("should flatten transaction pages into transactions array", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });
  
        // assert
        expect((service as any).transactions.length).toBe(
          expectedTransactions.length
        );
      });
  
      it("should create models for unique transactions", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });
  
        // assert
        expect((service as any).model.createStub).toHaveBeenCalled();
        expect((service as any).model.createStub).toHaveBeenCalledTimes(3 * 5); // 3 transactions for each of the 5 pages (mocks)
      });

      it("should use transactionsService.updateBatch with documents array", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });
  
        // assert
        expect((service as any).transactionsService.updateBatch).toHaveBeenCalled();
        expect((service as any).transactionsService.updateBatch).toHaveBeenCalledTimes(1);
      });

      it("should update per-source state using stateService and correct page", async () => {
        // prepare
        const stateIdentifier = "discovery:DiscoverTransactions:NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY";

        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });
  
        // assert
        expect((service as any).stateService.updateOne).toHaveBeenCalled();
        expect((service as any).stateService.updateOne).toHaveBeenCalledWith(
          new StateQuery({ name: stateIdentifier } as State),
          {
            lastPageNumber: 6, // starts at page 1 and reads 5 pages
          }
        );
      });
    });
  });
});
