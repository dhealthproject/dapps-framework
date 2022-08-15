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
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { StateDocument, StateModel, StateQuery } from "../../../../src/common/models/StateSchema";

describe("common/StateService", () => {
  let service: StateService;
  let queryService: QueryService<StateDocument, StateModel>;

  const findOneCall = jest.fn(() => ({ exec: () => ({}) }));
  const saveOneCall = jest.fn(() => ({ exec: () => ({}) }));
  class MockModel {
    static findOne = findOneCall;
    static findOneAndUpdate = saveOneCall;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        StateService,
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<StateService>(StateService);
    queryService = module.get<QueryService<StateDocument, StateModel>>(QueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOne() -->", () => {
    it("should call findOne() from queryService with correct param", async () => {
      const expectedResult = {} as StateDocument;
      const findMock = jest
        .spyOn(queryService, "findOne")
        .mockResolvedValue(expectedResult);
      const result = await service.findOne(new StateQuery());
      expect(findMock).toBeCalledWith(new StateQuery(), MockModel);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("updateOne() -->", () => {
    it("should call updateOne() from queryService with correct param", async () => {
      const expectedResult = { data: {} } as StateDocument;
      const findMock = jest
        .spyOn(queryService, "createOrUpdate")
        .mockResolvedValue(expectedResult);
      const result = await service.updateOne(new StateQuery(), {});
      expect(findMock).toBeCalledWith(new StateQuery(), MockModel, { data: {} });
      expect(result).toEqual(expectedResult);
    });
  });

  //@todo Only one test for findOne is likely not enough.
  //@todo Only one test for updateOne is likely not enough.
});
