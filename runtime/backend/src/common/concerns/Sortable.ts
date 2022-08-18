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
 * @interface Sortable
 * @description This concern requires the presence of fields that
 * consist in delivering *sorted* information.
 *
 * @since v0.2.0
 */
export interface Sortable {
  /**
   * A query's sort *column*. This determines which column of a
   * document is used to *sort* search results.
   *
   * @var {number}
   */
  sort: string;

  /**
   * A query's order mode. This determines the *direction* of
   * sorting for search results.
   *
   * @var {number}
   */
  order: string;
}
