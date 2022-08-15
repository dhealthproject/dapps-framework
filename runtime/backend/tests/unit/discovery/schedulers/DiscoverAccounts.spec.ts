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
import { Address } from "@dhealth/sdk"; // mocked!
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { QueryParameters } from "../../../../src/common/concerns/Queryable";
import { DappConfig } from "../../../../src/common/models/DappConfig";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { AccountsService } from "../../../../src/discovery/services/AccountsService";
import { AccountDocument, AccountQuery } from "../../../../src/discovery/models/AccountSchema";
import { TransactionDocument, TransactionQuery } from "../../../../src/discovery/models/TransactionSchema";
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
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
  protected stateService: any = { findOne: jest.fn(), updateOne: jest.fn() };

  // mocks the internal AccountsService
  protected accountsService: any = {
    exists: jest.fn(),
  };

  // mocks the internal TransactionsService
  protected transactionsService: any = {
    updateBatch: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn().mockReturnValue({ data: [] }),
    createOrUpdate: jest.fn(),
  };

  // mocks **getters** for protected properties
  public getDiscoveredAddresses(): string[] { return this.discoveredAddresses; }
}

/**
 * @todo extract mocks to mocks concern
 * @todo re-write tests to use **way** less `any` typings
 */
describe("discovery/DiscoverAccounts", () => {
  let service: MockDiscoverAccounts;
  let configService: ConfigService;
  let accountsService: AccountsService;
  let transactionsService: TransactionsService;
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
        TransactionsService,
        QueryService,
        StateService,
        NetworkService,
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
    transactionsService = module.get<TransactionsService>(TransactionsService);
    statesService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
    logger = module.get<Logger>(Logger);

    // overwrites the internal model (injected)
    (service as any).model = new MockModel();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
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

  describe("discover()", () => {
    beforeEach(() => {
      (service as any).logger = logger;
      (service as any).discoverySource = Address.createFromRawAddress("mocked");

      // clear database mocks
      (service as any).model.createStub.mockClear();
    });

    it("should use correct configuration and logging", async () => {
      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(logger.debug).toHaveBeenNthCalledWith(1, "Starting accounts discovery for source \"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY\"");
      expect(logger.debug).toHaveBeenNthCalledWith(2, "Last accounts discovery ended with page: \"1\"");
      expect(logger.debug).toHaveBeenNthCalledWith(3, "Found 0 new accounts from transactions");
      expect(logger.debug).toHaveBeenNthCalledWith(4, "Skipped 0 account(s) that already exist");
    });

    it("should query 10 batches of 100 transactions of any type", async () => {
      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).transactionsService.find).toHaveBeenCalledTimes(10); // reads 10 pages
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(1, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 1,
          pageSize: 100, // in batches of 100 per page
        } as QueryParameters,
      ));
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(2, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 2,
          pageSize: 100, // in batches of 100 per page
        } as QueryParameters,
      ));
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

    it ("should create a document given non-existing address", async () => {
      // prepare
      const expectedData = { address: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" };
      (service as any).discoveredAddresses = ["NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"];
      (service as any).accountsService.exists = jest.fn().mockReturnValue(false); // force non-existence

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).model.createStub).toHaveBeenCalledTimes(1);
      expect((service as any).model.createStub).toHaveBeenCalledWith(expectedData);
    });
  });
});
