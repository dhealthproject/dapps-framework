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
import { OperationsModule } from "./modules/OperationsModule";

/**
 * @label SCOPES
 * @class ProcessorModule
 * @description The processor scope's main module. This module
 * is loaded by the software when `"processor"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * #### Modules
 *
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link OperationsModule} | `operations` | `/operations` | Module with schedulers, collections and routes around **dApp operations**. |
 * <br /><br />
 * #### Notes
 *
 * Note also that in {@link Schedulers}, we map the following **schedulers**
 * to this module:
 * - A {@link ProcessOperations} *scheduler* that processes operations using transactions, in the background.
 *
 * @since v0.3.0
 */
@Module({
  imports: [
    // imports routes and DTOs
    OperationsModule,
  ],
})
export class ProcessorModule extends AbstractAppModule {}
