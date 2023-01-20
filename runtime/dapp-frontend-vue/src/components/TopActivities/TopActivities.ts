/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// external dependencies
import { Component, Prop } from "vue-property-decorator";
import InlineSvg from "vue-inline-svg";
import { mapGetters } from "vuex";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import {
  UserDataAggregateDTO,
  UserStatisticsDTO,
} from "@/models/UserStatisticsDTO";

// style resource
import "./TopActivities.scss";

@Component({
  components: {
    InlineSvg,
  },
  computed: {
    ...mapGetters({
      userStatistics: "statistics/getUserStatistics",
    }),
  },
})
export default class TopActivities extends MetaView {
  /**
   * This component property permits to overwrite the items that
   * must be displayed using `:items="[]"`.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string[]}
   */
  @Prop({ default: () => [] })
  public items!: string[];

  /**
   * Defines positioning of icons
   *
   * @access public
   * @readonly
   * @var {boolean}
   */
  @Prop({ default: false })
  public readonly sticked?: boolean;

  /**
   * This property contains the user statistics and maps to a store
   * getter named `statistics/getUserStatistics`.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {UserStatisticsDTO}
   */
  public userStatistics!: UserStatisticsDTO;

  /**
   * Getter method to return this user's statistics data.
   *
   * @access public
   * @returns {UserDataAggregateDTO | undefined}
   */
  public get statisticsData(): UserDataAggregateDTO | undefined {
    if (!this.userStatistics || !this.userStatistics.data) {
      return undefined;
    }

    return this.userStatistics.data;
  }

  /**
   * Getter method to return all statistic entry items
   * of the current statistics data.
   *
   * @access public
   * @returns {string[]}
   */
  public get fetchedItems(): string[] {
    if (this.items && this.items.length) {
      return this.items;
    }

    if (undefined === this.statisticsData) {
      return ["Ride", "Swim"];
    }

    const topActivities = this.statisticsData.topActivities
      ? this.statisticsData.topActivities
      : ["Ride", "Swim"];

    return topActivities;
  }
}
