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
 * @class SnackBarConfig
 * @description This interface serves as a configuration object for Snack-Bars.
 * These are often also referred to as "Toast" notifications or error messages.
 * <br /><br />
 * @example Using the `SnackBarConfig` interface
 * ```typescript
 *   const api = new ProfileService();
 *   const user: User = await api.getMe();
 *   console.log(user);
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string | "success" | "error"}    state   Contains a completion state, e.g. "success".
 * @param   {string}      title         Contains the *title* of the snack-bar.
 * @param   {string}      description   Contains the *text* (or "description") inside the snack-bar.
 *
 * @since v0.3.2
 */
export interface SnackBarConfig {
  state: string | "success" | "error";
  title: string;
  description: string;
}
