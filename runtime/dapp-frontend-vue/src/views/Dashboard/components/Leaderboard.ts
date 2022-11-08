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
import { LeaderboardItem } from "@/services/LeaderboardService";

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
      getLeaderboardItems: "leaderboard/getLeaderboardItems",
      currentUserAddress: "auth/getCurrentUserAddress",
    }),
  },
})
export default class Leaderboard extends MetaView {
  /**
   * Leader board items getter
   *
   * @access public
   * @var {getLeaderboardItems}
   */
  public getLeaderboardItems: LeaderboardItem[] | undefined;

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
   * This property contains the translator `Translations` instance.
   * This field is populated using the Vuex Store after a successful
   * setup of the internationalization features.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {any}
   * @todo Replace any with correct type of $t() function call
   */
  public $t!: any;

  /**
   * Prop which defines list of items in leaderboard table
   *
   * @access readonly
   * @var {items}
   */
  @Prop({ default: () => [] }) readonly items?: LeaderboardItem[];

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
   * @deprecated This method must be deprecated in favor the actual list of
   * tabs as defined by the UI team.
   *
   * @access protected
   * @returns {LeaderboardTab[]}
   */
  protected get leaderBoardTabs(): LeaderboardTab[] {
    return [
      {
        title: this.$t("leaderboard_tab_week"),
        value: "weekly",
      },
      {
        title: this.$t("leaderboard_tab_all"),
        value: "all",
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

  get currentUserItem() {
    return {
      type: "leaderboard",
      period: "weekly",
      address: this.currentUserAddress,
      position: 89,
      assets: 300,
      avatar: "avatar4.png",
      trendline: "up",
      activities: ["running", "cycling"],
    };
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
      this.getLeaderboardItems &&
      this.itemsToShow > this.getLeaderboardItems?.length
    ) {
      return this.getLeaderboardItems;
    } else {
      return this.getLeaderboardItems?.splice(0, this.itemsToShow);
    }
  }

  /**
   * @todo missing method documentation
   */
  async onTabChange(data: LeaderboardTab) {
    await this.$store.dispatch("leaderboard/fetchLeaderboard", {
      which: this.currentUserAddress,
      period: data.value,
      vm: this,
    });
  }

  /**
   * @todo missing method documentation
   */
  async mounted() {
    if (!this.getLeaderboardItems?.length) {
      await this.$store.dispatch("leaderboard/fetchLeaderboard", {
        which: this.currentUserAddress,
        period: "weekly",
        vm: this,
      });
    }
  }
}
