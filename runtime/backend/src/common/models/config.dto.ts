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
   * An array of {@link Scope}.
   *
   * Specifies scopes config.
   *
   * @var {Scope[]}
   */
  scopes: Scope[];

  /**
   * An array of {@link CronJob}
   *
   * Specifies scheduler's cronjobs config.
   *
   * @var {CronJob[]}
   */
  schedulers: CronJob[];
}

/**
 * @type Scope
 * @description A type that represents the dapp scopes config values.
 *
 * @since v0.1.0
 */
export type Scope = string | 'discovery' | 'payout' | 'processor' | 'scheduler';

/**
 * @type CronJob
 * @description A type that represents the dapp scheduler config values.
 *
 * @since v0.1.0
 */
export type CronJob = string | 'addAccounts' | 'accountsDiscovery';
