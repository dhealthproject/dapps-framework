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
import { MongooseModule } from "@nestjs/mongoose";

// internal dependencies
import { Account, AccountSchema } from "../../common/models/AccountSchema";
import { LogModule } from "../../common/modules/LogModule";
import { QueryModule } from "../../common/modules/QueryModule";
import { AccountsModule } from "../../common/modules/AccountsModule";
import { AccountsService } from "../../common/services/AccountsService";
import { AccountsController } from "../routes/AccountsController";

/**
 * @label DISCOVERY
 * @class DiscoveryAccountsModule
 * @description The main definition for the Accounts module. Note that
 * this module extends the {@link AccountsModule:COMMON} from the common scope
 * to *include* database *entities and schema definition*.
 * <br /><br />
 * This module *enables* routes (API) to query accounts.
 *
 * @since v0.3.0
 */
@Module({
  providers: [AccountsService],
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    QueryModule,
    //LogModule,
  ],
  controllers: [AccountsController],
})
export class DiscoveryAccountsModule extends AccountsModule {}
