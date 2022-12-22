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
import { Component } from "vue-property-decorator";
import { mapGetters } from "vuex";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import DappSelect from "@/components/DappSelect/DappSelect.vue";
import { ActivityEntryDTO } from "@/models/ActivityDTO";

@Component({
  components: {
    DappSelect,
  },
  computed: {
    ...mapGetters({
      getActivities: "activities/getActivityItems",
      currentUserAddress: "auth/getCurrentUserAddress",
    }),
  },
})
export default class Activities extends MetaView {
  /**
   * This property represents activity items fetched with fetchActivities method.
   *
   * @access public
   * @async
   * @returns {ActivityEntryDTO[]}
   */
  public getActivities?: ActivityEntryDTO[];

  /**
   * This property represents current user address.
   *
   * @access public
   * @async
   * @returns {ActivityEntryDTO[]}
   */
  public currentUserAddress?: string;

  /**
   * This property represents mocked and formatted user balance
   *
   * @access public
   * @returns {string}
   */
  public get balance() {
    // temporary use hardcoded value
    return `${this.formatAmount(31392355)} $FIT`;
  }

  /**
   * This property represents mocked and formatted dhp amount
   *
   * @access public
   * @returns {string}
   */
  public get dhpAmount() {
    return `≈${this.formatAmount(31392355)} DHP`;
  }

  /**
   * This computed property returns column names for activities table
   *
   * @access public
   * @returns {string[]}
   */
  public get activitiesTableTitles() {
    return this.$t("activities.table_titles");
  }

  /**
   * This computed property returns mocked table items
   *
   * @access public
   */
  public get mockedItems() {
    if (this.getActivities?.length) {
      return this.getActivities;
    } else {
      return [
        {
          type: "activity",
          activityType: "Ride",
          time: "01:47:41",
          distance: 16.64,
          gain: 74,
          pace: 6.28,
          fit: 0.15,
        },
        {
          type: "activity",
          activityType: "Swim",
          time: "00:20:41",
          distance: 5.14,
          gain: 20,
          pace: 1.28,
          fit: 0.015,
        },
        {
          type: "activity",
          activityType: "Walk",
          time: "03:05:20",
          distance: 52.14,
          gain: 8,
          pace: 30.28,
          fit: 20.02,
        },
      ];
    }
  }

  public get mockedSportTypes() {
    return [
      {
        label: "Walk",
        value: "walk",
      },
      {
        label: "Ride",
        value: "ride",
      },
      {
        label: "Swim",
        value: "swim",
      },
    ];
  }

  public async mounted() {
    if (!this.getActivities?.length) {
      await this.$store.dispatch(
        "activities/fetchActivities",
        this.currentUserAddress
      );
    }
  }
}
