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
import { PayoutsModule } from "./modules/PayoutsModule";

/**
 * @label SCOPES
 * @class PayoutModule
 * @description The payout scope's main module. This module
 * is loaded by the software when `"payout"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * This module is also responsible for computing *payout amounts*.
 * <br /><br />
 * The inputs to compute payout amounts are defined as follows:
 * - `calories`: Number of `kilocalories` burned (`C || kC`).
 * - `distance`: Number of `meters` distance (`D`). (* some formula express this in different unit of measure)
 * - `elevation`: Number of `meters` elevation gain (`E || A`). This field uses an adjusted value in case it is empty.
 * - `elapsedTime`: Number of `seconds` spent during activity (`T`).
 * - `kilojoules`: Number of `kilojoules` produced during activity (Rides only) (`J`).
 * <br /><br />
 * The following formulas are currently applied to compute amounts:
 * - *Walk*:    `(((D + J) / (T/60)) x (A + J + kC) / dE) x 1.2 x 100`
 * - *Run*:     `(((D + J) / (T/60)) x (A + J + kC) / dE) x 1.5 x 100`
 * - *Ride*:    `(((D * 10 + J) / (T/60)) x (A + J + kC) / dE) x 1.3 x 100`
 * - *Swim*:    `(((D * 100 + J) / (T/60)) x ((D/25) + J + kC) / dE) x 1.7 x 100`
 * - *Others*:  `((T/60) x (A + J + kC) / dE) x 1.6 x 100`
 * with `dE` which contains the *ELEVATE factor* of `1'000'000`.
 * <br /><br />
 * #### Modules
 *
 * This scoped module currently features the following submodules:
 * | Module | Mongo collection(s) | Routes | Description |
 * | --- | --- | --- | --- |
 * | {@link PayoutsModule} | `payouts` | `/payouts` | Module with schedulers, collections and routes around **dApp payouts**. |
 * <br /><br />
 * #### Events
 *
 * This scoped module currently features the following events:
 * | Class | Name | Link | Description |
 * | --- | --- | --- | --- |
 * | `OnPayoutCreated` | `payout.created` | {@link OnPayoutCreated} | Event that is *emitted* when a payout is created on the network. |
 * <br /><br />
 * #### Notes
 *
 * Note also that in {@link Schedulers}, we map the following **schedulers**
 * to this module:
 * - A {@link PrepareActivityPayouts} *scheduler* that prepares and signs payouts in the background.
 * - A {@link BroadcastActivityPayouts} *scheduler* that broadcasts payouts in the background.
 *
 * @since v0.4.0
 */
@Module({
  imports: [
    // imports routes and DTOs
    PayoutsModule,
  ],
})
export class PayoutModule extends AbstractAppModule {}
