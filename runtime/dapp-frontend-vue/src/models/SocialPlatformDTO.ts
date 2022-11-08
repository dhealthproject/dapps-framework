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
 * @class SocialPlatformDTO
 * @description This interface defines the fields that are returned
 * by the backend runtime using the `/social` endpoints namespace.
 * <br /><br />
 * @example Using the `SocialPlatformDTO` interface
 * ```typescript
 * const app = { icon: "share/github.svg", shareUrl: "https://github.com/fork-me" };
 * ```
 * <br /><br />
 * #### Properties
 *
 * @param   {string}    icon           Contains the file path to the icon file, e.g. `share/facebook.svg`.
 * @param   {string}    shareUrl       Contains the social platform *share content* URL.
 * @param   {string}    title         (Optional) Contains a human-readable title for the social platform.
 * @param   {string}    profileUrl    (Optional) Contains the social platform *profile* URL, e.g. `https://example.com/account1`.
 * @param   {string}    appUrl        (Optional) Contains the social platform *app* URL, e.g. `https://facebook.com/ELEVATE`.
 *
 * @since v0.5.0
 */
export interface SocialPlatformDTO {
  icon: string;
  shareUrl: string;
  title?: string;
  profileUrl?: string;
  appUrl?: string;
}
