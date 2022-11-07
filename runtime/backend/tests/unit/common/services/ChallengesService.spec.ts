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

// internal dependencies
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AuthChallengeDocument, AuthChallengeModel, AuthChallengeQuery } from "../../../../src/common/models/AuthChallengeSchema";
import { MockModel } from "../../../mocks/global";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";

describe("common/ChallengesService", () => {
  let service: ChallengesService;
  let queriesService: QueryService<AuthChallengeDocument, AuthChallengeModel>;
  let mockDate: Date;

  // for each AccountService test we create a testing module
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        QueryService,
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    queriesService = module.get<QueryService<AuthChallengeDocument, AuthChallengeModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("count()", () => {
    it("should use QueryService.count() method with correct query", async () => {
      // prepare
      const expectedResult = 2;
      const countMock = jest
        .spyOn(queriesService, "count")
        .mockResolvedValue(expectedResult);

      // act
      const result = await service.count(new AuthChallengeQuery());

      // assert
      expect(countMock).toBeCalledWith(new AuthChallengeQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("exists()", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = true;
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue({} as AuthChallengeDocument);

      // act
      const result = await service.exists(new AuthChallengeQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AuthChallengeQuery(), MockModel, true);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("find()", () => {
    it("should use QueryService.find() method with correct query", async () => {
      // prepare
      const expectedResult = new PaginatedResultDTO(
        [{} as AuthChallengeDocument],
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
      const result = await service.find(new AuthChallengeQuery());

      // assert
      expect(findMock).toBeCalledWith(new AuthChallengeQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findOne()", () => {
    it("should use QueryService.findOne() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const findOneMock = jest
        .spyOn(queriesService, "findOne")
        .mockResolvedValue(expectedResult as AuthChallengeDocument);

      // act
      const result = await service.findOne(new AuthChallengeQuery());

      // assert
      expect(findOneMock).toBeCalledWith(new AuthChallengeQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createOrUpdate()", () => {
    it("should use QueryService.createOrUpdate() method with correct query", async () => {
      // prepare
      const expectedResult = {};
      const createOrUpdateMock = jest
        .spyOn(queriesService, "createOrUpdate")
        .mockResolvedValue(expectedResult as AuthChallengeDocument);
      const query = new AuthChallengeQuery();
      const data = new MockModel();

      // act
      const result = await service.createOrUpdate(
        query,
        data,
      );

      // assert
      expect(createOrUpdateMock).toBeCalledWith(
        new AuthChallengeQuery(),
        MockModel,
        data,
        {},
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe("updateBatch()", () => {

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
      const challengeDoc = new MockModel({
        challenge: "test-challenge",
        transactionsCount: 1,
      });
      (challengeDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([challengeDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should call finder and pass correct query by challenge", async () => {
      // prepare
      const challengeDoc = new MockModel({
        challenge: "test-challenge",
        transactionsCount: 1,
      });
      (challengeDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([challengeDoc]);

      // assert
      expect(bulkMocks.find).toHaveBeenCalled();
    });

    it("should modify updatedAt field in $set routine", async () => {
      // prepare
      const challengeDoc = new MockModel({
        challenge: "test-challenge",
        transactionsCount: 1,
      });
      (challengeDoc as any).toQuery = jest.fn();

      // act
      await service.updateBatch([challengeDoc]);

      // assert
      expect(upsertMock.update).toHaveBeenCalled();
      expect(upsertMock.update).toHaveBeenCalledWith({
        $set: {
          ...(challengeDoc),
          updatedAt: mockDate,
        },
      });
    });
  });

  describe("generateChallenge()", () => {
    it("should use random function from Math lib in greatest radix (36) and slice result correctly", () => {
      // prepare
      const mathRandomCall = jest
        .spyOn(Math, "random")
        .mockReturnValue(0.7006047659103334); // 0.p7zez2y8j7
      const expectedResult = "zez2y8j7";

      // act
      const result = ChallengesService.generateChallenge();

      // assert
      expect(mathRandomCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
  });
});