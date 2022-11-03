/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mock operation type
let getOperationCall = jest.fn().mockReturnValue({
  signature: "elevate:test",
});
jest.mock("../../../../src/processor/models/OperationTypes", () => ({
  getOperation: getOperationCall,
}));

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from '@nestjs/event-emitter';

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { ProcessOperations } from "../../../../src/processor/schedulers/ProcessOperations/ProcessOperations";
import { StateService } from "../../../../src/common/services/StateService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { TransactionDocument, TransactionModel } from "../../../../src/common/models/TransactionSchema";
import { OperationsService } from "../../../../src/processor/services/OperationsService";
import { StateDocument } from "../../../../src/common/models/StateSchema";
import { OperationProcessorStateData } from "../../../../src/processor/models/OperationProcessorStateData";
import { LogService } from "../../../../src/common/services/LogService";


describe("processor/ProcessOperations", () => {
  let processOperations: ProcessOperations;
  let configService: ConfigService;
  let stateService: StateService;
  let networkService: NetworkService;
  let queriesService: QueryService<TransactionDocument, TransactionModel>;
  let operationsService: OperationsService;
  let logger: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessOperations,
        ConfigService,
        StateService,
        NetworkService,
        QueryService,
        OperationsService,
        EventEmitter2,
        {
          provide: getModelToken("Operation"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Transaction"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ]
    }).compile();

    processOperations = module.get<ProcessOperations>(ProcessOperations);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
    queriesService = module.get<QueryService<TransactionDocument, TransactionModel>>(QueryService);
    operationsService = module.get<OperationsService>(OperationsService);
    logger = module.get<LogService>(LogService);
  });

  it("should be defined", () => {
    expect(processOperations).toBeDefined();
  });

  describe("get command()", () => {
    it("should return correct result", () => {
      // act
      const result = (processOperations as any).command;

      // assert
      expect(result).toBe("ProcessOperations");
    });
  });

  describe("get signature()", () => {
    it("should return correct result", () => {
      // act
      const result = (processOperations as any).signature;

      // assert
      expect(result).toBe("ProcessOperations auth|earn|referral|welcome");
    });
  });

  describe("getStateData()", () => {
    it("should return correct result", () => {
      // prepare
      const totalOperations = 1;
      (processOperations as any).totalNumberOfOperations =totalOperations;
      const expectedResult = new OperationProcessorStateData();
      expectedResult.totalNumberOfOperations = totalOperations;

      // act
      const result =(processOperations as any).getStateData();

      // assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe("parseOperationTypes()", () => {
    it("should return correct result for elevate operations", () => {
      // prepare
      const operationType = "elevate:test";

      // act
      const result = (processOperations as any).parseOperationTypes(operationType);

      // assert
      expect(result).toEqual([operationType]);
    });

    it("should return empty list if not elevate operations", () => {
      // prepare
      const operationType = "something-else:test";

      // act
      const result = (processOperations as any).parseOperationTypes(operationType);

      // assert
      expect(result).toEqual([]);
    });
  });

  describe("runAsScheduler()", () => {
    it("should call correct methods and return correct result", async () => {
      // prepare
      const contract = "elevate:test";
      const operation = { contract: "elevate:test"};
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValueOnce([contract])
        .mockReturnValueOnce([operation]);
      const serviceRunCall = jest
        .spyOn(processOperations, "run")
        .mockResolvedValue();
      const serviceDebugCall = jest
        .spyOn((processOperations as any), "debugLog");

      // act
      await processOperations.runAsScheduler();

      // assert
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "contracts");
      expect(configServiceGetCall).toHaveBeenNthCalledWith(2, "operations");
      expect(serviceDebugCall).toHaveBeenNthCalledWith(1, `Starting operations processor for contracts: ${contract}`);
      expect(serviceDebugCall).toHaveBeenNthCalledWith(2, `Total number of operations processed: "0"`);
      expect(serviceRunCall).toHaveBeenNthCalledWith(
        1,
        [contract],
        {
          contract,
          operation,
          debug: false,
        },
      );
    });

    it("should process nothing if configuration is empty", async () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValueOnce([])
        .mockReturnValueOnce([]);
      const serviceRunCall = jest
        .spyOn(processOperations, "run")
        .mockResolvedValue();
      const serviceDebugCall = jest
        .spyOn((processOperations as any), "debugLog");

      // act
      await processOperations.runAsScheduler();

      // assert
      expect(configServiceGetCall).toHaveBeenCalledTimes(2);
      expect(serviceDebugCall).toHaveBeenCalledTimes(0);
      expect(serviceRunCall).toHaveBeenCalledTimes(0);
    });

    it("should skip processing if operation contract doesn't exist in configured contracts.", async () => {
      // prepare
      const contract = "elevate:test";
      const operation = { contract: "elevate:test2"};
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValueOnce([contract])
        .mockReturnValueOnce([operation]);
      const serviceRunCall = jest
        .spyOn(processOperations, "run")
        .mockResolvedValue();
      const serviceDebugCall = jest
        .spyOn((processOperations as any), "debugLog");

      // act
      await processOperations.runAsScheduler();

      // assert
      expect(configServiceGetCall).toHaveBeenNthCalledWith(1, "contracts");
      expect(configServiceGetCall).toHaveBeenNthCalledWith(2, "operations");
      expect(serviceDebugCall).toHaveBeenNthCalledWith(1, `Starting operations processor for contracts: ${contract}`);
      expect(serviceDebugCall).toHaveBeenNthCalledWith(2, `Total number of operations processed: "0"`);
      expect(serviceDebugCall).toHaveBeenNthCalledWith(3, `Aborting operations processor for contract "${contract}" due to missing configuration.`);
      expect(serviceRunCall).toHaveBeenCalledTimes(0);
    });
  });

  describe("process()", () => {
    it("should exclude contract if any error was caught while filtering", async () => {
      // prepare
      (processOperations as any).contractsByHash = null;
      (processOperations as any).logger = logger;
      const contract = "elevate:test";
      const operation = {
        contract: "elevate:test",
        label: "test-label",
        query: {} as TransactionDocument,
      };
      (processOperations as any).state = {
        data: { totalNumberOfOperations: 100 },
      };
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: {
          lastPageNumber: 1,
        } } as StateDocument);
      const queriesServiceFindCall = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue({
          data: [{
            transactionHash: "test-transactionHash",
            transactionMessage: "elevate:test",
          } as TransactionDocument],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1,
          },
          isLastPage: () => true,
        });
      const operationsServiceExistsCall = jest
        .spyOn(operationsService, "exists")
        .mockResolvedValueOnce(true)
        .mockResolvedValue(false);
      const stateServiceUpdateOneCall = jest
        .spyOn(stateService, "updateOne")
        .mockResolvedValue({} as StateDocument);

      // act
      await processOperations.process({
        contract,
        operation,
        debug: true,
      });

      // assert
      expect(stateServiceFindOneCall).toHaveBeenCalledTimes(2);
      expect(queriesServiceFindCall).toHaveBeenCalledTimes(1);
      expect(operationsServiceExistsCall).toHaveBeenCalledTimes(0);
      expect((processOperations as any).model.createStub).toHaveBeenCalledTimes(0);
      expect(stateServiceUpdateOneCall).toHaveBeenCalledTimes(1);
    });

    it("should correctly set lastPageNumber", async () => {
      // prepare
      (processOperations as any).contractsByHash = null;
      (processOperations as any).logger = logger;
      const contract = "elevate:test";
      const operation = {
        contract: "elevate:test",
        label: "test-label",
        query: {} as TransactionDocument,
      };
      (processOperations as any).state = {
        data: {},
      };
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: {
          totalNumberOfTransactions: 1,
          lastPageNumber: null,
        } } as StateDocument);
      const queriesServiceFindCall = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue({
          data: [{
            transactionHash: "test-transactionHash",
            transactionMessage: "elevate:test",
          } as TransactionDocument],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1,
          },
          isLastPage: () => true,
        });
      const operationsServiceExistsCall = jest
        .spyOn(operationsService, "exists")
        .mockResolvedValueOnce(true)
        .mockResolvedValue(false);
      const stateServiceUpdateOneCall = jest
        .spyOn(stateService, "updateOne")
        .mockResolvedValue({} as StateDocument);
      (processOperations as any).state = {
        data: { totalNumberOfOperations: null },
      };

      // act
      await processOperations.process({
        contract,
        operation,
        debug: true,
      });

      // assert
      expect(stateServiceFindOneCall).toHaveBeenCalledTimes(2);
      expect(queriesServiceFindCall).toHaveBeenCalledTimes(1);
      expect(operationsServiceExistsCall).toHaveBeenCalledTimes(0);
      expect((processOperations as any).model.createStub).toHaveBeenCalledTimes(0);
      expect(stateServiceUpdateOneCall).toHaveBeenCalledTimes(1);
      expect((processOperations as any).lastPageNumber).toBe(0);
    });

    it("should run correctly call correct methods", async () => {
      // prepare
      (processOperations as any).logger = logger;
      const contract = "elevate:test";
      const operation = {
        contract: "elevate:test",
        label: "test-label",
        query: {} as TransactionDocument,
      };
      (processOperations as any).state = {
        data: { totalNumberOfOperations: 100 },
      };
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: {} } as StateDocument);
      const queriesServiceFindCall = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue({
          data: [
            {
              transactionHash: "test-transactionHash1",
              transactionMessage: "elevate:test",
            } as TransactionDocument,
            {
              transactionHash: "test-transactionHash2",
              transactionMessage: "elevate:test",
            } as TransactionDocument,
          ],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1,
          },
          isLastPage: () => true,
        });
      const operationsServiceExistsCall = jest
        .spyOn(operationsService, "exists")
        .mockResolvedValueOnce(true)
        .mockResolvedValue(false);
      const stateServiceUpdateOneCall = jest
        .spyOn(stateService, "updateOne")
        .mockResolvedValue({} as StateDocument);

      // act
      await processOperations.process({
        contract,
        operation,
        debug: true,
      });

      // assert
      expect(stateServiceFindOneCall).toHaveBeenCalledTimes(2);
      expect(queriesServiceFindCall).toHaveBeenCalledTimes(1);
      expect(operationsServiceExistsCall).toHaveBeenCalledTimes(2);
      expect((processOperations as any).model.createStub).toHaveBeenCalledTimes(1);
      expect(stateServiceUpdateOneCall).toHaveBeenCalledTimes(1);
    });
  });

  describe("extractUserAddress()", () => {
    it("should return correct result for incoming transactions", () => {
      // prepare
      const transaction = {
        transactionMode: "incoming",
        recipientAddress: "test-recipientAddress",
        signerAddress: "test-signerAddress",
      };

      // act
      const result = (processOperations as any).extractUserAddress(transaction);

      // assert
      expect(result).toBe(transaction.signerAddress);
    });

    it("should return correct result for outgoing transactions", () => {
      // prepare
      const transaction = {
        transactionMode: "outgoing",
        recipientAddress: "test-recipientAddress",
        signerAddress: "test-signerAddress",
      };

      // act
      const result = (processOperations as any).extractUserAddress(transaction);

      // assert
      expect(result).toBe(transaction.recipientAddress);
    });
  });

  describe("extractTransactionHash()", () => {
    it("should return correct result", () => {
      // prepare
      const transaction = {
        transactionHash: "test-transactionHash",
      };

      // act
      const result = (processOperations as any).extractTransactionHash(transaction);

      // asset
      expect(result).toBe(transaction.transactionHash);
    });
  });

  describe("extractTransactionBlock()", () => {
    it("should return correct result", () => {
      // prepare
      const transaction = {
        creationBlock: 100,
      };

      // act
      const result = (processOperations as any).extractTransactionBlock(transaction);

      // asset
      expect(result).toBe(transaction.creationBlock);
    });
  });
});