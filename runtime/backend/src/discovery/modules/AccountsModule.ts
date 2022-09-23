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
import { AccountsModule as CommonAccountsModule } from "../../common/modules/AccountsModule";
import { AccountsController } from "../routes/AccountsController";

/**
 * @label DISCOVERY
 * @class AccountsModule
 * @description The main definition for the Accounts module. Note that
 * this module extends the {@link AccountsModule:COMMON} from the common scope
 * to *include* database *entities and schema definition*.
 * <br /><br />
 * This module *enables* routes (API) to query accounts.
 *
 * @since v0.3.0
 */
@Module({
  controllers: [AccountsController],
})
export class AccountsModule extends CommonAccountsModule {}
