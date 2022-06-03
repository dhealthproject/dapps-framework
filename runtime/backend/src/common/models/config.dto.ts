/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

/**
 * @class ConfigDTO
 * @description A DTO class that represents the dapp config values.
 *
 * @since v0.1.0
 */
export class ConfigDTO {
  /**
   * Instance of {@link ScopeConfigDTO}
   * Specifies scopes config.
   *
   * @var {ScopeConfigDTO}
   */
  scopes: ScopeConfigDTO;

  /**
   * Instance of {@link SchedulerModulesConfigDTO}
   * Specifies scheduler's cronjobs config.
   *
   * @var {SchedulerModulesConfigDTO}
   */
  schedulerModules: SchedulerModulesConfigDTO;
}

/**
 * @class MongoConfigDTO
 * @description Mongo config DTO.
 *
 * @since v0.1.0
 */
export class MongoConfigDTO {
  /**
   * Mongo login username.
   *
   * @var {string}
   */
  user: string;

  /**
   * Mongo login password.
   *
   * @var {string}
   */
  pass: string;

  /**
   * Mongo host name.
   *
   * @var {string}
   */
  host: string;

  /**
   * Mongo port number.
   *
   * @var {number}
   */
  port: number;

  /**
   * Mongo database name.
   *
   * @var {string}
   */
  dbName: string;
}

/**
 * @class ScopeConfigDTO
 * @description A DTO class that represents the dapp scopes config values.
 *
 * @since v0.1.0
 */
export class ScopeConfigDTO {
  /**
   * Specifies if `discovery` scope is enabled.
   *
   * @var {boolean}
   */
  DiscoveryModule: boolean;

  /**
   * Specifies if `payout` scope is enabled.
   *
   * @var {boolean}
   */
  PayoutModule: boolean;

  /**
   * Specifies if `processor` scope is enabled.
   *
   * @var {boolean}
   */
  ProcessorModule: boolean;

  /**
   * Specifies if `scheduler` scope is enabled.
   *
   * @var {boolean}
   */
  SchedulerModule: boolean;
}

/**
 * @class SchedulerModulesConfigDTO
 * @description A DTO class that represents the dapp scheduler config values.
 *
 * @since v0.1.0
 */
export class SchedulerModulesConfigDTO {
  /**
   * Specifies if `AddAccounts` module is enabled.
   *
   * @var {boolean}
   */
  AddAccountsModule: boolean;
}
