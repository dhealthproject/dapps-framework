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
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { of } from "rxjs";
import { EventEmitter2 } from '@nestjs/event-emitter';

// internal dependencies
import { DiscoverBlocks } from "../../../../src/discovery/schedulers/DiscoverBlocks/DiscoverBlocks";
import { MockModel } from "../../../mocks/global";
import { BlocksService } from "../../../../src/discovery/services/BlocksService";
import { StateService } from "../../../../src/common/services/StateService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { BlockDiscoveryStateData } from "../../../../src/discovery/models/BlockDiscoveryStateData";
import { DiscoveryCommand } from "../../../../src/discovery/schedulers/DiscoveryCommand";
import { Block, BlockDocument, BlockQuery } from "../../../../src/discovery/models/BlockSchema";
import { StateDocument, StateQuery } from "../../../../src/common/models/StateSchema";
import { LogService } from "../../../../src/common/services/LogService";
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
import { DappHelper } from "../../../../src/common/concerns/DappHelper";
import { TransactionDocument, TransactionQuery } from "../../../../src/common/models/TransactionSchema";
import { BlockOrderBy, Order } from "@dhealth/sdk";

describe("discovery/DiscoverBlocks", () => {
  let service: DiscoverBlocks;
  let stateService: StateService;
  let networkService: NetworkService;
  let blocksService: BlocksService;
  let transactionsService: TransactionsService;
  let dappHelper: DappHelper;
  let logger: LogService;

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoverBlocks,
        ConfigService,
        StateService,
        NetworkService,
        BlocksService,
        QueryService,
        EventEmitter2,
        TransactionsService,
        DappHelper,
        {
          provide: getModelToken("Block"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Transaction"),
          useValue: MockModel,
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

    service = module.get<DiscoverBlocks>(DiscoverBlocks);
    stateService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
    blocksService = module.get<BlocksService>(BlocksService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    dappHelper = module.get<DappHelper>(DappHelper);
    logger = module.get<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("get command()", () => {
    it("should return correct value", () => {
      // prepare
      const expectedResult = `DiscoverBlocks`;

      // act
      const result = (service as any).command;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("get signature()", () => {
    it("should return correct value", () => {
      // prepare
      const expectedResult = "DiscoverBlocks";

      // act
      const result = (service as any).signature;

      // assert
      expect(result).toBe(expectedResult);
    });
  });

  describe("getStateData()", () => {
    it("should use correct block discovery state values", () => {
      // prepare
      const expectedResult = new BlockDiscoveryStateData();
      expectedResult.lastPageNumber = 1;
      expectedResult.lastExecutedAt = new Date().valueOf();
      expectedResult.totalNumberOfBlocks = 0;
      (service as any).lastPageNumber = expectedResult.lastPageNumber;
      (service as any).lastExecutedAt = expectedResult.lastExecutedAt;
      (service as any).totalNumberOfBlocks = expectedResult.totalNumberOfBlocks;

      // act
      const data: BlockDiscoveryStateData = (service as any).getStateData();

      // assert
      expect(data).toEqual(expectedResult);
    });
  });

  describe("runAsScheduler()", () => {
    it("should run correctly", async () => {
      // prepare
      const superRunCall = jest
        .spyOn(DiscoveryCommand.prototype, "run")
        .mockResolvedValue();

      // act
      await service.runAsScheduler();

      // assert
      expect((service as any).lastExecutedAt).toBe(1643673600000);
      expect(superRunCall).toHaveBeenNthCalledWith(
        1,
        [],
        {
          debug: false,
        }
      );
    });
  });

  describe("discover()", () => {
    beforeEach(() => {
      (service as any).logger = logger;
    });

    it("should use correct configuration and logging", async () => {
      // prepare
      const debugLogCall = jest
        .spyOn((service as any), "debugLog");
      jest.spyOn(stateService, "findOne")
        .mockResolvedValue(undefined);
      const blockRepository = {
        search: jest.fn().mockReturnValue(of({ data: [] })),
      };
      (networkService as any).blockRepository = blockRepository;
      jest.spyOn(blocksService, "exists").mockResolvedValue(false);
      jest.spyOn((service as any), "synchronizeStateData").mockResolvedValue(true);
      (service as any).lastPageNumber = 1;
      jest.spyOn(transactionsService, "find").mockResolvedValue({
        data: [],
        pagination: {
          pageNumber: 1,
          pageSize: 100,
          total: 0,
        },
        isLastPage: () => true,
      });
      jest.spyOn((service as any), "createRanges").mockReturnValue([]);

      // act
      await service.discover({
        source: null,
        debug: true,
      });

      // assert
      expect(debugLogCall).toHaveBeenNthCalledWith(1, "Starting blocks discovery");
      expect(debugLogCall).toHaveBeenNthCalledWith(2, "Last blocks discovery ended with page: \"1\"");
      expect(debugLogCall).toHaveBeenNthCalledWith(3, "Skipped 0 block entries that already exist");
    });

    it("should skip existing blocks and not save them to database", async ()=> {
      // prepare
      const debugLogCall = jest
      .spyOn((service as any), "debugLog");
      jest.spyOn(stateService, "findOne")
        .mockResolvedValue(undefined);
      const blockRepository = {
        search: jest.fn().mockReturnValue(of({ data: [
          {
            height: { compact: jest.fn().mockReturnValue(7) },
            signer: { address: { plain: () => "test-address" } },
            totalTransactionCount: 1,
          }
        ] })),
      };
      (networkService as any).blockRepository = blockRepository;
      jest.spyOn(blocksService, "exists").mockResolvedValue(true);
      jest.spyOn(transactionsService, "find").mockResolvedValue({
        data: [{ creationBlock: 7 } as TransactionDocument],
        pagination: {
          pageNumber: 1,
          pageSize: 100,
          total: 1,
        },
        isLastPage: () => true,
      });
      jest.spyOn((service as any), "createRanges").mockReturnValue([107]);
      jest.spyOn(dappHelper, "getNetworkTimestampFromUInt64").mockReturnValue(123);
      const blocksServiceCreateOrUpdateBatchCall = jest
        .spyOn(blocksService, "createOrUpdateBatch")
        .mockResolvedValue(0);

      // act
      await service.discover({
        source: null,
        debug: true,
      });

      // assert
      expect(debugLogCall).toHaveBeenNthCalledWith(3, "Skipped 1 block entries that already exist");
      expect(blocksServiceCreateOrUpdateBatchCall).toHaveBeenCalledTimes(0);
    });

    it("should query next page of transactions if last item of current page has been reached", async ()=> {
      // prepare
      jest.spyOn(stateService, "findOne")
        .mockResolvedValue(undefined);
      const blockRepository = {
        search: jest.fn()
          .mockReturnValueOnce(of({ data: [
            {
              height: { compact: () => 7 },
              signer: { address: { plain: () => "test-address" } },
              totalTransactionsCount: 1,
            }
          ] }))
          .mockReturnValue(of({ data: [
            {
              height: { compact: () => 117 },
              signer: { address: { plain: () => "test-address" } },
              totalTransactionsCount: 1,
            },
            {
              height: { compact: () => 277 },
              signer: { address: { plain: () => "test-address" } },
              totalTransactionsCount: 1,
            }
          ] })),
      };
      (networkService as any).blockRepository = blockRepository;
      const blocksServiceExistsCall = jest.spyOn(blocksService, "exists").mockResolvedValue(false);
      const transactionsServiceFindCall = jest.spyOn(transactionsService, "find")
        .mockResolvedValueOnce({
          data: [{ creationBlock: 7 } as TransactionDocument],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1,
          },
          isLastPage: () => false,
        })
        .mockResolvedValue({
          data: [{ creationBlock: 117 }, {creationBlock: 277}] as TransactionDocument[],
          pagination: {
            pageNumber: 2,
            pageSize: 100,
            total: 1,
          },
          isLastPage: () => true,
        });
      const synchronizeStateDataCall = jest.spyOn((service as any), "synchronizeStateData").mockResolvedValue(true);
      (service as any).lastRange = 107;
      (service as any).lastPageNumber = 1;
      (service as any).usePageSize = 100;
      jest.spyOn((service as any), "createRanges")
        .mockReturnValueOnce([107])
        .mockReturnValue([107, 217, 377]);
      jest.spyOn(dappHelper, "getNetworkTimestampFromUInt64").mockReturnValue(123);
      const blocksServiceCreateOrUpdateBatchCall = jest
        .spyOn(blocksService, "createOrUpdateBatch")
        .mockResolvedValue(0);

      // act
      await service.discover({
        source: null,
        debug: true,
      });

      // assert
      expect(synchronizeStateDataCall).toHaveBeenCalledTimes(1);
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(
        1,
        new TransactionQuery({} as TransactionDocument, {
          pageNumber: 1,
          pageSize: 100,
          sort: "creationBlock",
          order: "asc",
        }),
      );
      expect(transactionsServiceFindCall).toHaveBeenNthCalledWith(
        2,
        new TransactionQuery({} as TransactionDocument, {
          pageNumber: 2,
          pageSize: 100,
          sort: "creationBlock",
          order: "asc",
        }),
      );
      expect(blockRepository.search).toHaveBeenNthCalledWith(1, {
        orderBy: BlockOrderBy.Height,
        offset: "217",
        pageSize: 100,
        order: Order.Desc,
        pageNumber: 1,
      });
      expect(blockRepository.search).toHaveBeenNthCalledWith(2, {
        orderBy: BlockOrderBy.Height,
        offset: "377",
        pageSize: 100,
        order: Order.Desc,
        pageNumber: 1,
      });
      expect(blocksServiceExistsCall).toHaveBeenNthCalledWith(
        1,
        new BlockQuery({ height: 117 } as BlockDocument)
      );
      expect(blocksServiceExistsCall).toHaveBeenNthCalledWith(
        2,
        new BlockQuery({ height: 277 } as BlockDocument)
      );
      expect(blocksServiceCreateOrUpdateBatchCall).toHaveBeenNthCalledWith(
        1,
        [
          new Block(117, "test-address", 123, 1),
          new Block(277, "test-address", 123, 1),
        ]
      );
    });
  });

  describe("synchronizeStateData()", () => {
    it("should set service state fields if stateData exists in database", async () => {
      // prepare
      const stateData = {
        lastPageNumber: 1,
        lastExecutedAt: new Date().valueOf(),
        totalNumberOfBlocks: 1,
        lastRange: 1,
      };
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: stateData } as StateDocument);

      // act
      await (service as any).synchronizeStateData();

      // assert
      expect(stateServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new StateQuery({
          name: "discovery:DiscoverBlocks",
        } as StateDocument)
      );
      expect((service as any).lastPageNumber).toEqual(stateData.lastPageNumber);
      expect((service as any).lastExecutedAt).toEqual(stateData.lastExecutedAt);
      expect((service as any).totalNumberOfBlocks).toEqual(stateData.totalNumberOfBlocks);
      expect((service as any).lastRange).toEqual(stateData.lastRange);
    });

    it("should set default values for service state fields if stateData doesn't exist in database", async () => {
      // prepare
      const defaultLastPageNumber = 1;
      const defaultLastExecutedAt = new Date().valueOf();
      const defaultTotalNumberOfBlocks = 0;
      const defaultLastRange = 0;
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({ data: null } as StateDocument);

      // act
      await (service as any).synchronizeStateData();

      // assert
      expect(stateServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        new StateQuery({
          name: "discovery:DiscoverBlocks",
        } as StateDocument)
      );
      expect((service as any).lastPageNumber).toEqual(defaultLastPageNumber);
      expect((service as any).lastExecutedAt).toEqual(defaultLastExecutedAt);
      expect((service as any).totalNumberOfBlocks).toEqual(defaultTotalNumberOfBlocks);
      expect((service as any).lastRange).toEqual(defaultLastRange);
    });
  });

  describe("createRanges()", () => {
    it("should return correct value", () => {
      // prepare
      const blockHeights = [ 9, 10, 177, 186, 199, 288];
      const expectedResult = [ 109, 277, 388 ];

      // act
      const result = (service as any).createRanges(blockHeights);

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});