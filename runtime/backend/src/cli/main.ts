#!/usr/bin/env node
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
import { CommandFactory } from "nest-commander";

// internal dependencies
import { CLIModule } from "./CLIModule";
import { DappConfig } from "../common/models/DappConfig";

// configuration resources
import dappConfigLoader from "../../config/dapp";

/**
 * Function to bootstrap the CLI of the app.
 *
 * @async
 * @returns {Promise<void>}
 */
async function bootstrap(): Promise<void> {
  // create an instance of the CLI with imported configs
  await CommandFactory.run(
    CLIModule.register({
      ...(dappConfigLoader()),
    } as DappConfig) as any, // nest-commander CommandFactory accepts only Type<any>
    ["warn", "error"],
  );
}

// bootstrap the scheduler
bootstrap();
