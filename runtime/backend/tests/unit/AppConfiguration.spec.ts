/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// force-mock the environment configuration
import "../mocks/config";

// force-mock the mongoose module `forRoot` call
const mongooseForRootCall: any = jest.fn(() => MongooseModuleMock);
const MongooseModuleMock: any = { forRoot: mongooseForRootCall };
jest.mock("@nestjs/mongoose", () => {
  return { MongooseModule: MongooseModuleMock };
});

// force-mock the event emitter module `forRoot` call
const eventEmitterForRootCall = jest.fn(() => EventEmitterModuleMock);
const EventEmitterModuleMock: any = { forRoot: eventEmitterForRootCall };
jest.mock("@nestjs/event-emitter", () => {
  return { EventEmitterModule: EventEmitterModuleMock };
});

// force-mock the mailer module `forRootAsync` call
const mailerForRootAsyncCall = jest.fn(() => MailerModuleMock);
const MailerModuleMock: any = { forRootAsync: mailerForRootAsyncCall };
jest.mock("@nestjs-modules/mailer", () => {
  return { MailerModule: MailerModuleMock };
});

// internal dependencies
import { AppConfiguration } from "../../src/AppConfiguration";
import { AssetsConfig } from "../../src/common/models/AssetsConfig";
import { DappConfig } from "../../src/common/models/DappConfig";
import { MonitoringConfig } from "../../src/common/models/MonitoringConfig";
import { NetworkConfig } from "../../src/common/models/NetworkConfig";
import { OAuthConfig } from "../../src/common/models/OAuthConfig";
import { SecurityConfig } from "../../src/common/models/SecurityConfig";
import { SocialConfig } from "../../src/common/models/SocialConfig";
import { StatisticsConfig } from "../../src/common/models/StatisticsConfig";
import { PayoutConfig } from "../../src/payout/models/PayoutConfig";
import { ProcessorConfig } from "../../src/processor/models/ProcessorConfig";
import { TransportConfig } from "../../src/notifier/models/TransportConfig";

// import configuration resources (mocked!)
import dappConfigLoader from "../../config/dapp"; // mocked in mocks/config.ts
import assetsConfigLoader from "../../config/assets"; // mocked in mocks/config.ts
import monitoringConfigLoader from "../../config/monitoring"; // mocked in mocks/config.ts
import networkConfigLoader from "../../config/network"; // mocked in mocks/config.ts
import oauthConfigLoader from "../../config/oauth"; // mocked in mocks/config.ts
import securityConfigLoader from "../../config/security"; // mocked in mocks/config.ts
import socialConfigLoader from "../../config/social"; // mocked in mocks/config.ts
import statisticsConfigLoader from "../../config/statistics"; // mocked in mocks/config.ts
import payoutConfigLoader from "../../config/payout"; // mocked in mocks/config.ts
import processorConfigLoader from "../../config/processor"; // mocked in mocks/config.ts
import transportConfigLoader from "../../config/transport"; // mocked in mocks/config.ts

describe("AppConfiguration", () => {
  let service: AppConfiguration;
  let fakeDappConfig: DappConfig; // <-- + type-check
  let fakeAssetsConfig: AssetsConfig;
  let fakeMonitoringConfig: MonitoringConfig;
  let fakeNetworkConfig: NetworkConfig;
  let fakeOAuthConfig: OAuthConfig;
  let fakePayoutConfig: PayoutConfig;
  let fakeProcessorConfig: ProcessorConfig;
  let fakeSecurityConfig: SecurityConfig;
  let fakeSocialConfig: SocialConfig;
  let fakeStatisticsConfig: StatisticsConfig;
  let fakeTransportConfig: TransportConfig;

  beforeEach(async () => {
    fakeDappConfig = dappConfigLoader();
    fakeAssetsConfig = assetsConfigLoader();
    fakeMonitoringConfig = monitoringConfigLoader();
    fakeNetworkConfig = networkConfigLoader();
    fakeOAuthConfig = oauthConfigLoader();
    fakePayoutConfig = payoutConfigLoader();
    fakeProcessorConfig = processorConfigLoader();
    fakeSecurityConfig = securityConfigLoader();
    fakeSocialConfig = socialConfigLoader();
    fakeStatisticsConfig = statisticsConfigLoader();
    fakeTransportConfig = transportConfigLoader();
    jest.clearAllMocks();

    // reset static members
    (AppConfiguration as any).DATABASE = undefined;
    (AppConfiguration as any).EVENT_EMITTER = undefined;
    (AppConfiguration as any).MAILER = undefined;
  });

  it("should be defined", () => {
    // act
    service = new AppConfiguration();

    // assert
    expect(service).toBeDefined();
  });

  describe("constructor()", () => {
    it("should load dapp configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).dapp).toBeDefined();
      expect((service as any).dapp).toStrictEqual(fakeDappConfig);
      const dappName = (service as any).dapp.dappName;
      expect(dappName).toStrictEqual("FAKEDAPP"); // <-- are we in FAKE mode?
    });

    it("should load assets configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).assets).toBeDefined();
      expect((service as any).assets).toStrictEqual(fakeAssetsConfig);
    });

    it("should load monitoring configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).monitoring).toBeDefined();
      expect((service as any).monitoring).toStrictEqual(fakeMonitoringConfig);
    });

    it("should load network configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).network).toBeDefined();
      expect((service as any).network).toStrictEqual(fakeNetworkConfig);
    });

    it("should load oauth configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).oauth).toBeDefined();
      expect((service as any).oauth).toStrictEqual(fakeOAuthConfig);
    });

    it("should load payout configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).payout).toBeDefined();
      expect((service as any).payout).toStrictEqual(fakePayoutConfig);
    });

    it("should load processor configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).processor).toBeDefined();
      expect((service as any).processor).toStrictEqual(fakeProcessorConfig);
    });

    it("should load security configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).security).toBeDefined();
      expect((service as any).security).toStrictEqual(fakeSecurityConfig);
    });

    it("should load social configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).social).toBeDefined();
      expect((service as any).social).toStrictEqual(fakeSocialConfig);
    });

    it("should load statistics configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).statistics).toBeDefined();
      expect((service as any).statistics).toStrictEqual(fakeStatisticsConfig);
    });

    it("should load transport configuration correctly", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect((service as any).transport).toBeDefined();
      expect((service as any).transport).toStrictEqual(fakeTransportConfig);
    });
  });

  describe("dappName()", () => {
    it("should return dappName from dapp configuration", () => {
      // act
      const actual = AppConfiguration.dappName;

      // assert
      expect(actual).toBe(fakeDappConfig.dappName);
    });
  });

  describe("getLoaders()", () => {
    it("should return all configuration loaders", () => {
      // act
      const actual = AppConfiguration.getLoaders();

      // assert
      expect(actual).toStrictEqual([
        dappConfigLoader,
        networkConfigLoader,
        securityConfigLoader,
        processorConfigLoader,
        oauthConfigLoader,
        assetsConfigLoader,
        statisticsConfigLoader,
        payoutConfigLoader,
        socialConfigLoader,
        monitoringConfigLoader,
        transportConfigLoader,
      ]);
    });
  });

  describe("getDatabaseUrl()", () => {
    it("should use correct database configuration", () => {
      // prepare
      const db = fakeDappConfig.database;

      // act
      const actual = AppConfiguration.getDatabaseUrl();

      // assert
      expect(actual).toBe((
        `mongodb://` +
          `${db.user}:${process.env.DB_PASS}` +
          `@` +
          `${db.host}:${db.port}` +
          `/` +
          `${db.name}?authSource=admin`
      ));
    })
  });

  describe("getDatabaseModule()", () => {
    it("should create instance using mongoose module", () => {
      // act
      const database = AppConfiguration.getDatabaseModule();

      // assert
      expect(database).toBeDefined();
    });

    it("should create exactly one instance using mongoose module", () => {
      // prepare
      const expectedUrl = "mongo://fake-url";
      const getDatabaseUrlMock = jest.fn().mockReturnValue(
        expectedUrl,
      );
      (AppConfiguration as any).getDatabaseUrl = getDatabaseUrlMock;

      // act
      const database1 = AppConfiguration.getDatabaseModule();
      const database2 = AppConfiguration.getDatabaseModule();
      const database3 = AppConfiguration.getDatabaseModule();

      // assert
      expect(database1).toBeDefined();
      expect(database2).toBeDefined();
      expect(database3).toBeDefined();
      expect(mongooseForRootCall).toHaveBeenCalledTimes(1); // once!
      expect(getDatabaseUrlMock).toHaveBeenCalledTimes(1); // once!
    });
  });

  describe("getEventEmitterModule()", () => {
    it("should create instance using event emitter module", () => {
      // act
      const eventEmitter = AppConfiguration.getEventEmitterModule();

      // assert
      expect(eventEmitter).toBeDefined();
    });

    it("should create exactly one instance using event emitter module", () => {
      // act
      const eventEmitter1 = AppConfiguration.getEventEmitterModule();
      const eventEmitter2 = AppConfiguration.getEventEmitterModule();
      const eventEmitter3 = AppConfiguration.getEventEmitterModule();

      // assert
      expect(eventEmitter1).toBeDefined();
      expect(eventEmitter2).toBeDefined();
      expect(eventEmitter3).toBeDefined();
      expect(eventEmitterForRootCall).toHaveBeenCalledTimes(1); // once!
    });

    it("should create instance using correct configuration", () => {
      // act
      const eventEmitter = AppConfiguration.getEventEmitterModule();

      // assert
      expect(eventEmitter).toBeDefined();
      expect(eventEmitterForRootCall).toHaveBeenCalledTimes(1);
      expect(eventEmitterForRootCall).toHaveBeenCalledWith({
        wildcard: false,
        delimiter: ".",
        maxListeners: 5,
        verboseMemoryLeak: true, // <-- debug!
        ignoreErrors: false,
      });
    });
  });

  describe("getMailerModule()", () => {
    it("should create instance using mailer module", () => {
      // act
      const mailer = AppConfiguration.getMailerModule();

      // assert
      expect(mailer).toBeDefined();
    });

    it("should create exactly one instance using mailer module", () => {
      // act
      const mailer1 = AppConfiguration.getMailerModule();
      const mailer2 = AppConfiguration.getMailerModule();
      const mailer3 = AppConfiguration.getMailerModule();

      // assert
      expect(mailer1).toBeDefined();
      expect(mailer2).toBeDefined();
      expect(mailer3).toBeDefined();
      expect(mailerForRootAsyncCall).toHaveBeenCalledTimes(1); // once!
    });
  });

  describe("checkMandatoryFields()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should throw an error given empty dappName", () => {
      // prepare
      (service as any).dapp = {
        ...(service as any).dapp,
        dappName: "", // <-- cannot be empty
      };

      // act + assert
      expect(() => AppConfiguration.checkMandatoryFields(service))
        .toThrow(`The configuration field "dappName" cannot be empty.`);
    });

    it("should throw an error given empty dappPublicKey", () => {
      // prepare
      (service as any).dapp = {
        ...(service as any).dapp,
        dappPublicKey: "", // <-- cannot be empty
      };

      // act + assert
      expect(() => AppConfiguration.checkMandatoryFields(service))
        .toThrow(`The configuration field "dappPublicKey" cannot be empty.`);
    });

    it("should throw an error given invalid scopes", () => {
      // prepare
      (service as any).dapp = {
        ...(service as any).dapp,
        scopes: [], // <-- cannot be empty
      };

      // act + assert
      expect(() => AppConfiguration.checkMandatoryFields(service))
        .toThrow(`The configuration field "scopes" must be a non-empty array.`);
    });

    it("should throw an error given missing mandatory scopes", () => {
      // prepare
      (service as any).dapp = {
        ...(service as any).dapp,
        scopes: [
          "payout",
          "notifier",
        ], // <-- missing obligatory
      };

      // act + assert
      expect(() => AppConfiguration.checkMandatoryFields(service))
        .toThrow(`The application scopes "database" and "discovery" cannot be disabled.`);
    });

    it("should throw an error given empty discovery sources", () => {
      // prepare
      (service as any).dapp = {
        ...(service as any).dapp,
        discovery: {
          sources: [], // <-- cannot be empty
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkMandatoryFields(service))
        .toThrow(`The configuration field "discovery.sources" must be a non-empty array.`);
    });

    it("should return true given a valid configuration object", () => {
      // this test uses untouched configuration
      // act
      const actual = AppConfiguration.checkMandatoryFields(service);

      // assert
      expect(actual).toBe(true); // <-- mocked config is valid
    });
  });

  describe("checkDatabaseConnection()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should throw an error given unestablished connection", () => {
      // prepare
      const database = fakeDappConfig.database;
      (AppConfiguration as any).getDatabaseModule = jest.fn().mockImplementation(
        () => { throw new Error("An error occured") }, // <-- force-throw
      );

      // act + assert
      expect(() => AppConfiguration.checkDatabaseConnection(service)).toThrow(
        `Could not establish a connection to the database with host: ` +
          `${database.host} and port: ${database.port}.`,
      );
    });

    it("should return true given a valid configuration object", () => {
      // this test uses untouched configuration
      // prepare
      (AppConfiguration as any).getDatabaseModule = jest.fn();

      // act
      const actual = AppConfiguration.checkDatabaseConnection(service);

      // assert
      expect(actual).toBe(true); // <-- mocked config is valid
    });
  });

  describe("checkNetworkConnection()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should throw an error given invalid defaultNode", () => {
      // prepare
      (service as any).network = {
        ...(service as any).network,
        defaultNode: undefined, // <-- cannot be empty
      };

      // act + assert
      expect(() => AppConfiguration.checkNetworkConnection(service))
        .toThrow(`The configuration field "defaultNode" cannot be empty.`);
    });

    it("should throw an error given empty generationHash", () => {
      // prepare
      (service as any).network = {
        ...(service as any).network,
        network: {
          // missing generationHash
          networkIdentifier: "1234",
          epochAdjustment: "1234",
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkNetworkConnection(service))
        .toThrow(`The configuration field "network.generationHash" cannot be empty.`);
    });

    it("should throw an error given empty networkIdentifier", () => {
      // prepare
      (service as any).network = {
        ...(service as any).network,
        network: {
          generationHash: "1234",
          // missing networkIdentifier
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkNetworkConnection(service))
        .toThrow(`The configuration field "network.networkIdentifier" cannot be empty.`);
    });

    it("should throw an error given empty epochAdjustment", () => {
      // prepare
      (service as any).network = {
        ...(service as any).network,
        network: {
          generationHash: "1234",
          networkIdentifier: "1234",
          // missing epochAdjustment
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkNetworkConnection(service))
        .toThrow(`The configuration field "network.epochAdjustment" cannot be empty.`);
    });

    it("should return true given a valid configuration object", () => {
      // this test uses untouched configuration
      // act
      const actual = AppConfiguration.checkNetworkConnection(service);

      // assert
      expect(actual).toBe(true); // <-- mocked config is valid
    });
  });

  describe("checkMandatoryAssets()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should throw an error given missing obligatory asset configuration", () => {
      // prepare
      (service as any).assets = {
        assets: {
          // missing "base" asset
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkMandatoryAssets(service)).toThrow(
        `The configuration field "assets.base" cannot be empty.`,
      );
    });

    it("should return true given a valid configuration object", () => {
      // this test uses untouched configuration
      // act
      const actual = AppConfiguration.checkMandatoryAssets(service);

      // assert
      expect(actual).toBe(true); // <-- mocked config is valid
    });
  });

  describe("checkSecuritySettings()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should throw an error given empty authentication secret", () => {
      // prepare
      (service as any).security = {
        auth: {
          secret: "", // <-- cannot be empty
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkSecuritySettings(service)).toThrow(
        `The configuration field "auth.secret" cannot be empty.`,
      );
    });

    it("should throw an error given invalid challenge size", () => {
      // prepare
      (service as any).security = {
        auth: {
          secret: "1234",
          // missing challengeSize
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkSecuritySettings(service)).toThrow(
        `The configuration field "auth.challengeSize" ` +
          `must contain a number greater than or equal to 3.`
      );
    });

    it("should throw an error given empty authentication registries", () => {
      // prepare
      (service as any).security = {
        auth: {
          secret: "1234",
          challengeSize: 8,
          registries: [], // cannot be empty
        },
      };

      // act + assert
      expect(() => AppConfiguration.checkSecuritySettings(service)).toThrow(
        `The configuration field "auth.registries" must contain an array ` +
          `with at least one address of an account on dHealth Network.`
      );
    });

    it("should return true given a valid configuration object", () => {
      // this test uses untouched configuration
      // act
      const actual = AppConfiguration.checkSecuritySettings(service);

      // assert
      expect(actual).toBe(true); // <-- mocked config is valid
    });
  });
});

