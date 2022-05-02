/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @type PaginationMode
 * @description This type defines the pagination modes
 * that are available for card components.
 * <br /><br />
 * Following values are possible:
 *   - `"default"`: Uses the default, client-side pagination mode.
 *   - `"client"`: Uses the client-side pagination mode.
 *   - `"server": Uses the server-side pagination mode (backend).
 *   - `"none": Does not permit navigating through pages.
 *
 * @since v0.1.0
 */
export type PaginationMode = "none" | "default" | "client" | "api";
