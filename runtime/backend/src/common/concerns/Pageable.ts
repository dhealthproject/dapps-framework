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
 * @interface Pageable
 * @description This concern requires the presence of fields that
 * consist in delivering *paginated* information.
 *
 * @since v0.1.0
 */
export interface Pageable {
  /**
   * Page number query.
   * Determine which page number the result should be returned from.
   *
   * E.g.
   * ```js
   *  pageNumber: 3
   * ```
   *
   * @var {number}
   */
  pageNumber: number;

  /**
   * Page size query.
   * Determine which page size the result should be returned as.
   *
   * E.g.
   * ```js
   *  pageSize: 100
   * ```
   *
   * @var {number}
   */
  pageSize: number;
}
