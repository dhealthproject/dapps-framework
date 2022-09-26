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
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { AssetsService } from "../../../../src/discovery/services/AssetsService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AssetDocument, AssetModel, AssetQuery } from "../../../../src/discovery/models/AssetSchema";
import { PaginatedResultDTO } from "../../../../src/common/models";

describe("discovery/AssetsService", () => {
  let service: AssetsService;
  let queriesService: QueryService<AssetDocument, AssetModel>;
  let configService: ConfigService;

  const query: AssetQuery = new AssetQuery();

  beforeEach(async () => {
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
    queriesService = module.get<QueryService<AssetDocument, AssetModel>>(QueryService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
    it("should return correct result", async () => {
      // prepare
      const queriesServiceCountCall = jest
        .spyOn(queriesService, "count")
        .mockResolvedValue(2);

      // act
      const result = await service.count(query);

      // assert
      expect(queriesServiceCountCall).toHaveBeenNthCalledWith(
        1,
        query,
        MockModel,
      );
      expect(result).toBe(2);
    });
  });

  describe("exists()", () => {
    it("should return correct result", async () => {
      // prepare
      const queriesServiceFindOneCall = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as AssetDocument);

      // act
      const result = await service.exists(query);

      // assert
      expect(queriesServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        query,
        MockModel,
        true,
      );
      expect(result).toBe(true);
    });
  });

  describe("find()", () => {
    it("should return correct result", async () => {
      // prepare
      const queriesServiceFindCall = jest
        .spyOn(queriesService, "find")
        .mockResolvedValue({} as PaginatedResultDTO<AssetDocument>);

      // act
      const result = await service.find(query);

      // assert
      expect(queriesServiceFindCall).toHaveBeenNthCalledWith(
        1,
        query,
        MockModel,
      );
      expect(result).toStrictEqual({});
    });
  });

  describe("findOne()", () => {
    it("should return correct result", async () => {
      // prepare
      const queriesServiceFindOneCall = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as AssetDocument);

      // act
      const result = await service.findOne(query);

      // assert
      expect(queriesServiceFindOneCall).toHaveBeenNthCalledWith(
        1,
        query,
        MockModel,
      );
      expect(result).toStrictEqual({});
    });
  });

  describe("createOrUpdate()", () => {
    it("should return correct result", async () => {
      // prepare
      const queriesServiceCreateOrUpdateCall = jest
        .spyOn(queriesService, "createOrUpdate")
        .mockResolvedValue({} as AssetDocument);

      // act
      const result = await service.createOrUpdate(
        query,
        {},
      );

      // assert
      expect(queriesServiceCreateOrUpdateCall).toHaveBeenNthCalledWith(
        1,
        query,
        MockModel,
        {},
        {},
      );
      expect(result).toStrictEqual({});
    });
  });

  describe("updateBatch()", () => {
    it("should return correct result", async () => {
      // prepare
      const queriesServiceUpdateBatchCall = jest
        .spyOn(queriesService, "updateBatch")
        .mockResolvedValue(2);

      // act
      const result = await service.updateBatch([]);

      // assert
      expect(queriesServiceUpdateBatchCall).toHaveBeenNthCalledWith(
        1,
        MockModel,
        []
      );
      expect(result).toBe(2);
    });
  });

  describe("getAssetParameters()", () => {
    it("should return correct result", () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue({});

      // act
      const result = service.getAssetParameters("test-assetType");

      // assert
      expect(configServiceGetCall).toHaveBeenNthCalledWith(
        1,
        `assets.test-assetType`
      )
      expect(result).toStrictEqual({});
    });

    it("should throw correct error", () => {
      // prepare
      const configServiceGetCall = jest
        .spyOn(configService, "get")
        .mockReturnValue(undefined);
      const expectedErrorMsg = `Invalid discoverable asset "test-assetType".`

      // act
      const result = () => service.getAssetParameters("test-assetType");

      // assert
      expect(result).toThrowError(expectedErrorMsg);
      expect(configServiceGetCall).toHaveBeenNthCalledWith(
        1,
        `assets.test-assetType`
      );
    });
  });
});