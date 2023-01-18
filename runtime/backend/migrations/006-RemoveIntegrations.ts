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
 * @class RemoveIntegrations
 * @description This migration consists in one or more database
 * schema and/or data updates. The following tasks are run:
 * - Remove accountintegrations that were created before 18.01.2023
 * @since v0.6.0
 */
export class RemoveIntegrations implements MigrationInterface {
  async up(db: Db): Promise<any> {
    // uses collection `accountintegrations`
    const collection = db.collection("accountintegrations");

    await collection.deleteMany({
      createdAt: { $lt: new Date("2023-01-18T00:00:58.539+00:00") },
    });
  }

  async down(db: Db) {
    // uses collection `accountintegrations`
    const collection = db.collection("accountintegrations");
    // create one activity with date earlier than 18.01.2023
    await collection.insertOne({
      _id: new mongoose.Types.ObjectId("63c18d84648b5b53bdf54af3"),
      address: "NATZJETZTZCGGRBUYVQRBEUFN5LEGDRSTNF2GYA",
      name: "strava",
      __v: 0,
      authorizationHash: "fakeHashShouldNotWork",
      createdAt: "2023-01-13T16:57:40.289+00:00",
      updatedAt: "2023-01-13T16:57:44.747+00:00",
      encAccessToken: "fakeTokenShouldNotWork",
      encRefreshToken: "fakeTokenShouldNotWork2",
      expiresAt: 1673647946000,
      remoteIdentifier: "fakeIdentifier",
    });
  }
}
