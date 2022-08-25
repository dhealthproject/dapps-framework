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

// internal dependencies
import { DiscoveryModule } from "../discovery/DiscoveryModule";
import { PayoutModule } from "../payout/PayoutModule";
import { ProcessorModule } from "../processor/ProcessorModule";

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
 * Scopes that are currently available are represented in the following
 * information table:
 * | Scope | Reference | Description |
 * | --- | --- | --- |
 * | `database` | {@link MongooseModule} | A database scope that consists in a connection adapter for the mongo database background process. |
 * | `discovery` | {@link DiscoveryModule} | A state discovery scope that consists in caching data and reading operations using network nodes. |
 * | `payout`| {@link PayoutModule} | A payout scope that encapsulates payout mechanisms that are executed in background processes. |
 * | `processor` | {@link ProcessorModule} | A processing scope that consists in detecting invoice updates and processing payments. |
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
  database: MongooseModule.forRoot(
    `mongodb://${db.user}:${process.env.DB_PASS}@${db.host}:${db.port}/${db.name}?authSource=admin`,
  ),
  discovery: DiscoveryModule,
  payout: PayoutModule,
  processor: ProcessorModule,
};
