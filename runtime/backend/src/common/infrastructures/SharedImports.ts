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
import { MongooseModule } from '@nestjs/mongoose';

// internal dependencies
import { AccountsDiscoveryModule } from '../modules/cronjobs/accounts-discovery/accounts-discovery.module';
import { AccountsModule } from '../modules/routes/accounts/accounts.module';

/**
 * @description This exported constant enumerates all available shared
 * modules (i.e. "common"). A notable example of a shared module includes
 * the Mongo adapter `mongoose`.
 * <br /><br />
 * Shared modules *cannot* be disabled as of the first draft release of
 * this software package.
 * <br /<br />
 *
 * @todo define class `AbstractAppModule` and use in `AccountsModule`, etc.
 * @todo The object `SharedImports` should **at least** use a custom type (not `any`).
 * @var {object}
 * @since v0.1.0
 */
export const SharedImports: { [key: string]: any } = {
  // infrastructure modules
  mongoose: MongooseModule.forRoot(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ),
  // route modules
  accounts: AccountsModule,
  // cron modules
  accountsDiscovery: AccountsDiscoveryModule,
};
