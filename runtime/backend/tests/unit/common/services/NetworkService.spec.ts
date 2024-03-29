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
jest.useFakeTimers();

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
    publicKey: string,
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
      providers: [
        NetworkService,
        ConfigService
      ],
    }).compile();

    service = module.get<NetworkService>(NetworkService);
    configService = module.get<ConfigService>(ConfigService);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("constructor()", () => {
    it("should connect to a node if there is a default one", () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue({
          url: "test-url",
          publicKey: "test-publicKey",
        });
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

    it("should not connect to a node if there isn't a default one", () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue(undefined);
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
      expect(connectToNodeCall).toHaveBeenCalledTimes(0);
    });
  });

  describe("getNetworkConfiguration()", () => {
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

  describe("getNetworkCurrency()", () => {
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

  describe("getChainInfo()", () => {
    it("should call delegatePromises() and return first result set", async () => {
      // prepare
      const chainRepositoryGetChainInfoCall = jest.fn()
        .mockReturnValue({ toPromise: jest.fn() } as any);
      service.chainRepository = {
        getChainInfo: chainRepositoryGetChainInfoCall,
      };
      const delegatePromisesCall = jest
        .spyOn(service, "delegatePromises")
        .mockResolvedValue({
          shift: () => ({})
        } as any);

      // act
      const result = await service.getChainInfo();

      // assert
      expect(chainRepositoryGetChainInfoCall).toHaveBeenCalledTimes(1);
      expect(delegatePromisesCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual({});
    });
  });

  describe("getNextAvailableNode()", () => {
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
      };
      const httpServiceCallMock = jest
        .fn()
        .mockResolvedValue({
          data: {
            data: [{ host: "test-url", port: 7903 }]
          }
        });
      (service as any).httpService = {
        call: httpServiceCallMock,
      };

      // act
      const result = await (service as any).getNextAvailableNode();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(2);
      expect(getNodeUrlCall).toHaveBeenCalledTimes(1);
      expect(connectToNodeCall).toHaveBeenCalledTimes(1);
      expect(toPromiseCall).toHaveBeenCalledTimes(1);
      expect(getNodeHealthCall).toHaveBeenCalledTimes(1);
      expect(httpServiceCallMock).toHaveBeenCalledTimes(0);
      expect(result).toStrictEqual({ node: 1 });
    });

    it("should query healthy nodes of network-api if all nodes are unhealthy", async () => {
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
      const expectedResult = { url: "test-url", port: 7903 };
      const httpServiceCallMock = jest
        .fn()
        .mockResolvedValue({
          data: {
            data: [{ host: "test-url", port: 7903 }]
          }
        });
      (service as any).httpService = {
        call: httpServiceCallMock,
      };

      // act
      const result = await (service as any).getNextAvailableNode();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(2);
      expect(getNodeUrlCall).toHaveBeenCalledTimes(2);
      expect(connectToNodeCall).toHaveBeenCalledTimes(2);
      expect(toPromiseCall).toHaveBeenCalledTimes(2);
      expect(getNodeHealthCall).toHaveBeenCalledTimes(2);
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
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
      const httpServiceCallMock = jest
        .fn()
        .mockResolvedValue({
          data: {
            data: []
          }
        });
      (service as any).httpService = {
        call: httpServiceCallMock,
      };

      // act
      const result = await (service as any).getNextAvailableNode();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(2);
      expect(getNodeUrlCall).toHaveBeenCalledTimes(2);
      expect(connectToNodeCall).toHaveBeenCalledTimes(2);
      expect(toPromiseCall).toHaveBeenCalledTimes(2);
      expect(getNodeHealthCall).toHaveBeenCalledTimes(2);
      expect(httpServiceCallMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
  });

  describe("getNodeUrl()", () => {
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

  describe("connectToNode()", () => {
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
        "test-publicKey",
        {}
      );

      // assert
      expect(createBlockRepositoryCall).toHaveBeenCalledTimes(1);
      expect(createChainRepositoryCall).toHaveBeenCalledTimes(1);
      expect(createNodeRepositoryCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(service);
    });
  });

  describe("delegatePromises()", () => {
    it("should call reduce() & set timeout for each sub-promise", async () => {
      // prepare
      const promisesParamValue = [] as Promise<any>[];
      jest.runAllTimers(); // <- explicitly tell jest to run all setTimeout, setInterval
      jest.runAllTicks(); // <- explicitly tell jest to run all Promise callback
      jest.spyOn((promisesParamValue as any), "reduce").mockImplementation(async (...args: unknown[]) => {
        let funct = args[0] as Function;
        await funct();
        jest.runAllTicks(); // <- explicitly tell jest to run all Promise callback
        jest.runOnlyPendingTimers();
        return await Promise.resolve({});
      });

      // act
      const result = await service.delegatePromises(promisesParamValue);

      // assert
      expect(result).toEqual([{}]);
    });

    it("should request to node failed, try with a different node", async () => {
      const promiseAllResults: any[] = [
        [new Error(), []],
        [new Error(), new Error(), new Error(), new Error()]
      ];
      const expectedResults: any[] = [[], new Error("Aborting node requests due to too many trials.")];
      for (let i = 0; i < promiseAllResults.length; i++) {
        // prepare
        jest.clearAllMocks();
        const promiseAllResult = promiseAllResults[i];
        let promiseAllCall = jest.spyOn(Promise, "all");
        for (const promiseAllResultItem of promiseAllResult) {
          if (promiseAllResultItem instanceof Error) {
            promiseAllCall = promiseAllCall.mockRejectedValueOnce(promiseAllResultItem);
          } else {
            promiseAllCall = promiseAllCall.mockResolvedValue(promiseAllResultItem);
          }
        }
        const getNextAvailableNodeCall = jest
          .spyOn((service as any), "getNextAvailableNode")
          .mockReturnValue({});

        // act
        let result;
        if (expectedResults[i] instanceof Error) {
          result = service.delegatePromises(
            [Promise.resolve()]
          );  
        } else {
          result = await service.delegatePromises(
            [Promise.resolve()]
          ); 
        }

        // assert
        if (expectedResults[i] instanceof Error) {
          expect(result).rejects.toThrow(expectedResults[i]);
        } else {
          expect(getNextAvailableNodeCall).toHaveBeenCalledTimes(1);
          expect(promiseAllCall).toHaveBeenCalledTimes(2);
          expect(result).toEqual(expectedResults[i]);
        }
      }
    });
  });
});
