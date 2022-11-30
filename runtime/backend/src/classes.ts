/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// This file is used as the entry-point for source code documentation
// using `typedoc`. All classes of the framework *must* be exported in
// this file so that documentation can be generated correctly.

// application-layer
export { AppConfiguration } from "./AppConfiguration";
export { AppModule } from "./AppModule";
export { AppService } from "./AppService";

// api layer
// common scope
export { Scopes } from "./common/Scopes";
export { ScopeFactory } from "./common/ScopeFactory";
export { Schedulers } from "./common/Schedulers";
export * from "./common/concerns";
export * from "./common/drivers";
export * from "./common/errors";
export * from "./common/events";
export * from "./common/models";
export * from "./common/requests";
export * from "./common/routes";
export * from "./common/services";
export * from "./common/traits";
export * from "./common/types";
// explicitely not exporting AccountsModule:COMMON
export {
  AuthModule,
  ChallengesModule,
  HelpersModule,
  NetworkModule,
  QueryModule,
  StateModule,
} from "./common/modules";

// discovery scope
export * from "./discovery/DiscoveryModule";
export * from "./discovery/models";
export * from "./discovery/modules";
export * from "./discovery/routes";
export * from "./discovery/schedulers";
export * from "./discovery/services";

// payout scope
export * from "./payout/PayoutModule";
export * from "./payout/concerns";
export * from "./payout/errors";
export * from "./payout/models";
export * from "./payout/modules";
export * from "./payout/routes";
export * from "./payout/schedulers";
export * from "./payout/services";

// processor scope
export * from "./processor/ProcessorModule";
export * from "./processor/models";
export * from "./processor/modules";
export * from "./processor/routes";
export * from "./processor/schedulers";
export * from "./processor/services";

// statistics scope
// CAUTION: exports StatisticsModule:SCOPES manually
export * from "./statistics/StatisticsModule";
// CAUTION: exports StatisticsModule:STATISTICS manually
export { StatisticsModule as StatisticsModuleImpl } from "./statistics/modules/StatisticsModule";
export * from "./statistics/models";
export * from "./statistics/routes";
export * from "./statistics/schedulers";
export * from "./statistics/services";

// notifier scope
export * from "./notifier/NotifierModule";
export * from "./notifier/concerns";
export * from "./notifier/listeners";
export * from "./notifier/models";
export * from "./notifier/modules";
export * from "./notifier/schedulers";
export * from "./notifier/services";

// oauth scope
export * from "./oauth/drivers";
export * from "./oauth/events";
export * from "./oauth/models";
export * from "./oauth/modules";
export * from "./oauth/requests";
export * from "./oauth/routes";
export * from "./oauth/services";

// worker scope
export * from "./worker/WorkerModule";
export * from "./worker/BaseCommand";
export * from "./worker/BaseScheduler";
