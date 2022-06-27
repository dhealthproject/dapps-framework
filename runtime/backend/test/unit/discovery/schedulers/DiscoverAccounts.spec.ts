/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
//import { TransferTransaction } from "@dhealth/sdk";

// internal dependencies
import {
  NetworkService,
  NodeConnectionPayload,
} from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { StateDocument, StateQuery } from "../../../../src/common/models/StateSchema";
import { AccountsService } from "../../../../src/discovery/services/AccountsService";
import { DiscoverAccounts } from "../../../../src/discovery/schedulers/DiscoverAccounts/DiscoverAccounts";
import { AccountDiscoveryStateData } from "../../../../src/discovery/models/AccountDiscoveryStateData";

// Mocks the full `js-sha3` dependency to avoid
// calls to actual SHA3/Keccak algorithms.
jest.mock("js-sha3", () => ({
  sha3_256: {
    update: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    arrayBuffer: jest.fn(),
  },
}));

// Mocks a subset of "@dhealth/sdk" such as classes:
// - TransferTransaction to define fixed transactionInfo
jest.mock("@dhealth/sdk", () => ({
  TransferTransaction: {
    transactionInfo: {
      hash: "hash3",
      aggregateHash: "hash3",
    },
  },
  PublicAccount: {
    createFromPublicKey: (pk: string, n: number) => ({ address: { plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" } }),
  },
  Address: {
    createFromRawAddress: (a: string) => ({ plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" }),
  }
}));

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

// Mocks the network service's connection adapter
// to avoid actual calls to the nodes and creates
// fake repositories to mimic an established connection
class MockNetworkService extends NetworkService {
  protected connectToNode(
    nodeUrl: string,
    connectionPayload: NodeConnectionPayload,
  ): MockNetworkService {
    this.repositoryFactoryHttp = RepositoryFactoryHttpMock("fake-node");
    this.transactionRepository =
      this.repositoryFactoryHttp.createTransactionRepository();
    this.blockRepository = this.repositoryFactoryHttp.createBlockRepository();
    return this;
  }
}

// Mocks the actual discovery:accounts command to
// allow testing of the `runWithOptions` method.
class MockDiscoverAccounts extends DiscoverAccounts {
  public fakeRunWithOptions(options?: any) {
    return this.runWithOptions(options);
  }
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

  let data: any, saveFn: any, initializeUnorderedBulkOpFn: any;
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
    static aggregate(param: any) {
      return aggregateFn(param);
    }
  }
  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockDiscoverAccounts,
        ConfigService,
        AccountsService,
        QueryService,
        StateService,
        NetworkService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
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

  // describe("discover() -->", () => {
  //   it("should use correct command and configuration", async () => {
  //     // prepare
  //     (service as any).logger = logger;

  //     // act using *PublicAccount* source
  //     await service.discover({
  //       source: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
  //       debug: true,
  //     });

  //     // XXX act using *Address* source in `DiscoveryCommand.spec`

  //     // assert
  //     expect(logger.debug).toBeCalledWith("Starting discovery with \"discovery:accounts\"");
  //     expect(logger.debug).toBeCalledWith("Discovery is tracking the account: \"NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY\"");
  //     expect(logger.debug).toBeCalledWith("Now reading 5 pages including page 1");
  //   });
  // });
});
