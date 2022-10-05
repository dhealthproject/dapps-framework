/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mocks the `()`-operator when importing configuration resources
// mocks the assets configuration resource with valid configuration
// CAUTION this mock must precede any import-statements in this file
const mockAssetsLoaderCall = jest.fn().mockReturnValue({
  assets: {
    base: {
      mosaicId: "fake-base-mosaic-id",
      namespaceId: "fake-base-namespace-id",
      divisibility: 6,
      symbol: "fake-base-symbol"
    },

    earn: {
      mosaicId: "fake-earn-mosaic-id",
      divisibility: 6,
      symbol: "fake-earn-symbol"
    }
  },
} as AssetsConfig);
jest.mock("../../../../config/assets", 
  () => mockAssetsLoaderCall,
);

// external dependencies
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AssetsService } from "../../../../src/discovery/services/AssetsService";
import { AssetDocument, AssetModel, AssetQuery } from "../../../../src/discovery/models/AssetSchema";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";
import { AssetsConfig } from "../../../../src/common/models/AssetsConfig";

describe("discovery/AssetsService", () => {
  let service: AssetsService;
  let configService: ConfigService;
  let queriesService: QueryService<AssetDocument, AssetModel>;
  let mockDate: Date;

  // for each AssetsService test we create a testing module
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        ConfigService,
        QueryService,
        {
          provide: getModelToken("Asset"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
    configService = module.get<ConfigService>(ConfigService);
    queriesService = module.get<QueryService<AssetDocument, AssetModel>>(QueryService);

    mockAssetsLoaderCall.mockClear();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count() -->", () => {
    it("should use QueryService.count() method with correct query", async () => {
      // prepare
      const expectedResult = 2;
      const countMock = jest
        .spyOn(queriesService, "count")
        .mockResolvedValue(expectedResult);

      // act
      const result = await service.count(new AssetQuery());

      // assert
      expect(countMock).toBeCalledWith(new AssetQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("exists() -->", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = true;
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as AssetDocument);

      // act
      const result = await service.exists(new AssetQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AssetQuery(), MockModel, true);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("find() -->", () => {
    it("should use QueryService.find() method with correct query", async () => {
      // prepare
      const expectedResult = new PaginatedResultDTO(
        [{} as AssetDocument],
        {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
      );
      const findMock = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue(expectedResult);

      // act
      const result = await service.find(new AssetQuery());

      // assert
      expect(findMock).toBeCalledWith(new AssetQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findOne() -->", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as AssetDocument);

      // act
      const result = await service.findOne(new AssetQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AssetQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createOrUpdate() -->", () => {
    it("should use QueryService.createOrUpdate() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const createOrUpdateMock = jest
        .spyOn(queriesService, "createOrUpdate")
        .mockResolvedValue({} as AssetDocument);
      const query = new AssetQuery();
      const data = new MockModel();

      // act
      const result = await service.createOrUpdate(
        query,
        data,
      );

      // assert
      expect(createOrUpdateMock).toBeCalledWith(
        query, MockModel, data, {}
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe("updateBatch() -->", () => {
    // for each updateBatch() test we overwrite the
    // bulk operations functions from mongoose plugin
    let bulkMocks: any,
        finderMock: any,
        upsertMock: any;
    beforeEach(async () => {
      upsertMock = { update: jest.fn() };
      finderMock = { upsert: jest.fn().mockReturnValue(upsertMock) };
      bulkMocks = {
        find: jest.fn().mockReturnValue(finderMock),
        execute: () => Promise.resolve({}),
      };

      // overwrites the internal bulk operation
      (service as any).model.collection = {
        initializeUnorderedBulkOp: () => bulkMocks,
      };
    });

    it("should call collection.initializeUnorderedBulkOp() from model", async () => {
      // prepare
      const transactionDoc = new MockModel({
        signerAddress: "test-address",
        transactionHash: "fakeHash1",
      });
      (transactionDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([transactionDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should call finder and pass correct query by signer and hash", async () => {
      // prepare
      const transactionDoc = new MockModel({
        signerAddress: "test-address",
        transactionHash: "fakeHash1",
      });
      (transactionDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([transactionDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should modify updatedAt field in $set routine", async () => {
      // prepare
      const transactionDoc = new MockModel({
        signerAddress: "test-address",
        transactionHash: "fakeHash1",
      });
      (transactionDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([transactionDoc]);

      // assert
      expect(upsertMock.update).toHaveBeenCalled();
      expect(upsertMock.update).toHaveBeenCalledWith({
        $set: {
          ...(transactionDoc),
          updatedAt: mockDate,
        },
      });
    });
  });

  describe("getAssetParameters() -->", () => {
    it("should call assetsConfigLoader to retrieve assets", () => {
      // act
      (AssetsService as any).getAssetParameters("base");

      // assert
      expect(mockAssetsLoaderCall).toHaveBeenCalledTimes(1);
    });

    it("should throw an error given unknown asset type", () => {
      // act+assert
      expect(() => (AssetsService as any).getAssetParameters("fake-asset1"))
        .toThrow(`Invalid discoverable asset "fake-asset1".`);
      expect(() => (AssetsService as any).getAssetParameters("fake-asset2"))
        .toThrow(`Invalid discoverable asset "fake-asset2".`);
    });

    it("should return a parameters object with correct values", () => {
      // act
      const assetBase = (AssetsService as any).getAssetParameters("base");
      const assetEarn = (AssetsService as any).getAssetParameters("earn");

      // assert
      // BASE asset
      expect(assetBase).toBeDefined();
      expect("mosaicId" in assetBase).toBe(true);
      expect("namespaceId" in assetBase).toBe(true);
      expect("symbol" in assetBase).toBe(true);
      expect(assetBase.mosaicId).toBe("fake-base-mosaic-id");
      expect(assetBase.namespaceId).toBe("fake-base-namespace-id");
      expect(assetBase.symbol).toBe("fake-base-symbol");

       // EARN asset
      expect("mosaicId" in assetEarn).toBe(true);
      expect("namespaceId" in assetEarn).toBe(false);
      expect("symbol" in assetEarn).toBe(true);
      expect(assetEarn.mosaicId).toBe("fake-earn-mosaic-id");
      expect(assetEarn.namespaceId).toBe(undefined);
      expect(assetEarn.symbol).toBe("fake-earn-symbol");
    });
  });

  describe("formatMosaicId() -->", () => {
    it("should return the input given no knowledge of identifier", () => {
      // prepare
      const expectedId = "123456789";

      // act
      const result: string = AssetsService.formatMosaicId(expectedId);

      // assert
      expect(result).toBeDefined();
      expect(result).toBe(expectedId)
    });

    it("should return mosaic id given known namespaceId", () => {
      // prepare
      const namespaceId = "fake-base-namespace-id";
      const expectedId = "fake-base-mosaic-id"; // <-- overwrites with MosaicId

      // act
      const result: string = AssetsService.formatMosaicId(namespaceId);

      // assert
      expect(result).toBeDefined();
      expect(result).toBe(expectedId); // <-- overwrites with MosaicId
    });

    it("should return input given no namespaceId configuration", () => {
      // prepare
      const expectedId = "fake-earn-mosaic-id"; // EARN does not have namespaceId

      // act
      const result: string = AssetsService.formatMosaicId(expectedId);

      // assert
      expect(result).toBeDefined();
      expect(result).toBe(expectedId); // <-- returns untouched
    });
  });
});
