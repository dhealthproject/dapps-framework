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
import { AbstractAppModule } from "../common/modules/AbstractAppModule";
import { ActivitiesModule } from "./modules/ActivitiesModule";

/**
 * @label SCOPES
 * @class UsersModule
 * @description The users scope's main module. This module
 * is loaded by the software when `"users"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * #### Modules
 *
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link ActivitiesModule} | `activities` | `/activities` | Module with schedulers, collections and routes around **activities**. |
 * <br /><br />
 *
 * @since v0.5.3
 */
@Module({
  imports: [
    // imports routes and DTOs
    ActivitiesModule,
  ],
})
export class UsersModule extends AbstractAppModule {}
