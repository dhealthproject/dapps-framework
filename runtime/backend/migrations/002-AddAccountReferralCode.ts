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
 * @class AddAccountReferralCode
 * @description This migration consists in one or more database
 * schema and/or data updates. The following tasks are run:
 * - Update values for the field `referralCode` and `referredBy`
 *   in the collection named `accounts`.
 *
 * @since v0.4.1
 */
export class AddAccountReferralCode implements MigrationInterface {
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
    // uses collection `accounts`
    const collection = db.collection("accounts");

    // update many `accounts` documents such that
    // - the `referralCode` field contains *a valid referral code*.
    // - the `referredBy` field contains `null`.
    await collection.updateMany(
      {},
      [
        {
          $set: {
            referralCode: {
              // last 8 characters of "_id"
              $substr: [{ $toString: "$_id" }, 16, 8],
            },
            referredBy: null,
          }
        },
      ],
    );

    if (!collection.indexExists("referralCode")) {
      // creates an index for field "referralCode"
      await collection.createIndex("referralCode");
    }
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
    // uses collection `accounts`
    const collection = db.collection("accounts");

    if (collection.indexExists("referralCode")) {
      // drops the index for field "referralCode"
      await collection.dropIndex("referralCode");
    }

    // update many `accounts` documents such that
    // - the `referralCode` field is removed (unset)
    // - the `referredBy` field is removed (unset)
    await collection.updateMany(
      {},
      [
        { $unset: ["referralCode", "referredBy"] },
      ]
    );
  }
}
