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
import { DiscoveryModule } from "../discovery/DiscoveryModule";
import { PayoutModule } from "../payout/PayoutModule";
import { ProcessorModule } from "../processor/ProcessorModule";
import { StatisticsModule } from "../statistics/StatisticsModule";
import { NotifierModule } from "../notifier/NotifierModule";
import { AppConfiguration } from "../AppConfiguration";

// configuration resources
import dappConfigLoader from "../../config/dapp";
const db = dappConfigLoader().database;

/**
 * @label COMMON
 * @module Scopes
 * @description This exported constant enumerates all available **scoped**
 * modules. Scopes are opt-in and only enabled if they are present in a
 * dApp's configuration files (config/dapp.json).
 * <br /><br />
 * Note that the database *password* is intentionally read *only* from environment
 * variables and is **not added to the configuration** to reduce potential leaks.
 * <br /><br />
 * Scopes that are currently available are represented in the following
 * information table:
 * | Scope | Reference | Description |
 * | --- | --- | --- |
 * | `database` | {@link MongooseModule} | A database scope that consists in a connection adapter for the mongo database background process. |
 * | `discovery` | {@link DiscoveryModule} | A state discovery scope that consists in caching data and reading operations using network nodes. |
 * | `payout`| {@link PayoutModule} | A payout scope that encapsulates payout mechanisms that are executed in background processes. |
 * | `processor` | {@link ProcessorModule} | A processing scope that consists in detecting invoice updates and processing payments. |
 * | `statistics` | {@link StatisticsModule} | A statistics scope that consists in aggregate data into meaningful statistics and measurements. |
 * | `notifier` | {@link NotifierModule} | A notifier scope that consists in aggregate monitoring logs into meaningful alerts and reports. |
 * <br /><br />
 * A `scheduler` scope is also included with {@link SchedulerModule} but
 * this one executes in a *parallel* process and thereby should not be
 * imported here.
 * <br /<br />
 *
 * @var {[key: string]: KnownScopeModules}
 *
 * @todo define class `AbstractAppModule` and use in `DiscoveryModule`, `PayoutModule`, etc.
 * @since v0.1.0
 */
export const Scopes: { [key: string]: any } = {
  database: AppConfiguration.getDatabaseModule(db),
  eventEmitter: AppConfiguration.getEventEmitterModule(),
  discovery: DiscoveryModule,
  payout: PayoutModule,
  processor: ProcessorModule,
  statistics: StatisticsModule,
  notifier: NotifierModule,
};
