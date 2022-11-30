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
const CommonAccountsModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/AccountsModule", () => {
  return { AccountsModule: CommonAccountsModuleMock };
});

const CommonAuthModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/AuthModule", () => {
  return { AuthModule: CommonAuthModuleMock };
});

const CommonChallengesModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/ChallengesModule", () => {
  return { ChallengesModule: CommonChallengesModuleMock };
});

const CommonHelpersModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/HelpersModule", () => {
  return { HelpersModule: CommonHelpersModuleMock };
});

const CommonNetworkModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/NetworkModule", () => {
  return { NetworkModule: CommonNetworkModuleMock };
});

const CommonQueryModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/QueryModule", () => {
  return { QueryModule: CommonQueryModuleMock };
});

const CommonStateModuleMock: any = jest.fn();
jest.mock("../../../src/common/modules/StateModule", () => {
  return { StateModule: CommonStateModuleMock };
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

const StatisticsModuleImplMock: any = jest.fn();
jest.mock("../../../src/statistics/modules/StatisticsModule", () => {
  return { StatisticsModule: StatisticsModuleImplMock };
});

// notifier scope
const NotifierModuleMock: any = jest.fn();
jest.mock("../../../src/notifier/NotifierModule", () => {
  return { NotifierModule: NotifierModuleMock };
});

// oauth scope
const WebHooksModuleMock: any = jest.fn();
jest.mock("../../../src/oauth/modules/WebHooksModule", () => {
  return { WebHooksModule: WebHooksModuleMock };
});

const OAuthModuleMock: any = jest.fn();
jest.mock("../../../src/oauth/OAuthModule", () => {
  return { OAuthModule: OAuthModuleMock };
});

// users scope
const ActivitiesModuleMock: any = jest.fn();
jest.mock("../../../src/users/modules/ActivitiesModule", () => {
  return { ActivitiesModule: ActivitiesModuleMock };
});

const UsersModuleMock: any = jest.fn();
jest.mock("../../../src/users/UsersModule", () => {
  return { UsersModule: UsersModuleMock };
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

const UserAggregationCommandMock: any = jest.fn();
jest.mock(
  "../../../src/statistics/schedulers/UserAggregation/UserAggregationCommand",
  () => {
    return { UserAggregationCommand: UserAggregationCommandMock };
  },
);

const ActivityPayoutsCommandMock: any = jest.fn();
jest.mock(
  "../../../src/payout/schedulers/ActivityPayouts/ActivityPayoutsCommand",
  () => {
    return { ActivityPayoutsCommand: ActivityPayoutsCommandMock };
  }
);

const ReportNotifierCommandMock: any = jest.fn();
jest.mock(
  "../../../src/notifier/schedulers/ReportNotifier/ReportNotifierCommand",
  () => {
    return { ReportNotifierCommand: ReportNotifierCommandMock };
  },
);

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
    expect(mongooseForRootCall).toHaveBeenCalledTimes(1); // imported through AppConfiguration.getDatabaseModule(db)
    expect(actualModules).toEqual([ConfigModuleMock, MongooseModuleMock]);
  });

  it("should use correct database configuration", () => {
    // prepare
    const expectedPayload: string = `mongodb://fake-user:fake-pass@fake-host:1234/fake-db-name?authSource=admin`;

    // act
    actualModules = MockFactory.create(dappConfig).getModules();

    // assert
    expect(mongooseForRootCall).toHaveBeenCalledTimes(1); // imported through AppConfiguration.getDatabaseModule(db)
    expect(mongooseForRootCall).toHaveBeenCalledWith(expectedPayload);
  });
});
