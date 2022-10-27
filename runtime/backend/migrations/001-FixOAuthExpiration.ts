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
 * @class FixOAuthExpiration
 * @description This migration consists in one or more database
 * schema and/or data updates. The following tasks are run:
 * - Update values for the field `expiresAt` in the collection
 *   named `accountintegrations`. This update is necessary
 *   because these values contain (incorrect) *seconds to epoch*
 *   instead of *milliseconds to epoch*.
 *
 * @since v0.4.1
 */
export class FixOAuthExpiration implements MigrationInterface {
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
    // update many `accountintegrations` documents such that
    // - the `expiresAt` field contains *milliseconds since epoch*
    const collection = db.collection("accountintegrations");
    await collection.updateMany(
      { expiresAt: { $ne: null } },
      [
        { $set: { expiresAt: { $multiply: ["$expiresAt", 1000] } } },
      ]
    );
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
    // update many `accountintegrations` documents such that
    // - the `expiresAt` field contains *seconds since epoch*
    const collection = db.collection("accountintegrations");
    await collection.updateMany(
      { expiresAt: { $ne: null } },
      [
        { $set: { expiresAt: { $multiply: ["$expiresAt", 0.001] } } },
      ]
    );
  }
}
