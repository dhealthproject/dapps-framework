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
 * @interface Sortable
 * @description This concern requires the presence of fields that
 * consist in delivering *sorted* information.
 *
 * @since v0.1.0
 */
export interface Sortable {
  /**
   * Sort query.
   * Determine which field of the result should be sorted by.
   *
   * E.g.
   * ```js
   *  sort: 'address'
   * ```
   *
   * @var {string}
   */
  sort: string;

  /**
   * Order query.
   * Determine which direction the result should be sorted by.
   *
   * Values are `asc` and `desc`.
   *
   * E.g.
   * ```js
   *  order: 'asc'
   * ```
   *
   * @var {string}
   */
  order: string;
}
