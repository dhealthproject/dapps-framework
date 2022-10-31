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
import { BlockHttp } from "@dhealth/sdk";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { DappHelper } from "../../../../src/common/concerns/DappHelper";
import { NetworkService } from "../../../../src/common/services/NetworkService";

describe("common/QueryService", () => {
  let service: DappHelper;
  let configService: ConfigService;

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DappHelper, ConfigService, NetworkService],
    }).compile();

    service = module.get<DappHelper>(DappHelper);
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
      const blockRepository: BlockHttp = {
        getBlockByHeight: getBlockByHeightCall,
      } as any;
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, "getNetworkTimestampFromUInt64")
        .mockReturnValue(1);
      const result = await service.getBlockTimestamp(blockRepository, 1);
      expect(getBlockByHeightCall).toBeCalled();
      expect(getNetworkTimestampFromUInt64Call).toBeCalled();
      expect(result).toEqual(1000);
    });

    it("should throw correct error when response is empty", async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve(),
      }));
      const blockRepository: BlockHttp = {
        getBlockByHeight: getBlockByHeightCall,
      } as any;
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, "getNetworkTimestampFromUInt64")
        .mockReturnValue(1);
      await service.getBlockTimestamp(blockRepository, 1).catch((err: Error) => {
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