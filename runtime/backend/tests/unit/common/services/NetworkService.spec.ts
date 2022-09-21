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
import { Currency, NetworkCurrencies, RepositoryFactoryHttp } from "@dhealth/sdk";
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
  let service: NetworkService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkService, ConfigService],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("constructor() -->", () => {
    it("should connect to a node if there is a default one", () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue("test-url");
      const getNetworkConfigurationCall = jest
        .spyOn(MockNetworkService.prototype, "getNetworkConfiguration")
        .mockReturnValue({} as any);
      const connectToNodeCall = jest
        .fn()
        .mockReturnValue(undefined);
      (MockNetworkService.prototype as any).connectToNode = connectToNodeCall;

      // act
      new MockNetworkService(configService);

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(1);
      expect(getNetworkConfigurationCall).toHaveBeenCalledTimes(1);
      expect(connectToNodeCall).toHaveBeenCalledTimes(1);
    });
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

  describe("getNetworkConfiguration() -->", () => {
    it("should return empty result if network parameters is undefined", () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue(undefined);

      // act
      const result = service.getNetworkConfiguration();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({});
    });

    it("should return correct result", () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue({
          generationHash: "test-generationHash",
          epochAdjustment: 1,
          networkIdentifier: 104,
          mosaicId: "test-mosaic-id",
          divisibility: 6,
        });
      const getNetworkCurrencyCall = jest
        .spyOn(service, "getNetworkCurrency")
        .mockReturnValue({} as any);

      // act
      const result = service.getNetworkConfiguration();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(2);
      expect(getNetworkCurrencyCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        generationHash: "test-generationHash",
        epochAdjustment: 1,
        networkIdentifier: 104,
        networkCurrencies: (new NetworkCurrencies(null, null))
      });
    });
  });

  describe("getNetworkCurrency() -->", () => {
    it("should return correct result", () => {
      // prepare
      const currencyMosaicId = "test-mosaicId";
      const tokenDivisibility = 6;
      const expectedResult = {} as Currency;

      // act
      const result = service.getNetworkCurrency(currencyMosaicId, tokenDivisibility);

      // assert
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe("getNextAvailableNode() -->", () => {
    it("return node if node is healthy", async () => {
      // prepare
      const configServiceGetCall = jest
        .fn()
        .mockReturnValue([{ node: 1 }, { node: 2 }]);
      (service as any).configService = {
        get: configServiceGetCall,
      };
      const getNodeUrlCall = jest
        .spyOn((service as any), "getNodeUrl")
        .mockReturnValue("test-url");
      const connectToNodeCall = jest
        .spyOn((service as any), "connectToNode")
        .mockResolvedValue(true);
      const toPromiseCall = jest.fn().mockResolvedValue({
        apiNode: "up",
        db: "up",
      });
      const getNodeHealthCall = jest.fn().mockReturnValue({
        toPromise: toPromiseCall,
      });
      (service as any).nodeRepository = {
        getNodeHealth: getNodeHealthCall,
      }

      // act
      const result = await (service as any).getNextAvailableNode();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(1);
      expect(getNodeUrlCall).toHaveBeenCalledTimes(1);
      expect(connectToNodeCall).toHaveBeenCalledTimes(1);
      expect(toPromiseCall).toHaveBeenCalledTimes(1);
      expect(getNodeHealthCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ node: 1 });
    });

    it("should fallback to current node if all nodes are unhealthy", async () => {
      // prepare
      const configServiceGetCall = jest
        .fn()
        .mockReturnValue([{ node: 1 }, { node: 2 }]);
      (service as any).configService = {
        get: configServiceGetCall,
      };
      const getNodeUrlCall = jest
        .spyOn((service as any), "getNodeUrl")
        .mockReturnValue("test-url");
      const connectToNodeCall = jest
        .spyOn((service as any), "connectToNode")
        .mockResolvedValue(true);
      const toPromiseCall = jest.fn().mockResolvedValue({
        apiNode: "down",
        db: "down",
      });
      const getNodeHealthCall = jest.fn().mockReturnValue({
        toPromise: toPromiseCall,
      });
      (service as any).nodeRepository = {
        getNodeHealth: getNodeHealthCall,
      };
      const expectedResult = { node: "expected" };
      (service as any).currentNode = expectedResult;

      // act
      const result = await (service as any).getNextAvailableNode();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(1);
      expect(getNodeUrlCall).toHaveBeenCalledTimes(2);
      expect(connectToNodeCall).toHaveBeenCalledTimes(2);
      expect(toPromiseCall).toHaveBeenCalledTimes(2);
      expect(getNodeHealthCall).toHaveBeenCalledTimes(2);
      expect(result).toBe(expectedResult);
    });
  });

  describe("getNodeUrl() -->", () => {
    it("should return URL when the URL already contains a port", () => {
      // prepare
      const expectedResult = "http://test.url:3000";

      // act
      const result = (service as any).getNodeUrl({
        url: "http://test.url:3000",
        port: 3000,
      });

      // assert
      expect(result).toBe(expectedResult);
    });

    it("use port from payload when payload has port field", () => {
      // prepare
      const expectedResult = "https://test.url:3001";

      // act
      const result = (service as any).getNodeUrl({
        url: "https://test.url",
        port: 3001,
      });

      // assert
      expect(result).toBe(expectedResult);
    });

    it("fallback to default port if payload doesn't have port", () => {
      // prepare
      const expectedResult = "http://test.url:3000";

      // act
      const result = (service as any).getNodeUrl({
        url: "http://test.url",
      });

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("connectToNode() -->", () => {
    it("should call correct methods", () => {
      // prepare
      const createBlockRepositoryCall = jest
        .spyOn(RepositoryFactoryHttp.prototype, "createBlockRepository");
      const createChainRepositoryCall = jest
        .spyOn(RepositoryFactoryHttp.prototype, "createChainRepository");
      const createNodeRepositoryCall = jest
        .spyOn(RepositoryFactoryHttp.prototype, "createNodeRepository");

      // act
      const result = (service as any).connectToNode(
        "test-url",
        {}
      );

      // assert
      expect(createBlockRepositoryCall).toHaveBeenCalledTimes(1);
      expect(createChainRepositoryCall).toHaveBeenCalledTimes(1);
      expect(createNodeRepositoryCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(service);
    });
  });

  describe("delegatePromises() -->", () => {
    it("should request to node failed, try with a different node", async () => {
      // prepare
      const promiseAllCall = jest
        .spyOn(Promise, "all")
        .mockRejectedValueOnce(new Error())
        .mockResolvedValue([]);
      const getNextAvailableNodeCall = jest
        .spyOn((service as any), "getNextAvailableNode")
        .mockReturnValue({});

      // act
      const result = await service.delegatePromises(
        [Promise.resolve()]
      );

      // assert
      expect(getNextAvailableNodeCall).toHaveBeenCalledTimes(1);
      expect(promiseAllCall).toHaveBeenCalledTimes(2);
      expect(result).toEqual([]);
    });
  });
});
