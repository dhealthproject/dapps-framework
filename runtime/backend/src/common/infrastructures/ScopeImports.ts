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
import { DiscoveryModule } from '../../discovery/discovery.module';
import { PayoutModule } from '../../payout/payout.module';
import { ProcessorModule } from '../../processor/processor.module';

/**
 * @description This exported constant enumerates all available **scoped**
 * modules. Scopes are opt-in and only enabled if they are present in a
 * dApp's configuration files (config/dapp.json).
 * <br /><br />
 * Scopes that are currently available are represented in the following
 * information table:
 * | Scope | Reference | Description |
 * | --- | --- | --- |
 * | `discovery` | {@link DiscoveryModule} | A state discovery scope that consists in caching data and reading operations using network nodes. |
 * | `payout`| {@link PayoutModule} | A payout scope that encapsulates payout mechanisms that are executed in background processes. |
 * | `processor` | {@link ProcessorModule} | A processing scope that consists in detecting invoice updates and processing payments. |
 * <br /><br />
 * A `scheduler` scope is also included with {@link SchedulerModule} but
 * this one executes in a *parallel* process and thereby should not be
 * imported here.
 * <br /<br />
 *
 * @var {object}
 *
 * @todo define class `AbstractAppModule` and use in `DiscoveryModule`, `PayoutModule`, etc.
 * @todo The object `ScopeImports` should **at least** use a custom type (not `any`).
 * @since v0.1.0
 */
export const ScopeImports: { [key: string]: any } = {
  discovery: DiscoveryModule,
  payout: PayoutModule,
  processor: ProcessorModule,
};
