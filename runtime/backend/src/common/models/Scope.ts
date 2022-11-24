/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label COMMON
 * @type {Scope}
 * @description This enumeration contains the configurable **scopes** for
 * the runtime. Any newly added scope must be added here as well to make
 * sure, and in case it's necessary, that the scope can be *enabled*
 * through the configuration of the backend runtime.
 *
 * @since v0.1.0
 */
export type Scope =
  | string
  | "database"
  | "discovery"
  | "notifier"
  | "payout"
  | "processor"
  | "statistics";
