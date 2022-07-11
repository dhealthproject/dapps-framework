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
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// internal dependencies
import { DatabaseConfig } from "src/common/models/DatabaseConfig";

// environment setup necessary due to typeorm
// binary execution in the migration npm script
// this will load the `.env` in `process.env`.
dotenv.config();

// configuration resources
import dappConfigLoader from "./dapp";
const currentDbConfig: DatabaseConfig = dappConfigLoader().database;

export default new DataSource({
  migrationsTableName: "migrations",
  type: "mongodb",
  host: "localhost",
  port: +currentDbConfig.port,
  username: currentDbConfig.user,
  password: process.env.DB_PASS,
  database: currentDbConfig.name,
  authSource: "admin",
  logging: true,
  synchronize: false,
  name: 'default',
  entities: ['src/**/*Schema.ts'],
  migrations: ['migrations/*.ts'],
});
