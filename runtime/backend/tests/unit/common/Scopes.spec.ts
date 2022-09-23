/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
const configForRootCall: any = jest.fn(() => ConfigModuleMock);
const ConfigModuleMock: any = { forRoot: configForRootCall };
jest.mock("@nestjs/config", () => {
  return { ConfigModule: ConfigModuleMock };
});

const mongooseForRootCall: any = jest.fn(() => MongooseModuleMock);
const mongooseForFeatCall: any = jest.fn(() => MongooseModuleMock);
const MongooseModuleMock: any = { forRoot: mongooseForRootCall, forFeature: mongooseForFeatCall };
jest.mock("@nestjs/mongoose", () => {
  return { MongooseModule: MongooseModuleMock };
});

const scheduleForRootCall: any = jest.fn(() => ScheduleModuleMock);
const ScheduleModuleMock: any = { forRoot: scheduleForRootCall };
jest.mock("@nestjs/schedule", () => {
  return { ScheduleModule: ScheduleModuleMock };
});

// internal dependency mocks
const AccountsModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/modules/AccountsModule", () => {
  return { AccountsModule: AccountsModuleMock };
});

const TransactionsModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/modules/TransactionsModule", () => {
  return { TransactionsModule: TransactionsModuleMock };
});

const AssetsModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/modules/AssetsModule", () => {
  return { AssetsModule: AssetsModuleMock };
});

const DiscoveryModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/DiscoveryModule", () => {
  return { DiscoveryModule: DiscoveryModuleMock };
});

const StateModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/StateModule", () => {
  return { StateModule: StateModuleMock };
});

const NetworkModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/NetworkModule", () => {
  return { NetworkModule: NetworkModuleMock };
});

const OperationsModuleMock: any = jest.fn();
jest.mock("../../../src/processor/modules/OperationsModule", () => {
  return { OperationsModule: OperationsModuleMock };
});

const DiscoverAccountsCommandMock: any = jest.fn();
jest.mock("../../../src/discovery/schedulers/DiscoverAccounts/DiscoverAccountsCommand", () => {
  return { DiscoverAccountsCommand: DiscoverAccountsCommandMock };
});

const DiscoverTransactionsCommandMock: any = jest.fn();
jest.mock("../../../src/discovery/schedulers/DiscoverTransactions/DiscoverTransactionsCommand", () => {
  return { DiscoverTransactionsCommand: DiscoverTransactionsCommandMock };
});

const DiscoverAssetsCommandMock: any = jest.fn();
jest.mock("../../../src/discovery/schedulers/DiscoverAssets/DiscoverAssetsCommand", () => {
  return { DiscoverAssetsCommand: DiscoverAssetsCommandMock };
});

const ProcessOperationsCommandMock: any = jest.fn();
jest.mock("../../../src/processor/schedulers/ProcessOperations/ProcessOperationsCommand", () => {
  return { ProcessOperationsCommand: ProcessOperationsCommandMock };
});

const PayoutModuleMock: any = jest.fn();
jest.mock("../../../src/payout/PayoutModule", () => {
  return { PayoutModule: PayoutModuleMock };
});

const ProcessorModuleMock: any = jest.fn();
jest.mock("../../../src/processor/ProcessorModule", () => {
  return { ProcessorModule: ProcessorModuleMock };
});

// internal dependencies
import { Scopes } from "../../../src/common/Scopes";
import { ScopeFactory } from "../../../src/common/ScopeFactory";

// Mock the imports factory to re-create class instances
// everytime a new test is running. This mock mimics the
// creation of separate ImportsFactory instances.
class MockFactory extends ScopeFactory {
  protected static $_INSTANCE: MockFactory = null;

  static create(configDTO: any): MockFactory {
    return new MockFactory(configDTO);
  }
}

describe("common/Scopes", () => {
  let dappConfig: any,
      actualModules: any[];
  beforeEach(() => {
    // prepare for all (includes database scope)
    dappConfig = {
      dappName: "Fake dApp",
      dappPublicKey: "FakePublicKeyOfAdApp",
      authAuthority: "NonExistingAuthority",
      scopes: ["database"],
      database: { host: "fake-host", port: 1234, name: "fake-db-name", user: "fake-user" },
    };
  });

  it("should use environment variables from mocks", () => {
    // assert
    expect(process.env.ANOTHER_DB_NAME_THROUGH_ENV).toEqual("this-exists-only-in-mock");
  });

  it("should include database scope in enabled modules", () => {
    // act
    const {} = Scopes.database;
    actualModules = MockFactory.create(dappConfig).getModules();

    // assert
    expect(mongooseForRootCall).toHaveBeenCalledTimes(2); // imported in Scopes and in Schedulers
    expect(actualModules).toEqual([ConfigModuleMock, MongooseModuleMock]);
  });

  it("should use correct database configuration", () => {
    // prepare
    const expectedPayload: string = `mongodb://fake-user:fake-pass@fake-host:1234/fake-db-name?authSource=admin`;

    // act
    actualModules = MockFactory.create(dappConfig).getModules();

    // assert
    expect(mongooseForRootCall).toHaveBeenCalledTimes(2); // imported in Scopes and in Schedulers
    expect(mongooseForRootCall).toHaveBeenCalledWith(expectedPayload);
  });
});
