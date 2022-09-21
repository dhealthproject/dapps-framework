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
  TransactionGroup,
  TransactionType,
} from "@dhealth/sdk"; // mocked above ^^^^
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { MockModel, createTransaction } from "../../../mocks/global";
import { StateDocument, StateQuery } from "../../../../src/common/models/StateSchema";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
import { DiscoverTransactions } from "../../../../src/discovery/schedulers/DiscoverTransactions/DiscoverTransactions";

// configuration resources
import { TransactionDiscoveryStateData } from "@/discovery/models/TransactionDiscoveryStateData";

// Mocks the actual discovery:DiscoverTransactions command to
// allow testing of the `runWithOptions` method.
class MockDiscoverTransactions extends DiscoverTransactions {
  public realRunWithOptions(options?: any) {
    return this.runWithOptions(options);
  }

  // mocks the internal StateService
  protected stateService: any = { findOne: jest.fn(), updateOne: jest.fn() };

  // mocks the internal NetworkService
  protected networkService: any = { delegatePromises: jest.fn().mockReturnValue([]) };

  // mocks the internal TransactionsService
  protected transactionsService: any = {
    exists: jest.fn().mockReturnValue(false),
    count: jest.fn().mockReturnValue(0),
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
  let stateService: StateService;
  let logger: Logger;

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
    stateService = module.get<StateService>(StateService);
    logger = module.get<Logger>(Logger);

    // overwrites the internal model (injected)
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
      (service as any).argv = ["both"];
      (service as any).logger = logger;
      (service as any).discoverySource = { plain: jest.fn() };
      (service as any).networkService = {
        transactionRepository: {
          search: emptyPageSearcherMock
        },
        delegatePromises: jest.fn().mockReturnValue([]),
      };

      // clear mocks
      emptyPageSearcherMock.mockClear();

      // batch prepare
      transactionsQuery = {
        embedded: false,
        order: Order.Asc,
        pageNumber: 1,
        pageSize: 100,
        address: (service as any).discoverySource,
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
        expect(logger.debug).toHaveBeenNthCalledWith(2, "Last discovery for \"discovery:DiscoverTransactions:NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY\" ended with page: \"1\"");
      });

      it("should set totalNumberOfTransactions if exists", async () => {
        // prepare
        (service as any).state = {
          data: {
            totalNumberOfTransactions: 2,
            lastPageNumber: 2,
          }
        };

        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect((service as any).totalNumberOfTransactions).toEqual(2);
      });

      it("should set totalNumberOfTransactions to 0 if null", async () => {
        // prepare
        (service as any).state = {
          data: {
            totalNumberOfTransactions: null,
            lastPageNumber: null,
          }
        };

        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect((service as any).totalNumberOfTransactions).toEqual(0);
      });

      it("should set lastPageNumber if exists", async () => {
        // prepare
        const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({
          data: {
            lastPageNumber: 2,
          }
        } as StateDocument);
        ((service as any).stateService).findOne = stateServiceFindOneCall;
        const stateQuerySrc = new StateQuery({
          name: "discovery:DiscoverTransactions:NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"
        } as StateDocument);

        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(stateServiceFindOneCall).toHaveBeenNthCalledWith(1, stateQuerySrc);
        expect((service as any).lastPageNumber).toEqual(2);
      });

      it("should set lastPageNumber to 1 if null", async () => {
        // prepare
        const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({
          data: {
            lastPageNumber: null,
          }
        } as StateDocument);
        ((service as any).stateService).findOne = stateServiceFindOneCall;
        const stateQuerySrc = new StateQuery({
          name: "discovery:DiscoverTransactions:NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"
        } as StateDocument);

        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(stateServiceFindOneCall).toHaveBeenNthCalledWith(1, stateQuerySrc);
        expect((service as any).lastPageNumber).toEqual(1);
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
          transactionRepository: {
            search: nonemptyPageSearcherMock
          },
          delegatePromises: jest.fn().mockReturnValue([{
            data: expectedTransactions,
            isLastPage: false,
          }]),
        };
      });

      afterEach(() => {
        // clear database mocks
        (service as any).model.createStub.mockClear();
      })

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
          expectedTransactions.length * 5 // 5 transaction pages
        );
      });

      it("should check for the existence of hashes in mongo", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });
  
        // assert
        expect((service as any).model.createStub).toHaveBeenCalledTimes(3); // 3 transactions with unique hash
        expect((service as any).transactionsService.exists).toHaveBeenCalledTimes(3);
      });
    
      it("should create models for unique transactions", async () => {
        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });
  
        // assert
        expect((service as any).model.createStub).toHaveBeenCalled();
        expect((service as any).model.createStub).toHaveBeenCalledTimes(3); // 3 transactions with unique hash
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
          new StateQuery({ name: stateIdentifier } as StateDocument),
          {
            lastPageNumber: 6, // starts at page 1 and reads 5 pages
            sync: false, // synchronization state is "not synchronized yet"
          }
        );
      });

      it("should skip update for known transactions", async () => {
        // prepare
        const transactionsServiceExistsCall = jest
          .fn()
          .mockResolvedValue(true);
        (service as any).transactionsService.exists = transactionsServiceExistsCall;
        const createCall = jest.spyOn(MockModel.prototype, "create");

        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        })

        // assert
        expect(transactionsServiceExistsCall).toHaveBeenCalledTimes(3);
        expect(createCall).toHaveBeenCalledTimes(0);
      });

      it("should progress exactly the same with outgoing transactionMode", async () => {
        // prepare
        (service as any).discoverySource.plain =
          jest.fn().mockReturnValue("NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY");
        const transactionServiceExistsCall = jest
          .fn()
          .mockResolvedValue(false);
        (service as any).transactionsService.exists = transactionServiceExistsCall;
        const stateIdentifier = "discovery:DiscoverTransactions:NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY";
        const createCall = jest.spyOn(MockModel.prototype, "create");
        const extractRecipientAddressCall = jest
          .spyOn((service as any), "extractRecipientAddress")
          .mockReturnValue("NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY");

        // act
        await service.discover({
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
        });

        // assert
        expect(createCall).toHaveBeenCalledTimes(3);
        expect(extractRecipientAddressCall).toHaveBeenCalledTimes(3);
        expect((service as any).stateService.updateOne).toHaveBeenCalled();
        expect((service as any).stateService.updateOne).toHaveBeenCalledWith(
          new StateQuery({ name: stateIdentifier } as StateDocument),
          {
            lastPageNumber: 6, // starts at page 1 and reads 5 pages
            sync: false, // synchronization state is "not synchronized yet"
          }
        );
      });
    });
  });

  describe("signature()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = `DiscoverTransactions incoming|outgoing|both [` +
      `--source "SOURCE-ADDRESS-OR-PUBKEY"` +
      `--includeTypes "transfer"` +
      `--includeUnconfirmed` +
      `--includePartial` +
      `]`;

      // act
      const signature = (service as any).signature;

      // assert
      expect(signature).toEqual(expectedResult);
    });
  });

  describe("getStateData()", () => {
    it("should return correct result", () => {
      // prepare
      const lastUsedAccount = "test-last-used-account";
      const totalNumberOfTransactions = 1;
      const expectedResult = {
        lastUsedAccount,
        totalNumberOfTransactions,
      } as TransactionDiscoveryStateData;
      (service as any).lastUsedAccount = lastUsedAccount;
      (service as any).totalNumberOfTransactions = totalNumberOfTransactions;

      // act
      const stateData = (service as any).getStateData();

      // assert
      expect(stateData).toEqual(expectedResult);
    });
  });

  describe("parseTransactionTypes()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResults: any = [ [TransactionType.TRANSFER], [] ];
      ["Transfer Transaction", "SomethingElse"].forEach((transactionType, index) => {
        // act
        const parsedTransactionType = (service as any).parseTransactionTypes(transactionType);

        // assert
        expect(parsedTransactionType).toEqual(expectedResults[index]);
      });
    });
  });

  describe("parseUnconfirmedFlag()", () => {
    it("should return correct value", () => {
      // prepare
      const expectedResult = [true, false];
      ["something", ""].forEach((unconfirmedOption, index) => {
        // act
        const result = (service as any).parseUnconfirmedFlag(unconfirmedOption);

        // assert
        expect(result).toBe(expectedResult[index]);
      });
    });
  });

  describe("parsePartialFlag()", () => {
    it("should return correct value", () => {
      // prepare
      const expectedResult = [true, false];
      ["something", ""].forEach((partialOption, index) => {
        // act
        const result = (service as any).parsePartialFlag(partialOption);

        // assert
        expect(result).toBe(expectedResult[index]);
      });
    });
  });

  describe("runAsScheduler()", () => {
    // prepare some mock overwrites
    const runMock: any = jest.fn();
    const getNextSourceMock: any = jest.fn();
    const configGetMock: any = jest.fn().mockReturnValue(["a", "b"]);
    const emptyPageSearcherMock = jest.fn().mockReturnValue({
      toPromise: jest.fn().mockReturnValue({
        data: [],
        isLastPage: true,
      }),
    });

    // we overwrite the `run()` method as this one is
    // tested separately in `DiscoveryCommand` base class
    beforeEach(() => {
      // mocks the configService to fake configuration
      (service as any).configService = {
        get: configGetMock,
      };

      // we overwrite the run() method as we are not
      // testing this one here but in DiscoveryCommand
      (service as any).run = runMock;
      (service as any).getNextSource = getNextSourceMock;

      // clear mocks
      emptyPageSearcherMock.mockClear();
      configGetMock.mockClear();
      runMock.mockClear();
      getNextSourceMock.mockClear();
    });

    it("should bail out if configuration is empty", async () => {
      // prepare
      const configServiceGet = jest.fn().mockReturnValue(null);
      (service as any).configService.get = configServiceGet;

      const getNextSourceCall = jest
        .spyOn((service as any), "getNextSource");

      // act
      await service.runAsScheduler();

      // assert
      expect(configServiceGet).toHaveBeenCalledTimes(1);
      expect(getNextSourceCall).toHaveBeenCalledTimes(0);
    });

    it("should read configuration from configService", async () => {
      // act
      await service.runAsScheduler();

      // assert
      expect(configGetMock).toHaveBeenCalledTimes(1);
      expect(configGetMock).toHaveBeenCalledWith("discovery.sources");
    });

    it("should use getNextSource for current source", async () => {
      // act
      await service.runAsScheduler();

      // assert
      expect(getNextSourceMock).toHaveBeenCalledTimes(1);
      expect(getNextSourceMock).toHaveBeenCalledWith(["a", "b"]); // mocked sources
    });

    it("should execute command runtime using run method", async () => {
      // act
      await service.runAsScheduler();

      // assert
      expect(runMock).toHaveBeenCalledTimes(1);
    });

    // @todo should bail out given empty discovery config
  });

  describe("getNextSource()", () => {
    // prepare internal method mocks
    let parseSourceMock: any = jest.fn().mockReturnValue({ plain: () => "abc" });

    // we overwrite the `parseSource()` method as this one is
    // tested separately in `DiscoveryCommand`.
    beforeEach(() => {
      // mocks the configService to fake configuration
      (service as any).parseSource = parseSourceMock;

      // clear mocks
      parseSourceMock.mockClear();
    });

    it("should correctly parse source input", async () => {
      // act
      const source: string = await (service as any).getNextSource(["a", "b"]);

      // assert
      expect(source).toBeDefined();
      expect(source).toBe("abc"); // as mocked
      expect(parseSourceMock).toHaveBeenCalled();
      expect(parseSourceMock).toHaveBeenCalledWith("a");
    });

    it("should read synchronization state with per-source identifier", async () => {
      // act
      const source: string = await (service as any).getNextSource(["a", "b"]);

      // assert
      expect((service as any).stateService.findOne).toHaveBeenCalled();
      expect((service as any).stateService.findOne).toHaveBeenCalledWith(new StateQuery({
        name: `discovery:DiscoverTransactions:${source}`, // "discovery:DiscoverTransactions:%SOURCE%"
      } as StateDocument));
    });

    it("should loop through available sources", async () => {
      // overwrites parseSource mock as used inside loop
      parseSourceMock = jest.fn()
        .mockReturnValueOnce({ plain: () => "a" })
        .mockReturnValueOnce({ plain: () => "b" });

      // prepare
      (service as any).parseSource = parseSourceMock;
      (service as any).stateService.findOne = jest.fn().mockReturnValue({
        data: { sync: true },
      });

      // act
      await (service as any).getNextSource(["a", "b"]);

      // assert
      expect(parseSourceMock).toHaveBeenCalledTimes(2);
      expect((service as any).stateService.findOne).toHaveBeenCalledTimes(2);
      expect((service as any).stateService.findOne).toHaveBeenNthCalledWith(1, new StateQuery({
        name: `discovery:DiscoverTransactions:a`, // "discovery:DiscoverTransactions:%SOURCE%"
      } as StateDocument));
      expect((service as any).stateService.findOne).toHaveBeenNthCalledWith(2, new StateQuery({
        name: `discovery:DiscoverTransactions:b`, // "discovery:DiscoverTransactions:%SOURCE%"
      } as StateDocument));
    });

    describe("given fully synchronized state", () => {
      // overwrites the `parseSource()` mock to return
      // *more than one* discovery source such that
      // the synchronization state can be tested.
      beforeEach(() => {
        parseSourceMock = jest.fn()
          .mockReturnValueOnce({ plain: () => "a" })
          .mockReturnValueOnce({ plain: () => "b" });

        (service as any).parseSource = parseSourceMock;

        // also overwrites per-source synchronization state
        // as we want to test fully synchronized discovery
        (service as any).stateService.findOne = jest.fn().mockReturnValue({
          data: { sync: true },
        });
      });

      it("should detect fully synchronized state", async () => {
        // prepare
        (service as any).state = { data: {} }; // <-- missing "lastUsedAccount"

        // act
        await (service as any).getNextSource(["a", "b"]);

        // assert
        expect(parseSourceMock).toHaveBeenCalledTimes(2);
        expect((service as any).stateService.findOne).toHaveBeenCalledTimes(2);
      });

      it("should use first source given no general synchronization state", async () => {
        // prepare
        (service as any).state = { data: {} }; // <-- missing "lastUsedAccount"

        // act
        const actual: string = await (service as any).getNextSource(["a", "b"]);

        // assert
        expect(actual).toBeDefined();
        expect(actual).toBe("a"); // <-- first source
      });

      it("should find last used source and continue with next", async () => {
        // prepare
        (service as any).state = {
          data: { lastUsedAccount: "a" }, // <-- forcing state here
        };

        // act
        const actual: string = await (service as any).getNextSource(["a", "b"]);

        // assert
        expect(actual).toBeDefined();
        expect(actual).toBe("b"); // <-- next source
      });

      it("should use first source given invalid last used source", async () => {
        // prepare
        (service as any).state = {
          data: { lastUsedAccount: "c" }, // <-- forcing state here
        };

        // act
        const actual: string = await (service as any).getNextSource(["a", "b"]);

        // assert
        expect(actual).toBeDefined();
        expect(actual).toBe("a"); // <-- first source
      });
    });
  });

  describe("extractTransactionHash()", () => {
    it("should return correct value", () => {
      // prepare
      [
        { transactionInfo: { hash: "trasaction-info-hash" } },
        { transactionInfo: { aggregateHash: "aggregate-transaction-info-hash" } }
      ].forEach((transaction) => {
        // act
        const result = (service as any).extractTransactionHash(transaction);

        // assert
        expect(result).toBe(
          transaction.transactionInfo.hash ?
          transaction.transactionInfo.hash :
          transaction.transactionInfo.aggregateHash
        );
      });
    });
  });

  describe("extractTransactionMessage()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResults = ["test-message", null, null];
      ["test-message", "", undefined].forEach((payload, index) => {
        const transaction = {
          message: {
            payload,
          }
        };

        // act
        const result = (service as any).extractTransactionMessage(transaction);

        // assert
        expect(result).toBe(expectedResults[index]);
      })
    })
  });
});
