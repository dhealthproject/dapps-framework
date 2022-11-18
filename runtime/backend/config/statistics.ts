/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label CONFIG
 * @module StatisticsConfig
 * @description The dApp statistics configuration. This configuration
 * object is used to determine score aggregation information as
 * listed below:
 * <br /><br />
 * 1. A config object for leaderboards information include:
 *  - A daily score aggregation config object.
 *  - A weekly score aggregation config object.
 *  - A monthly score aggregation config object.
 * <br /><br />
 * **Note** that for each aggregation config object there are:
 *  - A leaderboard type definition.
 *  - A collection name - of which is ued to query information from.
 *  - A fields array - contains the list of fields to sum up for score.
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the statistics schedulers and may
 * thereby affect the data loaded by the backend runtime.
 *
 * @since v0.3.0
 */
export default () => ({
  /**
   * The statistics scope's config values. These include configs
   * for its sub-modules.
   */
  statistics: {
    /**
     * **Leaderboards** sub-module config values.
     * <br /><br />
     * These include scheduler's configs for the aggregation of leaderboard information
     * of 3 period formats:
     * - `"D"` : daily leaderboard statistics.
     * - `"W"` : weekly leaderboard statistics.
     * - `"M"` : monthly leaderboard statistics.
     *
     * @var {object}
     */
    leaderboards: {
      /**
       * The config object for the **daily** score aggregation scheduler.
       *
       * @var {object}
       */
      daily_score: {
        type: "D", // <-- can be directly from date format, i.e. moment().format("D") <-- thats why "D"
        collection: "activities", // <-- later we may change this to "activities"
        fields: ["amount"], // <-- by which fields do we tell the score
      },

      /**
       * The config object for the **weekly** score aggregation scheduler.
       *
       * @var {object}
       */
      weekly_score: {
        type: "W",
        collection: "activities", // <-- later we may change this to "activities"
        fields: ["amount"], // <-- by which fields do we tell the score
      },

      /**
       * The config object for the **monthly** score aggregation scheduler.
       *
       * @var {object}
       */
      monthly_score: {
        type: "M",
        collection: "activities", // <-- later we may change this to "activities"
        fields: ["amount"], // <-- by which fields do we tell the score
      },
    }
  }
});