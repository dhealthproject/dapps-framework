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
 * @interface Countable
 * @description This concern requires the presence of fields that
 * consist in delivering *counted* information.
 *
 * @since v0.1.0
 */
export interface Countable {
  /**
   * The total number of results.
   *
   * @var {number}
   */
  total: number;
}
