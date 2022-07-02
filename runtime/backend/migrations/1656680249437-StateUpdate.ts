/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Migrations
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { MigrationInterface, QueryRunner, Table } from "typeorm"

/**
 * @class StateUpdate1656680249437
 * @description This **database migration** executes several
 * database modifications using `typeorm`'s migration system.
 * <br /><br />
 * This migration runs the following updates:
 * - Drops and re-creates `states` collection due to state
 *   data internal changes and names updates.
 * <br /><br />
 * Caution: This migration *cannot* be reverted.
 *
 * @since v0.2.0
 */
export class StateUpdate1656680249437 implements MigrationInterface {
  /**
   * This method executes the logic of this database migration
   * when `npx typeorm migration:run` is called.
   *
   * @link https://typeorm.io/query-runner
   * @async
   * @access public
   * @param {QueryRunner} queryRunner   The `typeorm` QueryRunner.
   * @returns {Promise<void>}
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
      queryRunner.dropTable("states");
      queryRunner.createTable(new Table({
          name: "states",
      }));
  }

  /**
   * This method executes the logic of this database migration
   * when `npx typeorm migration:revert` is called.
   *
   * @link https://typeorm.io/query-runner
   * @async
   * @access public
   * @param {QueryRunner} queryRunner   The `typeorm` QueryRunner.
   * @returns {Promise<void>}
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
      console.log("This migration cannot be reverted.");
  }
}
