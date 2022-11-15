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
 * @class UserStatisticsFields
 * @description A interface that consists of the specialized properties
 * of an account's statistics.
 *
 * @since v0.5.0
 */
export interface UserStatisticsFields {
  totalPracticedMinutes: number;
  totalEarned: number;
  topActivities: string[];
  totalReferral: number;
  levelReferral: number;
}
