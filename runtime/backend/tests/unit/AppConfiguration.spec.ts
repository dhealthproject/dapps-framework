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
import "../mocks/global";
import {
  mockDappConfigLoaderCall,
  mockAssetsConfigLoaderCall,
  mockNetworkConfigLoaderCall,
  mockOauthConfigLoaderCall,
  mockPayoutConfigLoaderCall,
  mockProcessorConfigLoaderCall,
  mockSecurityConfigLoaderCall,
  mockStatisticsConfigLoaderCall,
  mockSocialConfigLoaderCall,
  mockMonitoringConfigLoaderCall,
  mockTransportConfigLoaderCall,
} from "../mocks/config";

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
const configService = {
  get: jest.fn().mockReturnValue({
    mailConfig: mockTransportConfigLoaderCall().mailer,
  }),
}
const mailerForRootAsyncCall: any = jest.fn((params: any) => {
  params.useFactory(configService);
  return MailerModuleMock
});
const MailerModuleMock: any = { forRootAsync: mailerForRootAsyncCall };
jest.mock("@nestjs-modules/mailer", () => {
  return { MailerModule: MailerModuleMock };
});

// external dependencies
import { Account, Address, PublicAccount } from "@dhealth/sdk";

// internal dependencies
import { AppConfiguration } from "../../src/AppConfiguration";
import { ConfigurationError } from "../../src/common/errors/ConfigurationError";
import { AssetsConfig } from "../../src/common/models/AssetsConfig";
import { DappConfig } from "../../src/common/models/DappConfig";
import { MonitoringConfig } from "../../src/common/models/MonitoringConfig";
import { NetworkConfig } from "../../src/common/models/NetworkConfig";
import { SecurityConfig } from "../../src/common/models/SecurityConfig";
import { SocialConfig } from "../../src/common/models/SocialConfig";
import { StatisticsConfig } from "../../src/common/models/StatisticsConfig";
import { OAuthConfig } from "../../src/oauth/models/OAuthConfig";
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    // act
    service = new AppConfiguration();

    // assert
    expect(service).toBeDefined();
  });

  describe("constructor()", () => {

    it("should use correct configuration loaders", () => {
      // act
      service = new AppConfiguration();

      // assert
      expect(mockDappConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockAssetsConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockNetworkConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockOauthConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockPayoutConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockProcessorConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockSecurityConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockStatisticsConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockSocialConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockMonitoringConfigLoaderCall).toHaveBeenCalledTimes(1);
      expect(mockTransportConfigLoaderCall).toHaveBeenCalledTimes(1);
    });

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

  describe("static getConfig()", () => {
    it("should return correct config section", () => {
      // prepare
      const configSections = [
        "assets",
        "dapp",
        "network",
        "oauth",
        "payout",
        "processor",
        "security",
        "statistics",
        "social",
        "monitoring",
        "transport",
      ];
      const loaderCalls = [
        mockAssetsConfigLoaderCall,
        mockDappConfigLoaderCall,
        mockNetworkConfigLoaderCall,
        mockOauthConfigLoaderCall,
        mockPayoutConfigLoaderCall,
        mockProcessorConfigLoaderCall,
        mockSecurityConfigLoaderCall,
        mockStatisticsConfigLoaderCall,
        mockSocialConfigLoaderCall,
        mockMonitoringConfigLoaderCall,
        mockTransportConfigLoaderCall,
      ]
      configSections.forEach((configSection: string, index: number) => {
        // act
        const result = AppConfiguration.getConfig(configSection);

        // assert
        expect(loaderCalls[index]).toHaveBeenCalledTimes(1); // first call was in constructor
        expect(result).toBeDefined();
      })
    });

    it("should throw error if section name is not defined/in list", () => {
      // prepare
      [
        undefined,
        null,
        "",
        true,
        "some-non-existing-section"
      ].forEach((configSection: any) => {
        const expectedError = new Error(`Cannot find relevant config for section: ${configSection}`);

        // act
        const result = () => AppConfiguration.getConfig(configSection);

        // assert
        expect(result).toThrowError(expectedError);
      });
    });
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
      expect(mailer1).toBe(mailer2);
      expect(mailer1).toBe(mailer3);
      expect(mailer2).toBe(mailer3);
      expect(mailerForRootAsyncCall).toHaveBeenCalledTimes(1); // once!
      expect(configService.get).toHaveBeenCalledTimes(1); // once!
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

    it("should throw error given any missing mandatory configuration fields", () => {

      const mandatoryFields: any = [
        { name: "dappName", value: undefined },
        { name: "dappPublicKey", value: undefined },
        { name: "scopes", value: undefined },
        { name: "scopes", value: ["other-scope"] },
        { name: "backendApp", value: undefined },
        { name: "discovery", value: undefined },
        { name: "discovery", value: null },
        { name: "discovery", value: {} },
        { name: "discovery", value: [] },
        { name: "discovery", value: { sources: undefined } },
        { name: "discovery", value: { sources: [] } },
      ];
      const expectedErrorMessages = [
        `The configuration field "dappName" cannot be empty.`,
        `The configuration field "dappPublicKey" cannot be empty.`,
        `The configuration field "scopes" must be a non-empty array.`,
        `The application scopes "database" and "discovery" cannot be disabled.`,
        `The configuration field "backendApp" cannot be empty.`,
        `The configuration field "discovery.sources" must be a non-empty array.`,
        `Cannot use 'in' operator to search for 'sources' in null`,
        `The configuration field "discovery.sources" must be a non-empty array.`,
        `The configuration field "discovery.sources" must be a non-empty array.`,
        `The configuration field "discovery.sources" must be a non-empty array.`,
        `The configuration field "discovery.sources" must be a non-empty array.`,
      ];
      mandatoryFields.forEach((field: {name: string, value: any}, index: number) => {
        // prepare
        const config: any = {
          dapp: {
            dappName: "test-dappName",
            dappPublicKey: "test-dappPublicKey",
            scopes: [ "database", "discovery" ],
            backendApp: { url: "test-url" },
            discovery: { sources: ["test-source"] }  
          }
        };
        config.dapp[field.name] = field.value;

        // act
        const result = () => AppConfiguration.checkMandatoryFields(config);

        // assert
        expect(result).toThrowError(new ConfigurationError(expectedErrorMessages[index]));
      });
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

    it("should throw error given any missing mandatory configuration fields", () => {
      // prepare
      const mandatoryFields: any = [
        { name: "defaultNode", value: undefined },
        { name: "defaultNode", value: {
            defaultNode: {
              url: "test-url",
            }
          }
        },
        { name: "network", value: undefined },
        { name: "network", value: {
            epochAdjustment: "test-epochAdjustment",
            networkIdentifier: "test-networkIdentifier",
          }
        },
        { name: "network", value: {
            generationHash: "test-generationHash",
            epochAdjustment: "test-epochAdjustment",
          }
        },
        { name: "network", value: {
            generationHash: "test-generationHash",
            networkIdentifier: "test-networkIdentifier",
          }
        },
      ];
      const expectedErrorMessages = [
        `The configuration field "defaultNode" cannot be empty.`,
        `The configuration field "defaultNode" cannot be empty.`,
        `The configuration field "network.generationHash" cannot be empty.`,
        `The configuration field "network.generationHash" cannot be empty.`,
        `The configuration field "network.networkIdentifier" cannot be empty.`,
        `The configuration field "network.epochAdjustment" cannot be empty.`,
      ];
      mandatoryFields.forEach((field: {name: string, value: any}, index: number) => {
        // prepare
        const config: any = {
          network: {
            defaultNode: {
              url: "test-url",
            },
            network: {
              generationHash: "test-generationHash",
              networkIdentifier: "test-networkIdentifier",
              epochAdjustment: "test-epochAdjustment",
            },
          }
        };
        config.network[field.name] = field.value;

        // act
        const result = () => AppConfiguration.checkNetworkConnection(config);

        // assert
        expect(result).toThrowError(new ConfigurationError(expectedErrorMessages[index]));
      });
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

    it("should throw error given any missing mandatory configuration fields", () => {
      // prepare
      const mandatoryFields: any = [
        { name: "auth", value: undefined },
        { name: "auth", value: {
            challengeSize: 3,
            registries: [ "test-registry" ],
          }
        },
        { name: "auth", value: {
            secret: "",
            challengeSize: 3,
            registries: [ "test-registry" ],
          }
        },
        { name: "auth", value: {
            secret: "test-secret",
            registries: [ "test-registry" ],
          }
        },
        { name: "auth", value: {
            secret: "test-secret",
            challengeSize: 2,
            registries: [ "test-registry" ],
          }
        },
        { name: "auth", value: {
            secret: "test-secret",
            challengeSize: 3,
          }
        },
        { name: "auth", value: {
            secret: "test-secret",
            challengeSize: 3,
            registries: [],
          }
        },
      ];
      const expectedErrorMessages = [
        `The configuration field "auth.secret" cannot be empty.`,
        `The configuration field "auth.secret" cannot be empty.`,
        `The configuration field "auth.secret" cannot be empty.`,
        `The configuration field "auth.challengeSize" must contain a number greater than or equal to 3.`,
        `The configuration field "auth.challengeSize" must contain a number greater than or equal to 3.`,
        `The configuration field "auth.registries" must contain an array with at least one address of an account on dHealth Network.`,
        `The configuration field "auth.registries" must contain an array with at least one address of an account on dHealth Network.`,
      ];
      mandatoryFields.forEach((field: {name: string, value: any}, index: number) => {
        // prepare
        const config: any = {
          security: {
            auth: {
              secret: "test-secret",
              challengeSize: 3,
              registries: [ "test-registry" ],
            },  
          }
        };
        config.security[field.name] = field.value;

        // act
        const result = () => AppConfiguration.checkSecuritySettings(config);

        // assert
        expect(result).toThrowError(new ConfigurationError(expectedErrorMessages[index]));
      });
    });

    it("should return true given a valid configuration object", () => {
      // this test uses untouched configuration
      // act
      const actual = AppConfiguration.checkSecuritySettings(service);

      // assert
      expect(actual).toBe(true); // <-- mocked config is valid
    });
  });

  describe("checkApplicationScopes()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should check the configuration of activated scopes", () => {
      // prepare
      const mockCheckDiscoverySettings = jest
        .spyOn((AppConfiguration as any), "checkDiscoverySettings");
      const mockCheckProcessorSettings = jest
        .spyOn((AppConfiguration as any), "checkProcessorSettings");
      const mockCheckPayoutSettings = jest
        .spyOn((AppConfiguration as any), "checkPayoutSettings");
      const mockCheckOAuthSettings = jest
        .spyOn((AppConfiguration as any), "checkOAuthSettings");

      // act
      AppConfiguration.checkApplicationScopes(service);
      
      // assert
      expect(mockCheckDiscoverySettings).toHaveBeenCalledTimes(1);
      expect(mockCheckProcessorSettings).toHaveBeenCalledTimes(1);
      expect(mockCheckPayoutSettings).toHaveBeenCalledTimes(1);
      expect(mockCheckOAuthSettings).toHaveBeenCalledTimes(1);
    });

    it("should not check the configuration of disabled scopes", () => {
      // prepare
      (service as any).dapp = {
        ...(service as any).dapp,
        scopes: ["discovery", "database"], // payout + processor disabled
      }
      const mockCheckDiscoverySettings = jest
        .spyOn((AppConfiguration as any), "checkDiscoverySettings");
      const mockCheckProcessorSettings = jest
        .spyOn((AppConfiguration as any), "checkProcessorSettings");
      const mockCheckPayoutSettings = jest
        .spyOn((AppConfiguration as any), "checkPayoutSettings");
      const mockCheckOAuthSettings = jest
        .spyOn((AppConfiguration as any), "checkOAuthSettings");

      // act
      AppConfiguration.checkApplicationScopes(service);

      // assert
      expect(mockCheckDiscoverySettings).toHaveBeenCalledTimes(1);
      expect(mockCheckProcessorSettings).not.toHaveBeenCalled();
      expect(mockCheckPayoutSettings).not.toHaveBeenCalled();
      expect(mockCheckOAuthSettings).not.toHaveBeenCalled();
    });

    it("should return true given a valid configuration object", () => {
      // this test uses untouched configuration
      // act
      const actual = AppConfiguration.checkApplicationScopes(service);

      // assert
      expect(actual).toBe(true); // <-- mocked config is valid
    });
  });

  describe("checkDiscoverySettings()", () => {
    it("should run correcty and return true", () => {
      // prepare
      PublicAccount.createFromPublicKey = jest.fn().mockReturnValue(true);

      // act
      const result = (AppConfiguration as any).checkDiscoverySettings({
        dapp: {
          dappPublicKey: "test-dappPublicKey",
          discovery: { sources: ["0123456789012345678901234567890123456789012345678901234567890123"] }
        },
        network: { network: { networkIdentifier: "test-networkIdentifier" } },
      });

      // assert
      expect(result).toBe(true);
      expect(PublicAccount.createFromPublicKey).toHaveBeenNthCalledWith(
        1,
        "test-dappPublicKey",
        "test-networkIdentifier",
      );
      expect(PublicAccount.createFromPublicKey).toHaveBeenNthCalledWith(
        2,
        "0123456789012345678901234567890123456789012345678901234567890123",
        "test-networkIdentifier",
      );
    });

    it("should throw ConfigurationError if error was caught while creating account from public key", () => {
      // prepare
      const expectedError = new ConfigurationError(
        `The configuration field "dappPublicKey" must contain ` +
        `a valid 32-bytes public key in hexadecimal format.`
      );
      PublicAccount.createFromPublicKey = jest.fn(() => { throw new Error("error") });

      // act
      const result = () => (AppConfiguration as any).checkDiscoverySettings({
        dapp: {
          dappPublicKey: "test-dappPublicKey",
          discovery: { sources: ["test-source"] }
        },
        network: { network: { networkIdentifier: "test-networkIdentifier" } },
      });

      // assert
      expect(result).toThrow(expectedError);
      expect(PublicAccount.createFromPublicKey).toHaveBeenNthCalledWith(
        1,
        "test-dappPublicKey",
        "test-networkIdentifier",
      );
    });

    it("should throw ConfigurationError if error was caught while creating address from raw value", () => {
      // prepare
      const expectedError = new ConfigurationError(
        `The configuration field "discovery.sources" must contain ` +
          `an array of valid 32-bytes public keys in hexadecimal format ` +
          `or valid addresses that are compatible with dHealth Network.`,
      );
      PublicAccount.createFromPublicKey = jest.fn().mockReturnValue(true);
      Address.createFromRawAddress = jest.fn(() => { throw new Error("error") });

      // act
      const result = () => (AppConfiguration as any).checkDiscoverySettings({
        dapp: {
          dappPublicKey: "test-dappPublicKey",
          discovery: { sources: ["test-source"] }
        },
        network: { network: { networkIdentifier: "test-networkIdentifier" } },
      });

      // assert
      expect(result).toThrow(expectedError);
      expect(PublicAccount.createFromPublicKey).toHaveBeenNthCalledWith(
        1,
        "test-dappPublicKey",
        "test-networkIdentifier",
      );
      expect(Address.createFromRawAddress).toHaveBeenNthCalledWith(
        1,
        "test-source",
      )
    });
  });

  describe("checkPayoutSettings()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should throw ConfigurationError if payouts information is empty or invalid", () => {
      // prepare
      [undefined, {}, {issuerPrivateKey: ""}].forEach((payouts: any) => {
        (service as any).payout.payouts = payouts;
        const expectedError = new ConfigurationError(
          `The configuration field "payouts.issuerPrivateKey" cannot be empty.`,
        );

        // act
        const result = () => (AppConfiguration as any).checkPayoutSettings(service);

        // assert
        expect(result).toThrow(expectedError);
      });
    });

    it("should throw ConfigurationError if error was caught while creating account from private key", () => {
      // prepare
      (service as any).payout.payouts = {
        issuerPrivateKey: "test-issuerPrivateKey",
      };
      const expectedError = new ConfigurationError(
        `The configuration field "payouts.issuerPrivateKey" must ` +
          `contain a valid 32-bytes private key in hexadecimal format.`,
      );
      Account.createFromPrivateKey = jest.fn(() => { throw new Error("error") });

      // // act
      const result = () => (AppConfiguration as any).checkPayoutSettings(service);

      // // assert
      expect(result).toThrow(expectedError);
      expect(Account.createFromPrivateKey).toHaveBeenNthCalledWith(
        1,
        "test-issuerPrivateKey",
        104,
      );
    });
  });

  describe("checkProcessorSettings()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("shoud run correctly and return true", () => {
      // prepare
      (service as any).processor.contracts = ["test-contract"];
      (service as any).processor.operations = ["test-operation"];

      // act
      const result = (AppConfiguration as any).checkProcessorSettings(service);

      // assert
      expect(result).toBe(true);
    });

    it("should throw ConfigurationError if contracts is undefined/empty", () => {
      // prepare
      [undefined, []].forEach((contracts: any) => {
        (service as any).processor.contracts = contracts;
        const expectedError = new ConfigurationError(
          `The configuration field "contracts" must be a non-empty array.`,
        );

        // act
        const result = () => (AppConfiguration as any).checkProcessorSettings(service);

        // assert
        expect(result).toThrow(expectedError);
      });
    });

    it("should throw ConfigurationError if operations is undefined/empty", () => {
      // prepare
      [undefined, []].forEach((operations: any) => {
        (service as any).processor.contracts = ["test-contract"];
        (service as any).processor.operations = operations;
        const expectedError = new ConfigurationError(
          `The configuration field "operations" must be a non-empty array.`,
        );

        // act
        const result = () => (AppConfiguration as any).checkProcessorSettings(service);

        // assert
        expect(result).toThrow(expectedError);
      });
    });
  });

  describe("checkOAuthSettings()", () => {
    beforeEach(() => {
      service = new AppConfiguration();
    });

    it("should throw ConfigurationError if providers is undefined", () => {
      // prepare
      (service as any).oauth.providers = undefined;
      const expectedError = new ConfigurationError(
        `The configuration field "providers" cannot be empty.`,
      );

      // act
      const result = () => (AppConfiguration as any).checkOAuthSettings(service);

      // assert
      expect(result).toThrow(expectedError);
    });

    it("should throw ConfigurationError if strava is undefined or is not in providers", () => {
      // prepare
      [ {}, { strava: undefined }].forEach((providers) => {
        (service as any).oauth.providers = providers;
        const expectedError = new ConfigurationError(
          `The configuration field "providers.strava" cannot be empty.`,
        );
  
        // act
        const result = () => (AppConfiguration as any).checkOAuthSettings(service);
  
        // assert
        expect(result).toThrow(expectedError);  
      });
    });

    it("should throw ConfigurationError if scopes don't include users", () => {
      // prepare
      (service as any).oauth.providers = { strava: "test-strava" };
      (service as any).dapp.scopes = ["test-scope"];
      const expectedError = new ConfigurationError(
        `The application scope "users" cannot be disabled.`,
      );

      // act
      const result = () => (AppConfiguration as any).checkOAuthSettings(service);

      // assert
      expect(result).toThrow(expectedError);  
    });
  });
});
