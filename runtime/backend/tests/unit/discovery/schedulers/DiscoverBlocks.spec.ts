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
import { Logger } from "@nestjs/common";
import { of } from "rxjs";

// internal dependencies
import { DiscoverBlocks } from "../../../../src/discovery/schedulers/DiscoverBlocks/DiscoverBlocks";
import { MockModel } from "../../../mocks/global";
import { BlocksService } from "../../../../src/discovery/services/BlocksService";
import { StateService } from "../../../../src/common/services/StateService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { BlockDiscoveryStateData } from "../../../../src/discovery/models/BlockDiscoveryStateData";
import { DiscoveryCommand } from "../../../../src/discovery/schedulers/DiscoveryCommand";
import { BlockDocument, BlockQuery } from "../../../../src/discovery/models/BlockSchema";
import { StateDocument } from "../../../../src/common/models/StateSchema";

describe("discovery/DiscoverBlocks", () => {
  let service: DiscoverBlocks;
  let stateService: StateService;
  let networkService: NetworkService;
  let blocksService: BlocksService;
  let logger: Logger;

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
        {
          provide: getModelToken("Block"),
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

    service = module.get<DiscoverBlocks>(DiscoverBlocks);
    stateService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
    blocksService = module.get<BlocksService>(BlocksService);
    logger = module.get<Logger>(Logger);
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
      // act
      const data: BlockDiscoveryStateData = (service as any).getStateData();

      // assert
      expect("lastPageNumber" in data).toBe(true);
      expect("lastExecutedAt" in data).toBe(true);
      expect("totalNumberOfBlocks" in data).toBe(true);
      expect(data.lastExecutedAt).toBe(mockDate.valueOf());
      expect(data.lastPageNumber).toBe(1);
      expect(data.totalNumberOfBlocks).toBe(0);
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
          debug: true,
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

    it("should continue from last page number from state data", async () => {
      // prepare
      const stateServiceFindOneCall = jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({
          data: {
            totalNumberOfBlocks: 7
          }
        } as StateDocument);
      const blockRepository = {
        search: jest.fn().mockReturnValue(of({ data: [
          {
            height: { compact: () => 77 },
            signer: { address: { plain: () => "someAddress" } },
          }
        ] })),
      };
      (networkService as any).blockRepository = blockRepository;
      const blocksServiceExistsCall = jest
        .spyOn(blocksService, "exists")
        .mockResolvedValue(false);
      (service as any).state = {
        data: {
          lastPageNumber: 2
        }
      };

      // act
      await service.discover({
        source: null,
        debug: true,
      });

      // assert
      expect(stateServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(blocksServiceExistsCall).toHaveBeenNthCalledWith(1, new BlockQuery({
        height: 77,
      } as BlockDocument));
      expect((service as any).lastPageNumber).toEqual(6);
    });

    it("should skip if document has already existed", async () => {
      // prepare
      const debugLogCall = jest
        .spyOn((service as any), "debugLog");
      jest
        .spyOn(stateService, "findOne")
        .mockResolvedValue({
          data: {
            totalNumberOfBlocks: 7
          }
        } as StateDocument);
      const blockRepository = {
        search: jest.fn().mockReturnValue(of({ data: [
          {
            height: { compact: () => 77 },
            signer: { address: { plain: () => "someAddress" } },
          }
        ] })),
      };
      (networkService as any).blockRepository = blockRepository;
      jest
        .spyOn(blocksService, "exists")
        .mockResolvedValue(true);
      (service as any).state = {
        data: {
          lastPageNumber: 1
        }
      };

      // act
      await service.discover({
        source: null,
        debug: true,
      });

      // assert
      expect(debugLogCall).toHaveBeenNthCalledWith(3, "Skipped 5 block entries that already exist");
    });
  });
});