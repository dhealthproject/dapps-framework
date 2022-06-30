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
import { AccountsModule } from "./modules/AccountsModule";
import { TransactionsModule } from "./modules/TransactionsModule";

/**
 * @class DiscoveryModule
 * @description The discovery scope's main module. This module
 * is loaded by the software when `"discovery"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * This scoped module currently features:
 * - A {@link AccountsModule} that maps to `/accounts` route endpoints and DTOs.
 * <br /><br />
 * Note also that in {@link Schedulers}, we map the following **schedulers**
 * to this module:
 * - A {@link DiscoverAccounts} *scheduler* that discovers accounts in the background.
 *
 * @since v0.1.0
 */
@Module({
  imports: [
    // imports routes and DTOs
    AccountsModule,
    TransactionsModule,
  ],
})
export class DiscoveryModule {}
