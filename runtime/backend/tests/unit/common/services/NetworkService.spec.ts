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
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import {
  NetworkService,
  NetworkConnectionPayload,
} from "../../../../src/common/services/NetworkService";

const createTransactionRepositoryCall: any = jest.fn(
  (url) => () => `transactionRepository-${url}`,
);
const createBlockRepositoryCall: any = jest.fn(
  (url) => () => `blockRepository-${url}`,
);
const createChainRepositoryCall: any = jest.fn(
  (url) => () => `chainRepository-${url}`,
);
const createNodeRepositoryCall: any = jest.fn(
  (url) => () => `nodeRepository-${url}`,
);
const RepositoryFactoryHttpMock: any = jest.fn((url) => ({
  createTransactionRepository: createTransactionRepositoryCall(url),
  createBlockRepository: createBlockRepositoryCall(url),
  createChainRepository: createChainRepositoryCall(url),
  createNodeRepository: createNodeRepositoryCall(url),
}));

// Mocks the network service's connection adapter
// to avoid actual calls to the nodes and creates
// fake repositories to mimic an established connection
class MockNetworkService extends NetworkService {
  protected connectToNode(
    nodeUrl: string,
    connectionPayload: NetworkConnectionPayload,
  ): MockNetworkService {
    this.repositoryFactoryHttp = RepositoryFactoryHttpMock("fake-node");
    this.transactionRepository =
      this.repositoryFactoryHttp.createTransactionRepository();
    this.blockRepository = this.repositoryFactoryHttp.createBlockRepository();
    return this;
  }
}

describe("common/NetworkService", () => {
  let service: MockNetworkService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockNetworkService, ConfigService],
    }).compile();

    service = module.get<MockNetworkService>(MockNetworkService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getBlockTimestamp() -->", () => {
    it("should have correct flow and result when response is not empty", async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve({}),
      }));
      (service as any).blockRepository = {
        getBlockByHeight: getBlockByHeightCall,
      };
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, "getNetworkTimestampFromUInt64")
        .mockReturnValue(1);
      const result = await service.getBlockTimestamp(1);
      expect(getBlockByHeightCall).toBeCalled();
      expect(getNetworkTimestampFromUInt64Call).toBeCalled();
      expect(result).toEqual(1000);
    });

    it("should throw correct error when response is empty", async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve(),
      }));
      (service as any).blockRepository = {
        getBlockByHeight: getBlockByHeightCall,
      };
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, "getNetworkTimestampFromUInt64")
        .mockReturnValue(1);
      await service.getBlockTimestamp(1).catch((err: Error) => {
        expect(getBlockByHeightCall).toBeCalled();
        expect(getNetworkTimestampFromUInt64Call).toBeCalledTimes(0);
        expect(err.message).toEqual("Cannot query block from height");
      });
    });
  });

  describe("getNetworkTimestampFromUInt64() -->", () => {
    it("should have correct flow and result", () => {
      const timestamp = { compact: () => 1000 };
      const configGetCall = jest.spyOn(configService, "get").mockReturnValue(1);
      const expectedResult = timestamp.compact() / 1000 + 1;
      const result = service.getNetworkTimestampFromUInt64(timestamp as any);
      expect(configGetCall).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
