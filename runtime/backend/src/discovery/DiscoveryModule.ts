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
import { Module } from "@nestjs/common";

// internal dependencies
// common scope
import { AbstractAppModule } from "../common/modules/AbstractAppModule";

// discovery scope
import { DiscoveryAccountsModule } from "./modules/DiscoveryAccountsModule";
import { AssetsModule } from "./modules/AssetsModule";
import { TransactionsModule } from "./modules/TransactionsModule";
import { BlocksModule } from "./modules/BlocksModule";

/**
 * @label SCOPES
 * @class DiscoveryModule
 * @description The discovery scope's main module. This module
 * is loaded by the software when `"discovery"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link TransactionsModule} | `transactions` | `/transactions` | Module with schedulers, collections and routes around **dApp transactions**. |
 * | {@link DiscoveryAccountsModule} | `accounts` | `/accounts` | Module with schedulers, collections and routes around **dApp accounts**. |
 * | {@link AssetsModule} | `assets` | `/assets` | Module with schedulers, collections and routes around **dApp assets**. |
 * | {@link BlocksModule} | `blocks` | `/blocks` | Module with schedulers, collections and routes around **network blocks**. |
 * <br /><br />
 * Note also that in {@link Schedulers}, we map the following **schedulers**
 * to this module:
 * - A {@link DiscoverTransactions} *scheduler* that discovers transactions in the background every minute.
 * - A {@link DiscoverAccounts} *scheduler* that discovers accounts in the background every two minutes.
 * - A {@link DiscoverAssets} *scheduler* that discovers assets in the background every two minutes.
 * - A {@link DiscoverBlocks} *scheduler* that discovers assets in the background every two minutes.
 *
 * @since v0.1.0
 */
@Module({
  imports: [
    // imports routes and DTOs
    DiscoveryAccountsModule,
    TransactionsModule,
    AssetsModule,
    BlocksModule,
  ],
})
export class DiscoveryModule extends AbstractAppModule {}
