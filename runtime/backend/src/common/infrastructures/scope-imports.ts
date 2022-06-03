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
import { DiscoveryModule } from 'src/discovery/discovery.module';
import { PayoutModule } from 'src/payout/payout.module';
import { ProcessorModule } from 'src/processor/processor.module';

/**
 * Constant that acts as a directory of all scopes of the dapp.
 *
 * The scopes are:
 * - discovery: DiscoveryModule
 * - payout: PayoutModule
 * - processor: ProcessorModule
 * - scheduler: SchedulerModule
 *
 * **Note**: The scheduler scope will be proccessed separately as it runs in a separate process.
 *
 * The main app can read the dapp config values for enabled scopes, and
 * imports each dynamically by getting it from the indexes of this constant.
 *
 * E.g. imports scopes dynamically from app's module file:
 * ```js
 * import { ScopeImports } from 'src/common/infrastructures';
 *
 * const scopes = configs.scopes;
 *   for (const scope in scopes) {
 *     if (scopes[scope] && ScopeImports[scope])
 *       imports.push(ScopeImports[scope]);
 *   }
 * }
 * ```
 *
 * @since v0.1.0
 */
export const ScopeImports = {
  DiscoveryModule: DiscoveryModule,
  PayoutModule: PayoutModule,
  ProcessorModule: ProcessorModule,
};
