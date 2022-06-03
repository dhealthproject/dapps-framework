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
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// internal dependencies
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account, AccountSchema } from 'src/common/models';
import { QueriesModule } from '../../services/queries/queries.module';

/**
 * @class AccountsModule
 * @description The main definition for the Accounts module.
 *
 * @since v0.1.0
 */
@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    QueriesModule,
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
