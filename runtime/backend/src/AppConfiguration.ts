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
import { MongooseModule } from "@nestjs/mongoose";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { Account, Address, PublicAccount } from "@dhealth/sdk";

// internal dependencies
import { ConfigurationError } from "./common/errors/ConfigurationError";

// configuration models
// common scope
import { AssetsConfig } from "./common/models/AssetsConfig";
import { DappConfig } from "./common/models/DappConfig";
import { DatabaseConfig } from "./common/models/DatabaseConfig";
import { NetworkConfig } from "./common/models/NetworkConfig";
import { OAuthConfig } from "./common/models/OAuthConfig";
import { SecurityConfig } from "./common/models/SecurityConfig";
import { StatisticsConfig } from "./common/models/StatisticsConfig";
import { SocialConfig } from "./common/models/SocialConfig";
import { MonitoringConfig } from "./common/models/MonitoringConfig";

// payout scope
import { PayoutConfig } from "./payout/models/PayoutConfig";

// processor scope
import { ProcessorConfig } from "./processor/models/ProcessorConfig";

// notifier scope
import { TransportConfig } from "./notifier/models/TransportConfig";

// import configuration resources
import assetsConfigLoader from "../config/assets";
import dappConfigLoader from "../config/dapp";
import networkConfigLoader from "../config/network";
import oauthConfigLoader from "../config/oauth";
import payoutConfigLoader from "../config/payout";
import processorConfigLoader from "../config/processor";
import securityConfigLoader from "../config/security";
import statisticsConfigLoader from "../config/statistics";
import socialConfigLoader from "../config/social";
import monitoringConfigLoader from "../config/monitoring";
import transportConfigLoader from "../config/transport";

/**
 * @class AppConfiguration
 * @description The main configuration module used for verifications
 * on the configuration of runtimes. This class defines the rules of
 * validation of a configuration object for dApp runtimes.
 * <br /><br />
 * #### Rules
 * - `dappName` cannot be empty
 * - `dappPublicKey` cannot be empty
 * @todo add all configuration validity rules
 *
 * @since v0.4.0
 */
export class AppConfiguration {
  /**
   * The dApp database module using {@link MongooseModule} from nestjs.
   * This object is *not* available outside of this class and is defined
   * to limit the number of instances created which open a request to
   * connect to the database.
   * <br /><br />
   * Storage of a *singular* database connection adapter is how we make
   * sure that the database is only connected to once.
   *
   * @access private
   * @static
   * @var {MongooseModule}
   */
  private static DATABASE: MongooseModule;

  /**
   * The dApp event emitter module using {@link EventEmitterModule} from nestjs.
   * This object is *not* available outside of this class and is defined
   * to limit the number of instances created which serves as the application's
   * internal event emitter/handler.
   * <br /><br />
   * Storage of a *singular* event emitter adapter is how we make
   * sure that the application is using only one.
   *
   * @access private
   * @static
   * @var {EventEmitterModule}
   */
    private static EVENT_EMITTER: EventEmitterModule;

  /**
   * The dApp assets configuration. This configuration object is used to
   * determine assets discovery information and to determine how fees are
   * paid for transactions issued by this dApp.
   * <br /><br />
   * #### Reference
   * {@link AssetsConfig:CONFIG}
   *
   * @access protected
   * @var {AssetsConfig}
   */
  protected assets: AssetsConfig;

  /**
   * The dApp configuration object. This configuration object is used to
   * determine general settings of this dApp runtime including its' name,
   * its' main public key or scopes that are enabled for the dApp in the
   * backend runtime.
   * <br /><br />
   * #### Reference
   * {@link DappConfig:CONFIG}
   *
   * @access protected
   * @var {DappConfig}
   */
  protected dapp: DappConfig;

  /**
   * The dApp network configuration. This configuration object is used to
   * determine communication, transport and network information.
   * <br /><br />
   * #### Reference
   * {@link NetworkConfig:CONFIG}
   *
   * @access protected
   * @var {NetworkConfig}
   */
  protected network: NetworkConfig;

  /**
   * The dApp OAuth configuration. This configuration object is used to
   * determine communication, transport and processes that are used to
   * connect and integrate with custom *data providers*.
   * #### Reference
   * {@link OAuthConfig:CONFIG}
   *
   * @access protected
   * @var {OAuthConfig}
   */
  protected oauth: OAuthConfig;

  /**
   * The dApp payouts configuration. This configuration object is used to
   * determine how payouts are created for this dApp and determines the
   * source of tokens.
   * <br /><br />
   * Note that this configuration may be *disabled* in the cases where
   * the payout scope is disabled.
   * <br /><br />
   * #### Reference
   * {@link PayoutConfig:CONFIG}
   *
   * @access protected
   * @var {PayoutConfig}
   */
  protected payout: PayoutConfig;

  /**
   * The dApp processor configuration. This configuration object is used to
   * determine how information is processed into *operations* for this dApp.
   * <br /><br />
   * #### Reference
   * {@link ProcessorConfig:CONFIG}
   *
   * @access protected
   * @var {ProcessorConfig}
   */
  protected processor: ProcessorConfig;

  /**
   * The dApp security configuration. This configuration object is used to
   * determine communication, transport and processes are encrypted in scope
   * that are critical to the security of a runtime.
   * <br /><br />
   * #### Reference
   * {@link SecurityConfig:CONFIG}
   *
   * @access protected
   * @var {SecurityConfig}
   */
  protected security: SecurityConfig;

  /**
   * The dApp statistics configuration. This configuration object is used to
   * determine how aggregations are performed and stored in the database to
   * enable much faster aggregated data access (e.g. leaderboards).
   * <br /><br />
   * #### Reference
   * {@link StatisticsConfig:CONFIG}
   *
   * @access protected
   * @var {StatisticsConfig}
   */
  protected statistics: StatisticsConfig;

  /**
   * The dApp social platforms configuration. This configuration object is
   * used to determine social platforms are integrated to *share content*.
   * <br /><br />
   * #### Reference
   * {@link SocialConfig:CONFIG}
   *
   * @access protected
   * @var {SocialConfig}
   */
  protected social: SocialConfig;

  /**
   * The dApp monitoring configuration. This configuration
   * object is used to determine dApp monitoring information.
   * <br /><br />
   * #### Reference
   * {@link MonitoringConfig:CONFIG}
   *
   * @access protected
   * @var {MonitoringConfig}
   */
  protected monitoring: MonitoringConfig;

  /**
   * The dApp transport configuration. This configuration
   * is used to determine dApp monitoring transport information.
   * <br /><br />
   * #### Reference
   * {@link TransportConfig:CONFIG}
   *
   * @access protected
   * @var {TransportConfig}
   */
  protected transport: TransportConfig;

  /**
   * Construct an instance of this application configuration.
   * <br /><br />
   * CAUTION: Creating an instance of this class automatically interprets
   * the runtime configuration. Because of this, any errors that are present
   * in the *syntax* of your runtime configuration must be solved before
   * this method gets called by the runtime.
   *
   * @internal
   * @access public
   */
  public constructor() {
    // interprets configuration
    this.assets = assetsConfigLoader();
    this.dapp = dappConfigLoader();
    this.network = networkConfigLoader();
    this.oauth = oauthConfigLoader();
    this.payout = payoutConfigLoader();
    this.processor = processorConfigLoader();
    this.security = securityConfigLoader();
    this.statistics = statisticsConfigLoader();
    this.social = socialConfigLoader();
    this.monitoring = monitoringConfigLoader();
    this.transport = transportConfigLoader();
  }

  /**
   * This static helper *getter* method returns the curently configured
   * dApp name as is used in multiple places of this runtime.
   *
   * @access public
   * @static
   * @returns {string}
   */
  public static get dappName(): string {
    const dappConfig = dappConfigLoader();
    return dappConfig.dappName;
  }

  /**
   * This static helper method returns all the configuration loaders. This
   * method *does not* interpret the content of configuration objects.
   * <br /><br />
   * This method is used during the nestjs initialization process inside
   * the private constructor of {@link ScopeFactory:COMMON}.
   *
   * @access public
   * @static
   * @returns {(() => {})[]}  An array of initializer functions.
   */
  public static getLoaders(): (() => {})[] {
    return [
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
    ];
  }

  /**
   * This method initializes the internal *database connection adapter*.
   * <br /><br />
   * You should not have to call this method manually, it is used inside
   * {@link Schedulers:COMMON} and {@link Scopes:COMMON} to perform the
   * configuration of database adapters.
   * <br /><br />
   * CAUTION: this method opens the database connection, which requires
   * a database backend to be running as well, i.e. please start running
   * the database server before this method is called.
   *
   * @access public
   * @static
   * @param     {DatabaseConfig}    config    A database configuration object.
   * @returns   {MongooseModule}    A `@nestjs/mongoose` MongooseModule object.
   */
  public static getDatabaseModule(config: DatabaseConfig): MongooseModule {
    // singleton instance for database
    if (undefined === AppConfiguration.DATABASE) {
      AppConfiguration.DATABASE = MongooseModule.forRoot(
        `mongodb://` +
          `${config.user}:${process.env.DB_PASS}` +
          `@` +
          `${config.host}:${config.port}` +
          `/` +
          `${config.name}?authSource=admin`,
      );
    }

    // return singleton instance
    return AppConfiguration.DATABASE;
  }

  /**
   * This method initializes the internal *event emitter adapter*.
   * <br /><br />
   * You should not have to call this method manually, it is used inside
   * {@link Schedulers:COMMON} and {@link Scopes:COMMON} to perform the
   * configuration of event emitter adapters.
   *
   * @access public
   * @static
   * @returns   {MongooseModule}    A `@nestjs/mongoose` MongooseModule object.
   */
  public static getEventEmitterModule(): EventEmitterModule {
    // singleton instance for database
    AppConfiguration.EVENT_EMITTER = EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: ".",
      maxListeners: 5,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    });

    // return singleton instance
    return AppConfiguration.EVENT_EMITTER;
  }

  /**
   * This method validates the presence of mandatory configuration fields
   * in the dApp configuration object.
   *
   * @access public
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  public static checkMandatoryFields(config: AppConfiguration): boolean {
    // configuration file `dapp.ts`
    const { dappName, dappPublicKey, scopes, backendApp, discovery } =
      config.dapp;

    // (1) `dappName` cannot be empty
    if (undefined === dappName || !dappName.length) {
      throw new ConfigurationError(
        `The configuration field "dappName" cannot be empty.`,
      );
    }

    // (2) `dappPublicKey` cannot be empty
    if (undefined === dappPublicKey || !dappPublicKey.length) {
      throw new ConfigurationError(
        `The configuration field "dappName" cannot be empty.`,
      );
    }

    // (3) `scopes` cannot be empty
    if (undefined === scopes || !scopes.length || typeof scopes === "string") {
      throw new ConfigurationError(
        `The configuration field "scopes" must be a non-empty array.`,
      );
    }

    // (4) database & discovery scope cannot be disabled (for now)
    if (!scopes.includes("database") || !scopes.includes("discovery")) {
      throw new ConfigurationError(
        `The application scopes "database" and "discovery" cannot be disabled.`,
      );
    }

    // (5) `backendApp` cannot be empty (reference to self)
    if (undefined === backendApp || !("url" in backendApp)) {
      throw new ConfigurationError(
        `The configuration field "backendApp" cannot be empty.`,
      );
    }

    // (6) `discovery.sources` cannot be empty
    if (
      undefined === discovery ||
      !("sources" in discovery) ||
      undefined === discovery.sources ||
      !discovery.sources.length
    ) {
      throw new ConfigurationError(
        `The configuration field "discovery.sources" must be a non-empty array.`,
      );
    }

    return true;
  }

  /**
   * This method validates the capacity to connect to the database
   * using the dApp configuration object.
   * <br /><br />
   * CAUTION: this method opens the database connection, which requires
   * a database backend to be running as well, i.e. please start running
   * the database server before this method is called.
   *
   * @access public
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  public static checkDatabaseConnection(config: AppConfiguration): boolean {
    // configuration file `dapp.ts`
    const { database } = config.dapp;

    try {
      AppConfiguration.getDatabaseModule(database);
    } catch (e) {
      throw new ConfigurationError(
        `Could not establish a connection to the database with host: ` +
          `${database.host} and port: ${database.port}.`,
      );
    }

    return true;
  }

  /**
   * This method validates the capacity to determine network connection
   * using the dApp configuration object.
   *
   * @access public
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  public static checkNetworkConnection(config: AppConfiguration): boolean {
    // configuration file `network.ts`
    const { defaultNode, network } = config.network;

    // (1) `defaultNode` cannot be empty
    if (undefined === defaultNode || !("url" in defaultNode)) {
      throw new ConfigurationError(
        `The configuration field "defaultNode" cannot be empty.`,
      );
    }

    // (2) `network.generationHash` cannot be empty
    if (undefined === network || !("generationHash" in network)) {
      throw new ConfigurationError(
        `The configuration field "network.generationHash" cannot be empty.`,
      );
    }

    // (3) `network.networkIdentifier` cannot be empty
    if (undefined === network || !("networkIdentifier" in network)) {
      throw new ConfigurationError(
        `The configuration field "network.networkIdentifier" cannot be empty.`,
      );
    }

    // (4) `network.epochAdjustment` cannot be empty
    if (undefined === network || !("epochAdjustment" in network)) {
      throw new ConfigurationError(
        `The configuration field "network.epochAdjustment" cannot be empty.`,
      );
    }

    return true;
  }

  /**
   * This method validates the capacity to discover assets on the network
   * using the dApp configuration object.
   *
   * @access public
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  public static checkMandatoryAssets(config: AppConfiguration): boolean {
    // configuration file `assets.ts`
    const { assets } = config.assets;

    // (1) `assets.base` must exist
    if (undefined === assets || !("base" in assets)) {
      throw new ConfigurationError(
        `The configuration field "assets.base" cannot be empty.`,
      );
    }

    return true;
  }

  /**
   * This method validates the security settings that are in place
   * using the dApp configuration object.
   *
   * @access public
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  public static checkSecuritySettings(config: AppConfiguration): boolean {
    // configuration file `security.ts`
    const { auth } = config.security;

    // (1) `auth.secret` cannot be empty
    if (undefined === auth || !("secret" in auth) || !auth.secret.length) {
      throw new ConfigurationError(
        `The configuration field "auth.secret" cannot be empty.`,
      );
    }

    // (2) `auth.challengeSize` cannot be empty and must be greater than 3
    if (
      undefined === auth ||
      !("challengeSize" in auth) ||
      auth.challengeSize < 3
    ) {
      throw new ConfigurationError(
        `The configuration field "auth.challengeSize" ` +
          `must contain a number greater than or equal to 3.`,
      );
    }

    return true;
  }

  /**
   * This method validates the configuration objects of different scopes
   * in the dApp configuration object.
   *
   * @access public
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  public static checkApplicationScopes(config: AppConfiguration): boolean {
    // configuration file `dapp.ts`
    const { scopes } = config.dapp;

    // DISCOVERY SCOPE configuration
    if (scopes.includes("discovery")) {
      AppConfiguration.checkDiscoverySettings(config);
    }

    // PAYOUT SCOPE configuration
    if (scopes.includes("payout")) {
      AppConfiguration.checkPayoutSettings(config);
    }

    // PROCESSOR SCOPE configuration
    if (scopes.includes("processor")) {
      AppConfiguration.checkProcessorSettings(config);
    }

    return true;
  }

  /**
   * This method is used internally to validate the configuration of
   * the {@link DiscoveryModule:DISCOVERY}.
   *
   * @access protected
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  protected static checkDiscoverySettings(config: AppConfiguration): boolean {
    // configuration file `dapp.ts`
    const { dappPublicKey, discovery } = config.dapp;
    // configuration file `network.ts`
    const { network } = config.network;

    // (3) `dappPublicKey` must be valid public key
    try {
      PublicAccount.createFromPublicKey(
        dappPublicKey,
        network.networkIdentifier,
      );
    } catch (e) {
      throw new ConfigurationError(
        `The configuration field "dappPublicKey" must contain ` +
          `a valid 32-bytes public key in hexadecimal format.`,
      );
    }

    // (4) `discovery.sources` must be valid public keys or address
    for (let i = 0, m = discovery.sources.length; i < m; i++) {
      const source = discovery.sources[i];

      try {
        if (source.length === 64) {
          PublicAccount.createFromPublicKey(source, network.networkIdentifier);
          continue;
        }
        Address.createFromRawAddress(source);
      } catch (e) {
        throw new ConfigurationError(
          `The configuration field "discovery.sources" must contain ` +
            `an array of valid 32-bytes public keys in hexadecimal format ` +
            `or valid addresses that are compatible with dHealth Network.`,
        );
      }
    }

    return true;
  }

  /**
   * This method is used internally to validate the configuration of
   * the {@link PayoutModule:PAYOUT}.
   *
   * @access public
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  protected static checkPayoutSettings(config: AppConfiguration): boolean {
    // configuration file `network.ts`
    const { network } = config.network;
    // configuration file `payout.ts`
    const { payouts } = config.payout;

    // (1) `payouts.issuerPrivateKey` cannot be empty
    if (
      undefined === payouts ||
      !("issuerPrivateKey" in payouts) ||
      !payouts.issuerPrivateKey.length
    ) {
      throw new ConfigurationError(
        `The configuration field "payouts.issuerPrivateKey" cannot be empty.`,
      );
    }

    // (2) `payouts.issuerPrivateKey` must be valid account
    try {
      Account.createFromPrivateKey(
        payouts.issuerPrivateKey,
        network.networkIdentifier,
      );
    } catch (e) {
      throw new ConfigurationError(
        `The configuration field "payouts.issuerPrivateKey" must ` +
          `contain a valid 32-bytes private key in hexadecimal format.`,
      );
    }

    return true;
  }

  /**
   * This method is used internally to validate the configuration of
   * the {@link ProcessorModule:PROCESSOR}.
   *
   * @access protected
   * @static
   * @param   {AppConfiguration}     config       The full runtime configuration.
   * @returns {boolean}     Returns true given valid configuration.
   */
  protected static checkProcessorSettings(config: AppConfiguration): boolean {
    // configuration file `processor.ts`
    const { contracts, operations } = config.processor;

    // (1) `contracts` cannot be empty
    if (undefined === contracts || !contracts.length) {
      throw new ConfigurationError(
        `The configuration field "contracts" must be a non-empty array.`,
      );
    }

    // (1) `operations` cannot be empty
    if (undefined === operations || !operations.length) {
      throw new ConfigurationError(
        `The configuration field "operations" must be a non-empty array.`,
      );
    }

    return true;
  }
}
