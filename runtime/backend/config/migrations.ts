/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { mongoMigrateCli } from 'mongo-migrate-ts';
import dotenv from "dotenv";
import fs from "fs";

// internal dependencies
import { DatabaseConfig } from "src/common/models/DatabaseConfig";

// runtime path configuration
// @todo permit to overwrite the default deployment
// @todo strategy that uses a root folder with all projects
// @todo and a `runtime/backend/` subfolder for the backend
let rootFolderPath = undefined !== process.env && "PWD" in process.env
  ? `${process.env["PWD"]}/../..` // runtime/backend
  : `${__dirname}/../../..`; // runtime/backend/config

// environment configuration
const envFilePath = `${rootFolderPath}/.env`;
if (!fs.existsSync(envFilePath)) {
  throw new Error(
    `An error occurred configuring the database migrations. ` +
    `A ".env" file was not found in ${envFilePath}`);
}

// environment setup necessary due to mongo-migrate
// binary execution in the migration npm script
// this will load the `.env` in `process.env`.
const { parsed: env, error } = dotenv.config({ path: envFilePath });
if (undefined === env || error !== undefined) {
  throw new Error(`Could not load configuration from ${envFilePath}: ${error}.`);
}

// configuration resources
import dappConfigLoader from "./dapp";
const db: DatabaseConfig = dappConfigLoader().database;

// Note that the database *password* is intentionally read *only* from environment
// variables and is **not added to the configuration** to reduce potential leaks.
mongoMigrateCli({
  uri: `mongodb://${db.user}:${env.DB_PASS}@localhost:${db.port}/${db.name}?authSource=admin`,
  migrationsDir: "migrations",
  migrationsCollection: "migrations",
});
