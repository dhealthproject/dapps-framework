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
import { Module } from "@nestjs/common";

/**
 * @label SCOPES
 * @class UserNotifierModule
 * @description The notifier scope's main module. This module
 * is loaded by the software when `"notifier"` is present in
 * the enabled scopes through configuration (config/dapp.json).
 * This module implements user notifications.
 * <br /><br />
 *
 * @since v0.3.2
 */
@Module({})
export class UserNotifierModule {}
