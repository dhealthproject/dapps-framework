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
import mongoose from "mongoose";
/**
 * @label DATABASE
 * @class AddMockedActivities
 * @description This migration consists in one or more database
 * schema and/or data updates. The following tasks are run:
 * - Add mocked activity with hardcoded
 * data to fill `activities` collection
 * with data. Without posting activity in Strava.
 *
 * @since v0.6.0
 */
export class AddMockedActivities implements MigrationInterface {
  async up(db: Db): Promise<any> {
    // uses collection `activities`
    const collection = db.collection("activities");
    // insert one `activity` document
    await collection.insertOne({
      _id: new mongoose.Types.ObjectId("63529c31904bb2acae61d82a"),
      address: "NBZTCWH3FCWBEPX2MR2GLDHHIVBKWGQWDEP6C7Q",
      slug: "20221021-5-7996869084-96231663",
      __v: 0,
      activityAssets: [],
      activityData: {
        slug: "20221021-5-7996869084-96231663",
        address: "NBZTCWH3FCWBEPX2MR2GLDHHIVBKWGQWDEP6C7Q",
        name: "something",
        sport: "Run",
        startedAt: 1666354701000,
        timezone: "(GMT+01:00) Europe/Madrid",
        startLocation: [],
        endLocation: [],
        hasTrainerDevice: false,
        elapsedTime: 3600,
        movingTime: 3600,
        distance: 9000,
        elevation: 0,
        kilojoules: 0,
        calories: 0,
        createdAt: new Date("2022-10-21T13:18:42.321Z"),
        updatedAt: new Date("2022-10-21T13:18:42.321Z"),
        _id: new mongoose.Types.ObjectId("63529c328873f89bf59c25a7"),
      },
      createdAt: new Date("2022-10-21T13:18:41.375Z"),
      dateSlug: "20221021",
      processingState: 0,
      provider: "strava",
      remoteIdentifier: "7996869084",
      updatedAt: new Date("2022-10-21T13:18:42.321Z"),
    });
    // creates an index for field `payoutState`
    await collection.createIndex("payoutState");
  }
  async down(db: Db): Promise<any> {
    // uses collection `activities`
    const collection = db.collection("activities");
    // delete item
    await collection.deleteOne({
      _id: new mongoose.Types.ObjectId("63529c31904bb2acae61d82a"),
    });
  }
}
