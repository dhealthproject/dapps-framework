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
import { LeaderBoardItem } from "@/services/LeaderBoardService";
import { Translations } from "@/kernel/i18n/Translations";

// child components
import Tabs from "@/components/Tabs/Tabs.vue";
import LeaderBoardRow from "@/components/LeaderBoardRow/LeaderBoardRow.vue";

export interface LeaderBoardTab {
  title: string;
  value: string;
}

@Component({
  components: {
    DirectionTriangle,
    Tabs,
    LeaderBoardRow,
  },
  computed: {
    ...mapGetters({
      getLeaderBoardItems: "leaderboard/getLeaderBoardItems",
      i18n: "app/i18n",
    }),
  },
})
export default class LeaderBoard extends MetaView {
  /**
   * Leader board items getter
   *
   * @access public
   * @var {getLeaderBoardItems}
   */
  public getLeaderBoardItems: LeaderBoardItem[] | undefined;

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
   * @var {Translations}
   */
  public i18n!: Translations;

  /**
   * Prop which defines list of items in leaderboard table
   *
   * @access readonly
   * @var {items}
   */
  @Prop({ default: () => [] }) readonly items?: LeaderBoardItem[];

  /**
   * Prop which defines amount of items to be shown
   * defaults to 10
   *
   * @access readonly
   * @var {itemsToShow}
   */
  @Prop({ default: 10 }) readonly itemsToShow?: number;

  /**
   * This computed property defines the *leaderboard tabs* for the currently
   * authenticated player.
   *
   * @deprecated This method must be deprecated in favor the actual list of
   * tabs as defined by the UI team.
   *
   * @access protected
   * @returns {LeaderBoardTab[]}
   */
  protected get leaderBoardTabs(): LeaderBoardTab[] {
    return [
      {
        title: this.i18n.$t("leaderboard_tab_week"),
        value: "weekly",
      },
      {
        title: this.i18n.$t("leaderboard_tab_all"),
        value: "all",
      },
    ];
  }

  /**
   * This computed property defines amount of items that will be shown,
   * by the default shows 10 items, can be changed via itemsToShow prop
   *
   * @access public
   * @returns {LeaderBoardItem[]}
   */
  get splicedItems() {
    if (
      this.getLeaderBoardItems &&
      this.itemsToShow! > this.getLeaderBoardItems?.length
    ) {
      return this.getLeaderBoardItems;
    } else {
      return this.getLeaderBoardItems?.splice(0, this.itemsToShow);
    }
  }

  async onTabChange(data: LeaderBoardTab) {
    await this.$store.dispatch("leaderboard/fetchLedaderBoard", {
      which: "running",
      period: data.value,
    });
  }

  async mounted() {
    if (!this.getLeaderBoardItems?.length) {
      await this.$store.dispatch("leaderboard/fetchLedaderBoard", {
        which: "running",
        period: "weekly",
      });
    }
  }
}
