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
import { MockModel } from "../../../mocks/global";
import { TransactionsService } from "../../../../src/discovery/services/TransactionsService";
import { TransactionsController } from "../../../../src/discovery/routes/TransactionsController";
import { QueryService } from "../../../../src/common/services/QueryService";
import { TransactionDocument } from "../../../../src/common/models/TransactionSchema";

describe("discovery/TransactionsController", () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        QueryService,
        {
          provide: getModelToken("Transaction"),
          useValue: MockModel,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("find()", () => {
    it("should call correct method and respond with DTO", async () => {
      // prepare
      const transactionDocResult = {
        data: [ {} as TransactionDocument ],
        pagination: {
          pageNumber: 1,
          pageSize: 20,
          total: 1,
        },
        isLastPage: jest.fn().mockReturnValue(true),
      };
      const transactionsServiceFindCall = jest
        .spyOn(transactionsService, "find")
        .mockResolvedValue(transactionDocResult);
      const expectedResult = {
        data: transactionDocResult.data,
        pagination: transactionDocResult.pagination,
      }

      // act
      const result = await (controller as any).find(
        {},
        {
          pageNumber: 1,
          pageSize: 20,
        },
      );

      // assert
      expect(transactionsServiceFindCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});