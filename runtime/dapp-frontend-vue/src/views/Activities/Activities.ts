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
import { UserStatisticsDTO } from "@/models/UserStatisticsDTO";

@Component({
  components: {
    DappSelect,
  },
  computed: {
    ...mapGetters({
      currentUserAddress: "auth/getCurrentUserAddress",
      getActivities: "activities/getActivityItems",
      userStatistics: "statistics/getUserStatistics",
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
  public currentUserAddress!: string;

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
   * This property represents current selected filter.
   *
   * @access public
   * @async
   */
  public sportFilter = "";

  /**
   * This method sets current filter value
   *
   * @access protected
   * @param {string}
   * @returns void
   * @async
   */
  protected handleInput(val: string) {
    this.sportFilter = val;
  }

  /**
   * This property represents mocked and formatted user balance
   *
   * @access public
   * @returns {string}
   */
  public get balance() {
    // temporary use hardcoded value
    const balance = this.userStatistics.amount ?? 0;
    return `${this.formatAmount(balance)} $ACTIV`;
  }

  /**
   * This property represents mocked and formatted dhp amount
   *
   * @access public
   * @returns {string}
   */
  public get dhpAmount() {
    return `≈${this.formatAmount(0)} DHP`;
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
  public get activityItems() {
    return this.sportFilter
      ? this.getActivities?.filter(
          (item) => item?.sport.toLowerCase() === this.sportFilter
        )
      : this.getActivities;
  }

  public get sportTypes() {
    return [
      {
        label: "All",
        value: "",
      },
      {
        label: "Walk",
        value: "walk",
      },
      {
        label: "Run",
        value: "run",
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
