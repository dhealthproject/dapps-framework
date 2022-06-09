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
import { ScheduleModule } from '@nestjs/schedule';

// internal dependencies
import { AccountsModule } from '../../routes/accounts/accounts.module';
import { NetworkModule } from '../../services/network/network.module';
import { StatesModule } from '../../services/states/states.module';
import { AccountsDiscoveryService } from './accounts-discovery.service';

/**
 * @class AccountsDiscoveryModule
 * @description The main definition for the Accounts Discovery module.
 *
 * @since v0.1.0
 */
@Module({
  imports: [
    ScheduleModule.forRoot(),
    StatesModule,
    NetworkModule,
    AccountsModule,
  ],
  providers: [AccountsDiscoveryService],
  exports: [AccountsDiscoveryService],
})
export class AccountsDiscoveryModule {}
