/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Migrations
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { MigrationInterface, QueryRunner } from "typeorm"

export class StateUpdate1656680249437 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //XXX AccountsDiscoveryService currentTxPage => latestTxPage
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
