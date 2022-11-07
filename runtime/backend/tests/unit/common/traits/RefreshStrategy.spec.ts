/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mock sha3-_256
jest.mock("js-sha3", () => ({
  sha3_256: jest.fn(),
}));

// mock config dappName
jest.mock("../../../../config/dapp", () => {
  return () => ({
    dappName: "testDappName"
  });
});

// mock ExtractJwt
jest.mock("passport-jwt", () => ({
  ExtractJwt: {
    fromExtractors: jest.fn((params) => params),
    fromAuthHeaderAsBearerToken: jest.fn(),
  },
}));

// mock PassportStrategy
class MockStrategy {
  jwtFromRequestObj: any;
  constructor(jwtFromRequestObj: object) {
    this.jwtFromRequestObj = jwtFromRequestObj;
  }
}
const MockPassportStrategy = jest.fn().mockReturnValue(MockStrategy);
jest.mock("@nestjs/passport", () => ({
  PassportStrategy: MockPassportStrategy
}));

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import { RefreshStrategy } from "../../../../src/common/traits/RefreshStrategy";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";
import { MockModel } from "../../../mocks/global";

describe("common/RefreshStrategy", () => {
  let service: RefreshStrategy;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockPassportStrategy,
        RefreshStrategy,
        AccountsService,
        QueryService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<RefreshStrategy>(RefreshStrategy);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("constructor()", () => {
    it("should call super() with correct functions these should return correct result", () => {
      // prepare
      const req = {
        signedCookies: { "testDappName:Refresh": "testDappName:Refresh-signedCookies" },
        cookies: { "testDappName:Refresh": "testDappName:Refresh-cookies" },
      };

      // act
      const resultSignedCookies = (service as any).jwtFromRequestObj.jwtFromRequest[0](req);
      const resultCookies = (service as any).jwtFromRequestObj.jwtFromRequest[1](req);

      // assert
      expect((service as any).jwtFromRequestObj).toBeDefined();
      expect(resultSignedCookies).toEqual("testDappName:Refresh-signedCookies");
      expect(resultCookies).toEqual("testDappName:Refresh-cookies");
    });

    it("should call super() with correct functions, these should return null if req is null/undefined", () => {
      // act
      const resultSignedCookies = (service as any).jwtFromRequestObj.jwtFromRequest[0](null);
      const resultCookies = (service as any).jwtFromRequestObj.jwtFromRequest[1](undefined);

      // assert
      expect((service as any).jwtFromRequestObj).toBeDefined();
      expect(resultSignedCookies).toBeNull();
      expect(resultCookies).toBeNull();
    });

    it("should call super() with correct functions, these should return null if req values are null/undefined", () => {
      // prepare
      const req: any = {
        signedCookies: { "testDappName:Refresh": null },
        cookies: {},
      };

      // act
      const resultSignedCookies = (service as any).jwtFromRequestObj.jwtFromRequest[0](req);
      const resultCookies = (service as any).jwtFromRequestObj.jwtFromRequest[1](req);

      // assert
      expect((service as any).jwtFromRequestObj).toBeDefined();
      expect(resultSignedCookies).toBeNull();
      expect(resultCookies).toBeNull();
    });
  });

  describe("validate()", () => {
    it("should return correct result", async () => {
      // prepare
      const accountDoc = {
        address: "testAddress",
        lastSessionHash: "testLastSessionHash",
      }
      const accountsServiceFindOneCall = jest
        .spyOn(accountsService, "findOne")
        .mockResolvedValue(accountDoc as AccountDocument);
      const expectedResult = {
        sub: accountDoc.lastSessionHash,
        address: accountDoc.address,
      }
      
      // act
      const result = await service.validate({} as any, {});

      // assert
      expect(accountsServiceFindOneCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});