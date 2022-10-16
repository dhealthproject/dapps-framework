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
import { OperationsController } from "../../../../src/processor/routes/OperationsController";
import { OperationsService } from "../../../../src/processor/services/OperationsService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { OperationDocument } from "../../../../src/processor/models/OperationSchema";

describe("processor/OperationsController", () => {
  let controller: OperationsController;
  let operationsService: OperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [
        OperationsService,
        QueryService,
        {
          provide: getModelToken("Operation"),
          useValue: MockModel,
        },
      ]
    }).compile();

    controller = module.get<OperationsController>(OperationsController);
    operationsService = module.get<OperationsService>(OperationsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("find()", () => {
    it("should call correct methods and return correct result", async () => {
      // prepare
      const operationsServiceFindCall = jest
        .spyOn(operationsService, "find")
        .mockResolvedValue({
          data: [{} as OperationDocument],
          pagination: {
            pageNumber: 1,
            pageSize: 100,
            total: 1
          },
          isLastPage: () => true,
        });
      const expectedResult = {
        data: [{} as OperationDocument],
        pagination: {
          pageNumber: 1,
          pageSize: 100,
          total: 1
        },
      };

      // act
      const result = await (controller as any).find({
        pageNumber: 1
      });

      // assert
      expect(operationsServiceFindCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});