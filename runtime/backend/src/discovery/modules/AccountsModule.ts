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
import { AccountsModule as CommonAccountsModule } from "../../common/modules/AccountsModule";
import { AccountsController } from "../routes/AccountsController";

/**
 * @label DISCOVERY
 * @class AccountsModule
 * @description The main definition for the Accounts module.
 *
 * @since v0.3.0
 */
@Module({
  controllers: [AccountsController],
})
export class AccountsModule extends CommonAccountsModule {}
