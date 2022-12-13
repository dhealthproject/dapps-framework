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
import { AccountService, Address, NetworkType, PublicAccount } from "@dhealth/sdk"; // mocked!
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { EventEmitter2 } from '@nestjs/event-emitter';

// internal dependencies
import { createTransactionDocument, MockModel } from "../../../mocks/global";
import { QueryParameters } from "../../../../src/common/concerns/Queryable";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountDocument, AccountQuery } from "../../../../src/common/models/AccountSchema";
import { TransactionDocument, TransactionQuery } from "../../../../src/common/models/TransactionSchema";
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
import { DiscoverAccounts } from "../../../../src/discovery/schedulers/DiscoverAccounts/DiscoverAccounts";
import { AccountDiscoveryStateData } from "../../../../src/discovery/models/AccountDiscoveryStateData";
import { BaseCommand } from "../../../../src/worker/BaseCommand";
import { LogService } from "../../../../src/common/services/LogService";
import { PaginatedResultDTO, State, StateDocument } from "@/classes";

// Mocks a transaction factory to create valid and
// invalid transaction pages from database queries.
const fakeCreateTransactionDocuments = (
  x: number = 20,
): TransactionDocument[] => {
  const output: TransactionDocument[] = [];
  for (let i = 0; i < x; i++) {
    output.push(createTransactionDocument(`fakeHash${i+1}`));
  }
  return output;
}

describe("discovery/DiscoverAccounts", () => {
  let service: DiscoverAccounts;
  let transactionsService: TransactionsService;
  let stateService: StateService;
  let accountsService: AccountsService;
  let logger: LogService;

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoverAccounts,
        ConfigService,
        AccountsService,
        TransactionsService,
        QueryService,
        StateService,
        NetworkService,
        EventEmitter2,
        {
          provide: getModelToken("Account"),
          useValue: MockModel, // test/mocks/global.ts
        },
        {
          provide: getModelToken("Transaction"),
          useValue: MockModel, // test/mocks/global.ts
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel, // test/mocks/global.ts
        },
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            setModule: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DiscoverAccounts>(DiscoverAccounts);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    stateService = module.get<StateService>(StateService);
    accountsService = module.get<AccountsService>(AccountsService);
    logger = module.get<LogService>(LogService);

    // overwrites the internal model (injected)
    // (service as any).model = new MockModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("get command()", () => {
    it("should return correct value", () => {
      // prepare
      const expectedResult = `DiscoverAccounts`;

      // act
      const result = (service as any).command;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("get signature()", () => {
    it("should return correct value", () => {
      // prepare
      const expectedResult =
        `DiscoverAccounts [` + `--source "SOURCE-ADDRESS-OR-PUBKEY"` + `]`;

      // act
      const result = (service as any).signature;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("getStateData()", () => {
    it("should use correct account discovery state values", () => {
      // act
      const data: AccountDiscoveryStateData = (service as any).getStateData();

      // assert
      expect("lastPageNumber" in data).toBe(true);
      expect("lastExecutedAt" in data).toBe(true);
      expect(data.lastExecutedAt).toBe(mockDate.valueOf());
      expect(data.lastPageNumber).toBe(1);
    });
  });

  describe("runAsScheduler()", () => {
    it("should run correctly", async () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn((service as any).configService, "get")
        .mockReturnValueOnce("test-pubkey")
        .mockReturnValueOnce(NetworkType.MAIN_NET);
      const superRun = jest.spyOn(BaseCommand.prototype, "run")
        .mockResolvedValue();
      jest
        .spyOn(PublicAccount, "createFromPublicKey")
        .mockReturnValue({
          address: { plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" }
        } as any);

      // act
      await service.runAsScheduler();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(2);
      expect(configServiceGetCall).toHaveBeenCalledWith("dappPublicKey");
      expect(configServiceGetCall).toHaveBeenCalledWith("network.networkIdentifier");
      expect((service as any).lastExecutedAt).toBe(1643673600000);
      expect(superRun).toHaveBeenNthCalledWith(
        1,
        [],
        {
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: false,
        }
      );
    });
  });

  describe("discover()", () => {
    beforeEach(() => {
      (service as any).logger = logger;
      (service as any).discoverySource = Address.createFromRawAddress("mocked");

      // clear database mocks
      (service as any).model.createStub.mockClear();
      jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: { totalNumberOfTransactions: 200 } } as StateDocument);
      jest
        .spyOn(accountsService, "exists")
        .mockResolvedValue(false);
    });

    it("should use correct configuration and logging", async () => {
      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(logger.debug).toHaveBeenNthCalledWith(
        1,
        "Starting accounts discovery for source " + 
        "\"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY\"", // message
        "discovery:DiscoverAccounts", // <-- + context
      );
      expect(logger.debug).toHaveBeenNthCalledWith(
        2,
        "Last accounts discovery ended with page: \"1\"", // message
        "discovery:DiscoverAccounts", // <-- + context
      );
      expect(logger.debug).toHaveBeenNthCalledWith(
        3,
        "Found 1 new accounts from transactions", // message
        "discovery:DiscoverAccounts", // <-- + context
      );
    });

    it("should stop querying batches of transactions given an empty page", async () => {
      // prepare
      const transactionsServiceFindCall = jest.spyOn(transactionsService, "find").mockResolvedValueOnce({
        data: fakeCreateTransactionDocuments(100), // full page ONCE
      } as PaginatedResultDTO<TransactionDocument>).mockResolvedValueOnce({
        data: [], // empty page
      } as PaginatedResultDTO<TransactionDocument>);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(transactionsServiceFindCall).toHaveBeenCalledTimes(2); // breaks after 2nd
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(1, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 1,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(2, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 2,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
    });

    it("should stop querying batches of transactions given a non-full page", async () => {
      // prepare
      const transactionsServiceFindCall = jest.spyOn(transactionsService, "find").mockResolvedValueOnce({
        data: fakeCreateTransactionDocuments(100), // full page ONCE
      } as PaginatedResultDTO<TransactionDocument>).mockResolvedValueOnce({
        data: fakeCreateTransactionDocuments(20), // not full
      } as PaginatedResultDTO<TransactionDocument>);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(transactionsServiceFindCall).toHaveBeenCalledTimes(2); // breaks after 2nd
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(1, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 1,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(2, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 2,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
    });

    it("should query 10 batches of 100 transactions given full pages", async () => {
      // prepare
      const transactionsServiceFindCall = jest.spyOn(transactionsService, "find").mockResolvedValueOnce({
        data: fakeCreateTransactionDocuments(100), // full page
      } as PaginatedResultDTO<TransactionDocument>);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(transactionsServiceFindCall).toHaveBeenCalledTimes(2);
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(1, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 1,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(2, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 2,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
    });

    it("should read last page number from state data if available", async () => {
      // prepare
      const lastPageNumber = 2;
      (service as any).state = { data: { lastPageNumber } };

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).lastPageNumber).toBe(lastPageNumber);
    });

    it("should has correct lastPageNumber if not available in state data", async () => {
      // prepare
      const lastPageNumber: any = null;
      (service as any).state = {
        data: {
          lastPageNumber,
        }
      }

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).lastPageNumber).toBe(1);
    });

    it("should reset last page number given sync state reached", async () => {
      // prepare
      const lastPageNumber = 3;
      (service as any).state = { data: { lastPageNumber } };
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: { totalNumberOfTransactions: 200 } } as StateDocument);
      const transactionsServiceFindCall = jest
      .spyOn(transactionsService, "find")
        .mockResolvedValue({
          data: fakeCreateTransactionDocuments(3), // page is not full
        } as PaginatedResultDTO<TransactionDocument>);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(stateServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(transactionsServiceFindCall).toHaveBeenCalledTimes(1);
      expect((service as any).lastPageNumber).toBe(2);
    });

    it("should have 0 total transactions if it doesn't exist in state data", async () => {
      // prepare
      const lastPageNumber = 3;
      (service as any).state = { data: { lastPageNumber } };
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: {} } as StateDocument);
      const transactionsServiceFindCall = jest
      .spyOn(transactionsService, "find")
        .mockResolvedValue({
          data: fakeCreateTransactionDocuments(0), // page is not full
        } as PaginatedResultDTO<TransactionDocument>);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(stateServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(transactionsServiceFindCall).toHaveBeenCalledTimes(1);
      expect((service as any).totalNumberOfTransactions).toBe(undefined);
    });

    it("should has correct lastPageNumber if Math.floor is not defined", async () => {
      // prepare
      const lastPageNumber: number = 2;
      (service as any).state = {
        data: {
          lastPageNumber,
        }
      };
      const accountDiscoveryStateData = new AccountDiscoveryStateData();
      (accountDiscoveryStateData as any).totalNumberOfTransactions = 100;
      jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: accountDiscoveryStateData } as StateDocument);
      jest.spyOn(Math, "floor").mockReturnValue(null);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).lastPageNumber).toBe(1);
    });

    it("should check for the existence of discovered address in mongo", async () => {
      // prepare
      (service as any).discoveredAddresses = ["NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"];
      const expectedQuery = new AccountQuery({
        address: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"
      } as AccountDocument);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).accountsService.exists).toHaveBeenCalledWith(expectedQuery);
    });

    // it ("should create a document given non-existing address", async () => {
    //   // prepare
    //   const expectedData = {
    //     address: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    //     referralCode: "JOINFIT-12345678", // getUserReferralCode mocked (L153)
    //   };
    //   (service as any).discoveredAddresses = ["NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"];
    //   (service as any).accountsService.exists = jest.fn().mockReturnValue(false); // force non-existence

    //   // act
    //   await service.discover({
    //     source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
    //     debug: true,
    //   });

    //   // assert
    //   expect((service as any).model.createStub).toHaveBeenCalledTimes(1);
    //   expect((service as any).model.createStub).toHaveBeenCalledWith(expectedData);
    // });

    it("should skip update for known accounts", async () => {
      // prepare
      const accountsServiceExistsCall = jest
        .fn()
        .mockResolvedValue(true);
      (service as any).accountsService.exists = accountsServiceExistsCall;
      const createCall = jest.spyOn(MockModel.prototype, "create");
      const transactionsServiceFindCall = jest
        .fn()
        .mockResolvedValue({
          data: fakeCreateTransactionDocuments(3), // page is not full
        });
      (service as any).transactionsService.find = transactionsServiceFindCall;

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      })

      // assert
      expect(accountsServiceExistsCall).toHaveBeenCalledTimes(1); // addresses are unique
      expect(createCall).toHaveBeenCalledTimes(0);
    });
  });

  describe("getUserReferralCode()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedRandomNumber = Number(0.0007);
      const mathRandomCall = jest
        .spyOn(global.Math, "random")
        .mockReturnValue(expectedRandomNumber);
      const expectedResult = `JOINFIT-bmv7w2zo`;

      // act
      const result = (service as any).getUserReferralCode();

      // assert
      expect(mathRandomCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
