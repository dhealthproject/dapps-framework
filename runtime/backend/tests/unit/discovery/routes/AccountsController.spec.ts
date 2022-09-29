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
import { QueryService } from "../../../../src/common/services/QueryService";
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { AccountDTO } from "../../../../src/common/models/AccountDTO";
import {
  Account,
  AccountDocument,
  AccountQuery,
} from "../../../../src/common/models/AccountSchema";
import { AccountsController } from "../../../../src/discovery/routes/AccountsController";

describe("discovery/AccountsController", () => {
  let controller: AccountsController;
  let accountsService: AccountsService;
  let mockDate: Date;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        QueryService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("find() -->", () => {
    it("should call correct method and respond with DTO", async () => {
      // prepare
      const accountDoc = new Account();
      (accountDoc as any).address = "fakeAddress";
      const expectToFetchDocuments = new PaginatedResultDTO<AccountDocument>(
        [accountDoc as AccountDocument],
        { pageNumber: 1, pageSize: 20, total: 1 },
      );
      const expectToMapToDTOs = new PaginatedResultDTO<AccountDTO>(
        [{ address: "fakeAddress" } as AccountDTO],
        { pageNumber: 1, pageSize: 20, total: 1 },
      );
      const serviceFindMock = jest
        .spyOn(accountsService, "find")
        .mockResolvedValue(expectToFetchDocuments);

      // act
      const result = await controller.find(
        { address: "fakeAddress" } as any as AccountQuery,
      );

      // assert
      expect(serviceFindMock).toBeCalledTimes(1);
      expect(serviceFindMock).toBeCalledWith(
        new AccountQuery({ address: "fakeAddress" } as AccountDocument),
      );
      expect(result).toEqual(expectToMapToDTOs);
    });
  });
});
