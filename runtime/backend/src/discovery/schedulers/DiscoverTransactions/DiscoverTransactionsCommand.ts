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
import { NetworkModule } from "../../../common/modules/NetworkModule";
import { QueryModule } from "../../../common/modules/QueryModule";
import { StateModule } from "../../../common/modules/StateModule";

// private implementation
import { DiscoverTransactions } from "./DiscoverTransactions";

/**
 * @class DiscoverTransactionsCommand
 * @description The main definition for the Transactions Discovery module.
 *
 * @since v0.2.0
 */
@Module({
  imports: [
    QueryModule,
    StateModule,
    NetworkModule,
  ],
  providers: [DiscoverTransactions],
  exports: [DiscoverTransactions],
})
export class DiscoverTransactionsCommand {}
