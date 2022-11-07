/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependency mock
const configForRootCall: any = jest.fn(() => ConfigModuleMock);
const ConfigModuleMock: any = { forRoot: configForRootCall };
jest.mock("@nestjs/config", () => {
  return { ConfigModule: ConfigModuleMock };
});

const mongooseForRootCall: any = jest.fn(() => MongooseModuleMock);
const mongooseForFeatCall: any = jest.fn(() => MongooseModuleMock);
const MongooseModuleMock: any = {
  forRoot: mongooseForRootCall,
  forFeature: mongooseForFeatCall,
};
jest.mock("@nestjs/mongoose", () => {
  return { MongooseModule: MongooseModuleMock };
});

const scheduleForRootCall: any = jest.fn(() => ScheduleModuleMock);
const ScheduleModuleMock: any = { forRoot: scheduleForRootCall };
jest.mock("@nestjs/schedule", () => {
  return { ScheduleModule: ScheduleModuleMock };
});

// internal dependency mocks
// common scope
const CommonQueryModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/QueryModule", () => {
  return { QueryModule: CommonQueryModuleMock };
});

const CommonNetworkModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/NetworkModule", () => {
  return { NetworkModule: CommonNetworkModuleMock };
});

const CommonStateModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/StateModule", () => {
  return { StateModule: CommonStateModuleMock };
});

const CommonAccountsModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/AccountsModule", () => {
  return { AccountsModule: CommonAccountsModuleMock };
});

const CommonChallengesModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/ChallengesModule", () => {
  return { ChallengesModule: CommonChallengesModuleMock };
});

const CommonAuthModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/AuthModule", () => {
  return { AuthModule: CommonAuthModuleMock };
});

const CommonHelpersModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/HelpersModule", () => {
  return { HelpersModule: CommonHelpersModuleMock };
});

// discovery scope
const DiscoveryModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/DiscoveryModule", () => {
  return { DiscoveryModule: DiscoveryModuleMock };
});

const AccountsDiscoveryModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/modules/AccountsModule", () => {
  return { AccountsModule: AccountsDiscoveryModuleMock };
});

const AssetsModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/modules/AssetsModule", () => {
  return { AssetsModule: AssetsModuleMock };
});

const TransactionsModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/modules/TransactionsModule", () => {
  return { TransactionsModule: TransactionsModuleMock };
});

const BlocksModuleMock: any = jest.fn();
jest.mock("../../../src/discovery/modules/BlocksModule", () => {
  return { BlocksModule: BlocksModuleMock };
});

// processor scope
const ProcessorModuleMock: any = jest.fn();
jest.mock("../../../src/processor/ProcessorModule", () => {
  return { ProcessorModule: ProcessorModuleMock };
});

const OperationsModuleMock: any = jest.fn();
jest.mock("../../../src/processor/modules/OperationsModule", () => {
  return { OperationsModule: OperationsModuleMock };
});

const ActivitiesModuleMock: any = jest.fn();
jest.mock("../../../src/processor/modules/ActivitiesModule", () => {
  return { ActivitiesModule: ActivitiesModuleMock };
});

const WebHooksModuleMock: any = jest.fn();
jest.mock("../../../src/processor/modules/WebHooksModule", () => {
  return { WebHooksModule: WebHooksModuleMock };
});

// payout scope
const PayoutModuleMock: any = jest.fn();
jest.mock("../../../src/payout/PayoutModule", () => {
  return { PayoutModule: PayoutModuleMock };
});

const PayoutsModuleMock: any = jest.fn();
jest.mock("../../../src/payout/modules/PayoutsModule", () => {
  return { PayoutsModule: PayoutsModuleMock };
});

// statistics scope
const StatisticsModuleMock: any = jest.fn();
jest.mock("../../../src/statistics/StatisticsModule", () => {
  return { StatisticsModule: StatisticsModuleMock };
});

const LeaderboardsModuleMock: any = jest.fn();
jest.mock("../../../src/statistics/modules/LeaderboardsModule", () => {
  return { LeaderboardsModule: LeaderboardsModuleMock };
});

// schedulers
const DiscoverAccountsCommandMock: any = jest.fn();
jest.mock(
  "../../../src/discovery/schedulers/DiscoverAccounts/DiscoverAccountsCommand",
  () => {
    return { DiscoverAccountsCommand: DiscoverAccountsCommandMock };
  },
);

const DiscoverAssetsCommandMock: any = jest.fn();
jest.mock(
  "../../../src/discovery/schedulers/DiscoverAssets/DiscoverAssetsCommand",
  () => {
    return { DiscoverAssetsCommand: DiscoverAssetsCommandMock };
  },
);

const DiscoverTransactionsCommandMock: any = jest.fn();
jest.mock(
  "../../../src/discovery/schedulers/DiscoverTransactions/DiscoverTransactionsCommand",
  () => {
    return { DiscoverTransactionsCommand: DiscoverTransactionsCommandMock };
  },
);

const DiscoverBlocksCommandMock: any = jest.fn();
jest.mock(
  "../../../src/discovery/schedulers/DiscoverBlocks/DiscoverBlocksCommand",
  () => {
    return { DiscoverBlocksCommand: DiscoverBlocksCommandMock };
  },
);

const ProcessOperationsCommandMock: any = jest.fn();
jest.mock(
  "../../../src/processor/schedulers/ProcessOperations/ProcessOperationsCommand",
  () => {
    return { ProcessOperationsCommand: ProcessOperationsCommandMock };
  },
);

const LeaderboardsAggregationCommandMock: any = jest.fn();
jest.mock(
  "../../../src/statistics/schedulers/LeaderboardAggregation/LeaderboardsAggregationCommand",
  () => {
    return { LeaderboardsAggregationCommand: LeaderboardsAggregationCommandMock };
  },
);

const ActivityPayoutsCommandMock: any = jest.fn();
jest.mock(
  "../../../src/payout/schedulers/ActivityPayouts/ActivityPayoutsCommand",
  () => {
    return { ActivityPayoutsCommand: ActivityPayoutsCommandMock };
  },
);

const mockDappConfig: DappConfig = {
  dappName: "test-dappName",
  dappPublicKey: "test-dappPublicKey",
  scopes: [],
  database: undefined,
  frontendApp: {
    url: "test-url",
    host: "test-host",
    port: "test-port",
    https: false
  },
  backendApp: {
    url: "test-url",
    host: "test-host",
    port: "test-port",
    https: false
  }
};

// internal dependencies
import { ScopeFactory } from "../../../src/common/ScopeFactory";
import { DappConfig } from "../../../src/common/models/DappConfig";

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
  describe("create()", () => {
    it("should return new instance", () => {
      // act
      const scopeFactory = ScopeFactory.create(mockDappConfig);

      // assert
      expect(scopeFactory).toBeDefined();
    });

    it("should return correct instance", () => {
      // prepare
      const testInstance = { key: "value" };
      (ScopeFactory as any).$_INSTANCE = testInstance;

      // act
      const scopeFactory = ScopeFactory.create(mockDappConfig);

      // assert
      expect(scopeFactory).toEqual(testInstance);
    });
  });

  describe("getModules()", () => {
    it("should always include configuration module", () => {
      // prepare
      const baseConfig = {
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
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
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["discovery", "payout", "processor", "statistics"],
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
      };

      // act
      const result = MockFactory.create(configDto).getModules();

      // assert
      expect(result).toEqual([
        ConfigModuleMock,
        DiscoveryModuleMock,
        PayoutModuleMock,
        ProcessorModuleMock,
        StatisticsModuleMock,
      ]);
    });

    it("should return correct list of alternative scopes", () => {
      // prepare
      const configDto: DappConfig = {
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["discovery", "processor"],
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
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
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["database"],
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
      };

      // act
      const result = MockFactory.create(configDto).getModules();

      // assert
      expect(result).toEqual([ConfigModuleMock, MongooseModuleMock]);
    });
  });

  describe("getSchedulers()", () => {
    it("should always include configuration and database modules", () => {
      // prepare
      const baseConfig = {
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
      };

      const configDto1: DappConfig = { ...baseConfig, scopes: [] };
      const configDto2: DappConfig = { ...baseConfig, scopes: ["database"] };
      const configDto3: DappConfig = { ...baseConfig, scopes: ["discovery"] };

      // act
      const result1 = MockFactory.create(configDto1).getSchedulers();
      const result2 = MockFactory.create(configDto2).getSchedulers();
      const result3 = MockFactory.create(configDto3).getSchedulers();

      // assert
      expect(result1).toEqual([ConfigModuleMock, MongooseModuleMock]);
      expect(result2).toEqual([ConfigModuleMock, MongooseModuleMock]);
      expect(result3).toEqual([
        ConfigModuleMock,
        MongooseModuleMock,
        AccountsDiscoveryModuleMock,
        AssetsModuleMock,
        TransactionsModuleMock,
        BlocksModuleMock,
        DiscoverAccountsCommandMock,
        DiscoverAssetsCommandMock,
        DiscoverTransactionsCommandMock,
        DiscoverBlocksCommandMock,
      ]);
    });

    it("should return correct list of enabled schedulers", () => {
      // prepare
      const configDto: DappConfig = {
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["discovery"],
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
      };

      // act
      const result = MockFactory.create(configDto).getSchedulers();

      // assert
      expect(result).toStrictEqual([
        ConfigModuleMock,
        MongooseModuleMock,
        AccountsDiscoveryModuleMock,
        AssetsModuleMock,
        TransactionsModuleMock,
        BlocksModuleMock,
        DiscoverAccountsCommandMock,
        DiscoverAssetsCommandMock,
        DiscoverTransactionsCommandMock,
        DiscoverBlocksCommandMock,
      ]);
    });

    it("should return correct empty list of enabled schedulers", () => {
      // prepare
      const configDto: DappConfig = {
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: [],
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
      };

      // act
      const result = MockFactory.create(configDto).getSchedulers();

      // assert
      expect(result).toEqual([ConfigModuleMock, MongooseModuleMock]);
    });

    it("should return correct list of enabled schedulers for processor", () => {
      // prepare
      const configDto: DappConfig = {
        dappName: "Fake dApp",
        dappPublicKey: "FakePublicKeyOfAdApp",
        scopes: ["processor"],
        database: {
          host: "fake",
          port: "1",
          name: "fake-db",
          user: "fake-user",
        },
        frontendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
        backendApp: {
          url: "fake-url",
          host: "fake-domain",
          port: 1234,
          https: false,
        },
      };

      // act
      const result = MockFactory.create(configDto).getSchedulers();

      // assert
      expect(result).toEqual([
        ConfigModuleMock,
        MongooseModuleMock,
        OperationsModuleMock,
        ProcessOperationsCommandMock,
      ]);
    });
  });
});
