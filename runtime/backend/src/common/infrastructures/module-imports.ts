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
import { AddAccountsModule } from 'src/common/modules/cronjobs/add-accounts/add-accounts.module';
import { AccountsModule } from 'src/common/modules/routes/accounts/accounts.module';

/**
 * Constant that acts as a directory of all available common modules of the dapp.
 *
 * A scope module can read the dapp config values for enabled modules, and
 * imports each dynamically by getting it from the indexes of this constant.
 *
 * E.g. imports scopes dynamically from app's module file:
 * ```js
 * const modules = configs.schedulerModules;
 *
 * for (const module in modules) {
 *   if (modules[module] && ModuleImports[module])
 *     imports.push(ModuleImports[module]);
 * }
 * ```
 *
 * @var {object}
 */
export const ModuleImports = {
  // infrastructure modules
  MongooseModule: MongooseModule.forRoot(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
  ),
  // route modules
  AccountsModule: AccountsModule,
  // cron modules
  AddAccountsModule: AddAccountsModule,
};
