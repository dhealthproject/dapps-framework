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
import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

/**
 * @label DATABASE
 * @class AddActivityPayoutFields
 * @description This migration consists in one or more database
 * schema and/or data updates. The following tasks are run:
 * - Update the `activities` collection by creating new fields
 * including: `payoutState` and `queuePosition`.
 *
 * @since v0.4.1
 */
export class AddActivityPayoutFields implements MigrationInterface {
  /**
   * This method consists in executing the *tasks* that pertain
   * to this migration being installed/run on the backend runtime.
   *
   * @access public
   * @async
   * @param   {Db}   db   The migration database connection.
   * @returns {Promise<void>}
   */
  public async up(db: Db): Promise<void> {
    // update many `activities` documents such that
    // - the `payoutState` field contains 0 (Not_Started)
    const collection = db.collection("activities");
    await collection.updateMany(
      {},
      [
        { $set: { payoutState: 0 } },
      ]
    );

    await collection.createIndex("payoutState");
  }

  /**
   * This method consists in executing the *tasks* that pertain
   * to this migration being uninstalled/rolled-back on the backend
   * runtime.
   *
   * @access public
   * @async
   * @param   {Db}   db   The migration database connection.
   * @returns {Promise<void>}
   */
  public async down(db: Db): Promise<void> {
    // update many `activities` documents such that
    // - the `payoutState` field is removed (unset)
    const collection = db.collection("activities");
    await collection.updateMany(
      {},
      [
        { $unset: ["payoutState"] },
      ]
    );
  }
}
