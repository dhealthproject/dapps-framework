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
 * @interface Pageable
 * @description This concern requires the presence of fields that
 * consist in delivering *paginated* information.
 *
 * @since v0.2.0
 */
export interface Pageable {
  /**
   * A query's page number. This determines the *offset* of search
   * results.
   *
   * @var {number}
   */
  pageNumber: number;

  /**
   * A query's page size. This determines the *number of items* a
   * search result will contain.
   *
   * @var {number}
   */
  pageSize: number;
}
