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
import { DiscoverTransactionsCommand } from "../discovery/schedulers/DiscoverTransactions/DiscoverTransactionsCommand";

/**
 * @description This exported constant enumerates all available **commands**
 * modules. Commands are opt-in through the **scopes** field value of a
 * dApp's configuration files (config/dapp.json). Commands always belong to
 * and are registered through a *scoped module*, i.e. "discovery" defines some
 * commands and "payout" may define more commands.
 * <br /><br />
 * Commands that are currently available are represented in the following
 * information table:
 * | Scope | Scheduler | Description |
 * | --- | --- | --- |
 * | `discovery` | {@link DiscoverTransactions} | A discovery command that retrieves transactions information from the network. |
 * <br /><br />
 *
 * @var {[key: string]: any[]}
 *
 * @todo The object `Commands` should **at least** use a custom type (not `any`).
 * @since v0.1.0
 */
export const Commands: { [key: string]: any[] } = {
  database: [MongooseModule.forRoot(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
  )],
  discovery: [
    DiscoverTransactionsCommand,
  ],
  payout: [],
  processor: [],
};
