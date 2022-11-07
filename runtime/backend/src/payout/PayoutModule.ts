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
import { PayoutsModule } from "./modules/PayoutsModule";

/**
 * @label PayoutModule
 * @class PayoutModule
 * @description The payout scope's main module. This module
 * is loaded by the software when `"payout"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * <br /><br />
 * #### Modules
 *
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link PayoutsModule:PAYOUT} | `payouts` | `/payouts` | Module with schedulers, collections and routes around **dApp payouts**. |
 * <br /><br />
 * #### Events
 *
 * This scoped module currently features the following events:
 * | Class | Name | Link | Description |
 * | --- | --- | --- | --- |
 * | `OnPayoutCreated` | `payout.created` | {@link OnPayoutCreated:EVENTS} | Event that is *emitted* when a payout is created on the network. |
 * <br /><br />
 * #### Notes
 *
 * Note also that in {@link Schedulers:COMMON}, we map the following **schedulers**
 * to this module:
 * - A {@link PrepareActivityPayouts:PAYOUT} *scheduler* that prepares and signs payouts in the background.
 * - A {@link BroadcastActivityPayouts:PAYOUT} *scheduler* that broadcasts payouts in the background.
 *
 * @since v0.4.0
 */
@Module({
  imports: [
    // imports routes and DTOs
    PayoutsModule,
  ],
})
export class PayoutModule {}
