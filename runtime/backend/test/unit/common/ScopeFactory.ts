/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { ScopeFactory } from "../../../src/common/ScopeFactory";
import { DappConfig } from "../../../src/common/models/DappConfig";

// exeternal dependency mocks
jest.mock("@dhealth/sdk");

const forRootCall: any = jest.fn(() => ConfigModuleMock);
const ConfigModuleMock: any = { forRoot: forRootCall };
jest.mock("@nestjs/config", () => {
  return { ConfigModule: ConfigModuleMock };
});

const mongooseForRootCall: any = jest.fn(() => MongooseModuleMock);
const MongooseModuleMock: any = { forRoot: mongooseForRootCall };
jest.mock("@nestjs/mongoose", () => {
  return { MongooseModule: MongooseModuleMock };
});

// internal dependency mocks
const DiscoveryModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/DiscoveryModule", () => {
  return { DiscoveryModule: DiscoveryModuleMock };
});

const PayoutModuleMock: any = jest.fn();
jest.mock("../../../src/payout/PayoutModule", () => {
  return { PayoutModule: PayoutModuleMock };
});

const ProcessorModuleMock: any = jest.fn();
jest.mock("../../../src/processor/ProcessorModule", () => {
  return { ProcessorModule: ProcessorModuleMock };
});

// Mock the imports factory to re-create class instances
// everytime a new test is running. This mock mimics the
// creation of separate ImportsFactory instances.
class MockFactory extends ScopeFactory {
  protected static $_INSTANCE: MockFactory = null;

  static create(configDTO: any): MockFactory {
    return new MockFactory(configDTO);
  }
}

describe("common/ScopeFactory", () => {
  describe("getModules() -->", () => {
    it("should always include configuration module", () => {
      // prepare
      const baseConfig = {
        dappPublicKey: "FakePublicKeyOfAdApp",
      };

      const configDto1: DappConfig = { ...baseConfig, scopes: [] };
      const configDto2: DappConfig = { ...baseConfig, scopes: ["discovery"] };

      // act
      const result1 = MockFactory.create(configDto1).getModules();
      const result2 = MockFactory.create(configDto2).getModules();

      // assert
      expect(result1).toEqual([ConfigModuleMock]);
      expect(result2).toEqual([ConfigModuleMock, DiscoveryModuleMock]);
    });

    it("should return correct list of enabled scopes", () => {
      // prepare
      const configDto: DappConfig = {
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["discovery", "payout", "processor"],
      };

      // act
      const result = MockFactory.create(configDto).getModules();

      // assert
      expect(result).toEqual([
        ConfigModuleMock,
        DiscoveryModuleMock,
        PayoutModuleMock,
        ProcessorModuleMock,
      ]);
    });

    it("should return correct list of alternative scopes", () => {
      // prepare
      const configDto: DappConfig = {
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["discovery", "processor"],
      };

      // act
      const result = MockFactory.create(configDto).getModules();

      // assert
      expect(result).toEqual([
        ConfigModuleMock,
        DiscoveryModuleMock,
        ProcessorModuleMock,
      ]);
    });

    it("should return correct result for database scope", () => {
      // prepare
      const configDto: DappConfig = {
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["database"],
      };

      // act
      const result = MockFactory.create(configDto).getModules();

      // assert
      expect(result).toEqual([ConfigModuleMock, MongooseModuleMock]);
    });
  });
});
