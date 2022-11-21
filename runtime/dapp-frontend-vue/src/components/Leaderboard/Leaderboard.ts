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
import { mapGetters } from "vuex";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";
import { LeaderboardEntryDTO } from "@/models/LeaderboardDTO";

// child components
import Tabs from "@/components/Tabs/Tabs.vue";
import LeaderboardRow from "@/components/LeaderboardRow/LeaderboardRow.vue";

export interface LeaderboardTab {
  title: string;
  value: string;
}
@Component({
  components: {
    DirectionTriangle,
    Tabs,
    LeaderboardRow,
  },
  computed: {
    ...mapGetters({
      currentUserAddress: "auth/getCurrentUserAddress",
      leaderboardItems: "leaderboard/getLeaderboardItems",
      userLeaderboardEntry: "leaderboard/getUserLeaderboardEntry",
    }),
  },
})
export default class Leaderboard extends MetaView {
  /**
   * This property contains the authenticated user's dHealth Accountsd
   * Address. This field is populated using the Vuex Store after a
   * successful request to the backend API's `/me` endpoint.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string}
   */
  public currentUserAddress!: string;

  /**
   * This property maps to the store getter `leaderboard/getLeaderboardItems`
   * and contains values defined with {@link LeaderboardEntryDTO}.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {LeaderboardEntryDTO}
   */
  public leaderboardItems!: LeaderboardEntryDTO[];

  /**
   * This property maps to the store getter `leaderboard/getLeaderboardItems`
   * and contains values defined with {@link LeaderboardEntryDTO}.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {LeaderboardEntryDTO}
   */
  public userLeaderboardEntry!: LeaderboardEntryDTO;

  /**
   * Prop which defines amount of items to be shown, defaults to 10.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access readonly
   * @var {itemsToShow}
   */
  @Prop({ default: 10 }) readonly itemsToShow!: number;

  /**
   * This computed property defines the *leaderboard tabs* for the currently
   * authenticated player.
   *
   * @access protected
   * @returns {LeaderboardTab[]}
   */
  protected get leaderBoardTabs(): LeaderboardTab[] {
    return [
      {
        title: this.$t("common.this_week"),
        value: "W",
      },
      {
        title: this.$t("common.all_time"),
        value: "D",
      },
    ];
  }

  /**
   * This computed property is mock for "current player" leaderboard object
   *
   * @access public
   * @returns {LeaderboardItem}
   * @deprecated should be deleted after api will provide user for leaderboard
   */
  get currentUserItem(): LeaderboardEntryDTO {
    return this.userLeaderboardEntry;
    // return {
    //   type: "leaderboard",
    //   period: "weekly",
    //   address: this.currentUserAddress,
    //   position: 89,
    //   assets: 300,
    //   avatar: "avatar4.png",
    //   trendline: "up",
    //   activities: ["running", "cycling"],
    // };
  }

  /**
   * This computed property defines amount of items that will be shown,
   * by the default shows 10 items, can be changed via itemsToShow prop
   *
   * @access public
   * @returns {LeaderboardItem[]}
   */
  get splicedItems() {
    if (
      this.leaderboardItems &&
      this.itemsToShow < this.leaderboardItems.length
    ) {
      return this.leaderboardItems.splice(0, this.itemsToShow);
    }

    return this.leaderboardItems;
  }

  /**
   * @todo missing method documentation
   */
  async onTabChange(data: LeaderboardTab) {
    await this.$store.dispatch("leaderboard/fetchLeaderboard", {
      periodFormat: data.value,
    });
  }

  /**
   * @todo missing method documentation
   */
  public async mounted() {
    await this.$store.dispatch("leaderboard/fetchLeaderboard", {
      periodFormat: this.leaderBoardTabs[0].value,
    });

    await this.$store.dispatch("leaderboard/fetchUserLeaderboardEntry", {
      address: this.currentUserAddress,
      periodFormat: this.leaderBoardTabs[0].value,
    });
  }
}
