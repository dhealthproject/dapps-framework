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
// discovery scope
import { AccountsModule } from "../discovery/modules/AccountsModule";
import { TransactionsModule } from "../discovery/modules/TransactionsModule";
import { DiscoverAccountsCommand } from "../discovery/schedulers/DiscoverAccounts/DiscoverAccountsCommand";
import { DiscoverTransactionsCommand } from "../discovery/schedulers/DiscoverTransactions/DiscoverTransactionsCommand";

// processor scope
import { OperationsModule } from "../processor/modules/OperationsModule";
import { ProcessOperationsCommand } from "../processor/schedulers/ProcessOperations/ProcessOperationsCommand";

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
 * | `discovery` | {@link DiscoverTransactions} | A discovery command that retrieves transactions information from the network. |
 * | `discovery` | {@link DiscoverAccounts} | A discovery command that retrieves accounts information from the database using discovered transactions. |
 * <br /><br />
 *
 * @var {[key: string]: any[]}
 * @since v0.1.0
 */
export const Schedulers: { [key: string]: any[] } = {
  database: [
    MongooseModule.forRoot(
      `mongodb://${db.user}:${process.env.DB_PASS}@${db.host}:${db.port}/${db.name}?authSource=admin`,
    ),
  ],
  discovery: [
    AccountsModule,
    TransactionsModule,
    DiscoverAccountsCommand,
    DiscoverTransactionsCommand,
  ],
  payout: [],
  processor: [OperationsModule, ProcessOperationsCommand],
};
