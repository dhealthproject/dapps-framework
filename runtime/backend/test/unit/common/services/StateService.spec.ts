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
import type { StateData } from "../../../../src/common/models/StateData";
import { StateService } from "../../../../src/common/services/StateService";
import { StateQuery } from "../../../../src/common/models/StateSchema";

describe("common/StateService", () => {
  let service: StateService;

  const findOneCall = jest.fn(() => ({ exec: () => ({}) }));
  const saveOneCall = jest.fn(() => ({ exec: () => ({}) }));
  class MockModel {
    static findOne = findOneCall;
    static findOneAndUpdate = saveOneCall;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<StateService>(StateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("test on findOne()", () => {
    it("should call findOne() from model with correct param", async () => {
      const query = new StateQuery();
      await service.findOne(new StateQuery());
      expect(findOneCall).toBeCalledWith(query);
    });
  });

  describe("test on updateOne()", () => {
    it("should call updateOne() from model with correct param", async () => {
      await service.updateOne(
        new StateQuery(undefined, "test"),
        {} as StateData,
      );

      expect(saveOneCall).toBeCalledWith(
        { name: "test" },
        {},
        {
          upsert: true,
        },
      );
    });
  });
});
