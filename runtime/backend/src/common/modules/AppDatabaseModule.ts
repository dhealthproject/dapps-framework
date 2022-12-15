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
import { MongooseModule } from "@nestjs/mongoose";

// internal dependencies
import { AbstractAppModule } from "./AbstractAppModule";

/**
 * @label COMMON
 * @class AppDatabaseModule
 * @description The main definition for the AppDatabaseModule module.
 *
 * @since v0.5.6
 */
export class AppDatabaseModule
  extends MongooseModule
  implements AbstractAppModule {}
