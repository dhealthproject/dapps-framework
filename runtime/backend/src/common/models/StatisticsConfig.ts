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
 * @type ScoreSchedulerConfig
 * @description This type consists of:
 *  - A period format type e.g. "D", "W", "M" for daily, weekly & monthly.
 *  - A collection name - of which schedulers will use to aggregate statistics from.
 *  - A fields array - which the schedulers will use to sum up for score.
 *
 * @link StatisticsConfig:COMMON
 * @since v0.3.2
 */
export type ScoreSchedulerConfig = {
  type: string;
  collection: string;
  fields: string[];
};

/**
 * @label COMMON
 * @type LeaderboardConfig
 * @description This type consists of 3 {@link ScoreSchedulerConfig} objects:
 *  - `daily_score`: the score config values for daily statistics aggregation.
 *  - `weekly_score`: the score config values for weekly statistics aggregation.
 *  - `monthly_score`: the score config values for monthly statistics aggregation.
 * @link StatisticsConfig:COMMON
 * @since v0.3.2
 */
export type LeaderboardConfig = {
  [key: string]: ScoreSchedulerConfig;
  daily_score: ScoreSchedulerConfig;
  weekly_score: ScoreSchedulerConfig;
  monthly_score: ScoreSchedulerConfig;
};

/**
 * @label COMMON
 * @interface StatisticsConfig
 * @description The dApp statistics configuration. This configuration
 * object is used to determine souce collection and source fields to read from
 * in order to aggregate statistics information.
 *
 * @link StatisticsConfig:CONFIG
 * @since v0.3.2
 */
export interface StatisticsConfig {
  statistics: {
    leaderboard: LeaderboardConfig;
  };
}
