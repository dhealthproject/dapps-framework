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
// - Address to always return a valid Address
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
import { Address, PublicAccount } from "@dhealth/sdk"; // mocked!
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { createTransactionDocument, MockModel } from "../../../mocks/global";
import { QueryParameters } from "../../../../src/common/concerns/Queryable";
import { DappConfig } from "../../../../src/common/models/DappConfig";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { TransactionDocument, TransactionQuery } from "../../../../src/common/models/TransactionSchema";
import { AssetsService } from "../../../../src/discovery/services/AssetsService";
import { AssetDocument, AssetQuery } from "../../../../src/discovery/models/AssetSchema";
import { AssetDTO } from "../../../../src/discovery/models/AssetDTO";
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
import { DiscoverAssets } from "../../../../src/discovery/schedulers/DiscoverAssets/DiscoverAssets";
import { AssetDiscoveryStateData } from "../../../../src/discovery/models/AssetDiscoveryStateData";
import { DiscoveryCommand } from "../../../../src/discovery/schedulers/DiscoveryCommand";
import { StateDocument } from "../../../../src/common/models/StateSchema";

// configuration resources
import dappConfigLoader from "../../../../config/dapp";

// Mocks the actual discovery:DiscoverAssets command to
// allow testing of the `runWithOptions` method.
class MockDiscoverAssets extends DiscoverAssets {
  public realRunWithOptions(options?: any) {
    return this.runWithOptions(options);
  }

  // mocks the internal StateService
  protected stateService: any = { findOne: jest.fn(), updateOne: jest.fn() };

  // mocks the internal AssetsService
  protected assetsService: any = {
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
  public getDiscoveredAssets(): AssetDTO[] { return this.discoveredAssets; }
}

// Mocks a transaction factory to create valid and
// invalid transaction pages from database queries.
const fakeCreateTransactionDocuments = (
  x: number = 20,
  transactionMode?: string,
): TransactionDocument[] => {
  const output: TransactionDocument[] = [];
  for (let i = 0; i < x; i++) {
    output.push(createTransactionDocument(`fakeHash${i+1}`, transactionMode));
  }
  return output;
}

/**
 * @todo extract mocks to mocks concern
 * @todo re-write tests to use **way** less `any` typings
 */
describe("discovery/DiscoverAssets", () => {
  let service: MockDiscoverAssets;
  let configService: ConfigService;
  let assetsService: AssetsService;
  let transactionsService: TransactionsService;
  let statesService: StateService;
  let networkService: NetworkService;
  let logger: Logger;
  let expectedDappConfig: DappConfig = dappConfigLoader();

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(2022, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AssetsService,
        TransactionsService,
        QueryService,
        StateService,
        NetworkService,
        {
          provide: getModelToken("Asset"),
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
        MockDiscoverAssets,
      ],
    }).compile();

    service = module.get<MockDiscoverAssets>(MockDiscoverAssets);
    configService = module.get<ConfigService>(ConfigService);
    assetsService = module.get<AssetsService>(AssetsService);
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

  describe("get command()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = "DiscoverAssets";

      // act
      const result = (service as any).command;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("get signature()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = `DiscoverAssets [--source "SOURCE-ADDRESS-OR-PUBKEY"]`;

      // act
      const result = (service as any).signature;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("getStateData()", () => {
    it("should use correct asset discovery state values", () => {
      // act
      const data: AssetDiscoveryStateData = (service as any).getStateData();

      // assert
      expect("lastPageNumber" in data).toBe(true);
      expect("lastExecutedAt" in data).toBe(true);
      expect(data.lastExecutedAt).toBe(mockDate.valueOf());
      expect(data.lastPageNumber).toBe(1);
    });
  });

  describe("runAsScheduler()", () => {
    it("should call correct methods", async () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValueOnce("test-pubkey")
        .mockReturnValue(104);

      const createFromPublicKeyCall = jest
        .spyOn(PublicAccount, "createFromPublicKey")
        .mockReturnValue({
          address: { plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" }
        } as PublicAccount);

      const superRunCall = jest
        .spyOn(DiscoveryCommand.prototype, "run")
        .mockResolvedValue();

      // act
      await service.runAsScheduler();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(2);
      expect(createFromPublicKeyCall).toHaveBeenCalledTimes(1);
      expect(superRunCall).toHaveBeenNthCalledWith(
        1,
        [],
        {
          source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          debug: true,
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
    });

    it("should use correct configuration and logging", async () => {
      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(logger.debug).toHaveBeenNthCalledWith(1, "Starting assets discovery for source \"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY\"");
      expect(logger.debug).toHaveBeenNthCalledWith(2, "Last assets discovery ended with page: \"1\"");
      expect(logger.debug).toHaveBeenNthCalledWith(3, "Found 0 new asset entries from transactions");
    });

    it("should set lastPageNumber if state data is available", async () => {
      // prepare
      (service as any).state = {
        data: {
          lastPageNumber: 1
        }
      };

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).lastPageNumber).toBe(1);
    });

    it("should set correct lastPageNumber based on totalNumberOfTransactions", async () => {
      // prepare
      const statesServiceFindOneCall = jest
        .fn()
        .mockResolvedValue({
          data: {
            totalNumberOfTransactions: 200,
          }
        } as StateDocument);
      (service as any).stateService.findOne = statesServiceFindOneCall;
      (service as any).lastPageNumber = 3;
      (service as any).lastPageNumber = 100;

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(statesServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect((service as any).lastPageNumber).toBe(3);
    });

    it("should skip update for known assets if document exists", async () => {
      // prepare
      (service as any).transactionsService.find = jest.fn().mockReturnValueOnce({
        data: fakeCreateTransactionDocuments(100, "outgoing"), // full page ONCE
      }).mockReturnValueOnce({
        data: [], // empty page
      });
      const existsCall = (service as any).assetsService.exists = jest.fn().mockResolvedValue(true);
      const debugLogCall = jest.spyOn((service as any), "debugLog");
      const expectedDebugLog = `Skipped 1 asset entries that already exist`

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect(existsCall).toHaveBeenCalledTimes(1);
      expect(debugLogCall).toHaveBeenLastCalledWith(expectedDebugLog);
    });

    it("should stop querying batches of transactions given an empty page", async () => {
      // prepare
      (service as any).transactionsService.find = jest.fn().mockReturnValueOnce({
        data: fakeCreateTransactionDocuments(100, "outgoing"), // full page ONCE
      }).mockReturnValueOnce({
        data: [], // empty page
      });

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).transactionsService.find).toHaveBeenCalledTimes(2); // breaks after 2nd
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(1, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 1,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(2, new TransactionQuery(
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
      (service as any).transactionsService.find = jest.fn().mockReturnValueOnce({
        data: fakeCreateTransactionDocuments(100), // full page ONCE
      }).mockReturnValueOnce({
        data: fakeCreateTransactionDocuments(20), // not full
      });

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).transactionsService.find).toHaveBeenCalledTimes(2); // breaks after 2nd
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(1, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 1,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(2, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 2,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
    });

    it("should query 20 batches of 100 transactions given full pages", async () => {
      // prepare
      (service as any).transactionsService.find = jest.fn().mockReturnValue({
        data: fakeCreateTransactionDocuments(100), // full page
      });

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).transactionsService.find).toHaveBeenCalledTimes(20); // reads 20 pages
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(1, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 1,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
      expect((service as any).transactionsService.find).toHaveBeenNthCalledWith(2, new TransactionQuery(
        {} as TransactionDocument, // queries *any* transaction
        {
          pageNumber: 2,
          pageSize: 100, // in batches of 100 per page
          sort: "createdAt",
          order: "asc",
        } as QueryParameters,
      ));
    });

    it("should check for the existence of discovered assets in mongo", async () => {
      // prepare
      (service as any).discoveredAssets = [
        { transactionHash: "fake-hash", assetId: "fake-asset-id", amount: 1 }
      ];
      const expectedQuery = new AssetQuery({
        transactionHash: "fake-hash",
        mosaicId: "fake-asset-id",
      } as AssetDocument);

      // act
      await service.discover({
        source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        debug: true,
      });

      // assert
      expect((service as any).assetsService.exists).toHaveBeenCalledWith(expectedQuery);
    });

    it ("should create a document given non-existing asset", async () => {
      // prepare
      const expectedData = {
        transactionHash: "fake-hash",
        userAddress: "fake-address",
        mosaicId: "fake-mosaic-id",
        amount: 1,
        creationBlock: 1,
      };
      (service as any).discoveredAssets = [
        {
          transactionHash: "fake-hash",
          userAddress: "fake-address",
          assetId: "fake-mosaic-id",
          amount: 1,
          creationBlock: 1,
        }
      ];
      (service as any).assetsService.exists = jest.fn().mockReturnValue(false); // force non-existence

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
