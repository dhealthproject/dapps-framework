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
import { ActivitiesModule } from "./modules/ActivitiesModule";
import { OperationsModule } from "./modules/OperationsModule";
import { WebHooksModule } from "./modules/WebHooksModule";

/**
 * @label ProcessorModule
 * @class ProcessorModule
 * @description The processor scope's main module. This module
 * is loaded by the software when `"processor"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * #### Modules
 *
 * This scoped module currently features the following submodules: *
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link OperationsModule:PROCESSOR} | `operations` | `/operations` | Module with schedulers, collections and routes around **dApp operations**. |
 * | {@link ActivitiesModule:PROCESSOR} | `activities` | `/activities` | Module with schedulers, collections and routes around **activities**. |
 * | {@link WebHooksModule:PROCESSOR} | N/A | `/webhook/:provider` | Module with schedulers, collections and routes around **Web Hooks**. |
 * <br /><br />
 * #### Events
 *
 * This scoped module currently features the following events: *
 * | Class | Name | Link | Description |
 * | --- | --- | --- | --- |
 * | `OnActivityCreated` | `processor.activity.created` | {@link OnActivityCreated:EVENTS} | Event that is *emitted* in {@link WebHooksService.eventHandler} when an activity is created in database. |
 *
 * #### Listeners
 *
 * This scoped module currently features the following events:
 * | Class | Event | Link | Description |
 * | --- | --- | --- | --- |
 * | `OnActivityCreatedListener` | `processor.activity.created` | {@link OnActivityCreatedListener:LISTENERS} | Event listener that *instructs* the runtime backend to run an *activity processor* command. |
 * <br /><br />
 * #### Notes
 *
 * Note also that in {@link Schedulers:COMMON}, we map the following **schedulers**
 * to this module:
 * - A {@link ProcessOperations:PROCESSOR} *scheduler* that processes operations using transactions, in the background.
 *
 * @since v0.3.0
 */
@Module({
  imports: [
    // imports routes and DTOs
    OperationsModule,
    ActivitiesModule,
    WebHooksModule,
  ],
})
export class ProcessorModule {}
