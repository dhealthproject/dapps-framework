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
// common scope
import { AppConfiguration } from "../AppConfiguration";

// discovery scope
import { AccountsModule } from "../discovery/modules/AccountsModule";
import { AssetsModule } from "../discovery/modules/AssetsModule";
import { BlocksModule } from "../discovery/modules/BlocksModule";
import { TransactionsModule } from "../discovery/modules/TransactionsModule";
import { DiscoverAccountsCommand } from "../discovery/schedulers/DiscoverAccounts/DiscoverAccountsCommand";
import { DiscoverAssetsCommand } from "../discovery/schedulers/DiscoverAssets/DiscoverAssetsCommand";
import { DiscoverTransactionsCommand } from "../discovery/schedulers/DiscoverTransactions/DiscoverTransactionsCommand";
import { DiscoverBlocksCommand } from "../discovery/schedulers/DiscoverBlocks/DiscoverBlocksCommand";

// processor scope
import { OperationsModule } from "../processor/modules/OperationsModule";
import { ProcessOperationsCommand } from "../processor/schedulers/ProcessOperations/ProcessOperationsCommand";

// payout scope
import { PayoutsModule } from "../payout/modules/PayoutsModule";
import { ActivityPayoutsCommand } from "../payout/schedulers/ActivityPayouts/ActivityPayoutsCommand";
import { PrepareActivityPayouts } from "../payout/schedulers/ActivityPayouts/PrepareActivityPayouts";
import { BroadcastActivityPayouts } from "../payout/schedulers/ActivityPayouts/BroadcastActivityPayouts";

// statistics scope
import { LeaderboardsAggregationCommand } from "../statistics/schedulers/LeaderboardAggregation/LeaderboardsAggregationCommand";
import { UserAggregationCommand } from "../statistics/schedulers/UserAggregation/UserAggregationCommand";

// configuration resources
import dappConfigLoader from "../../config/dapp";
const db = dappConfigLoader().database;

/**
 * @label COMMON
 * @module Schedulers
 * @description This exported constant enumerates all available **scheduler**
 * modules. Schedulers are opt-in through the **scopes** field value of a
 * dApp's configuration files (config/dapp.json). Schedulers always belong to
 * and are registered through a *scoped module*, i.e. "discovery" defines some
 * schedulers and "payout" may define more schedulers.
 * <br /><br />
 * Note that the database *password* is intentionally read *only* from environment
 * variables and is **not added to the configuration** to reduce potential leaks.
 * <br /><br />
 * Schedulers that are currently available are represented in the following
 * information table:
 * | Scope | Scheduler | Description |
 * | --- | --- | --- |
 * | `discovery` | {@link DiscoverTransactions:DISCOVERY} | A discovery command that retrieves transactions information from the network. |
 * | `discovery` | {@link DiscoverAccounts:DISCOVERY} | A discovery command that retrieves accounts information from the database using discovered transactions. |
 * | `discovery` | {@link DiscoverAssets:DISCOVERY} | A discovery command that retrieves assets information from the database using discovered transactions. |
 * | `processor` | {@link ProcessOperations:PROCESSOR} | A processor command that interprets discovered transactions and maps them to dApp operations. |
 * | `payout`| {@link PrepareActivityPayouts:PAYOUT} | A payout command that prepares activity reward transactions and signs them such that they can be broadcast to dHealth Network. |
 * | `payout`| {@link BroadcastActivityPayouts:PAYOUT} | A payout command that broadcasts activity reward transactions to dHealth Network. |
 * | `statistics` | {@link LeaderboardAggregation:STATISTICS} | A statistics command that aggregates and sorts user rewards for activities and creates leaderboards. |
 * | `statistics`| {@link UserAggregation:STATISTICS} | A statistics command that aggregates and sorts user rewards for activities and creates user statistics. |
 * <br /><br />
 *
 * @var {[key: string]: any[]}
 * @since v0.1.0
 */
export const Schedulers: { [key: string]: any[] } = {
  database: [AppConfiguration.getDatabaseModule(db)],
  discovery: [
    AccountsModule,
    AssetsModule,
    TransactionsModule,
    BlocksModule,
    DiscoverAccountsCommand,
    DiscoverAssetsCommand,
    DiscoverTransactionsCommand,
    DiscoverBlocksCommand,
  ],
  payout: [PayoutsModule, ActivityPayoutsCommand],
  processor: [OperationsModule, ProcessOperationsCommand],
  statistics: [
    BlocksModule,
    LeaderboardsAggregationCommand,
    UserAggregationCommand,
  ],
};
