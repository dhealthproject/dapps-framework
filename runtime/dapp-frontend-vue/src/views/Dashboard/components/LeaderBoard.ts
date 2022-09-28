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

export interface LeaderBoardItem {
  avatar?: string;
  nickname: string;
  hash: string;
  amount: number;
  direction: "up" | "down" | "both";
  color?: string;
}

@Component({
  components: {
    DirectionTriangle,
  },
  computed: {
    ...mapGetters({
      getLeaderBoardItems: "leaderboard/getLeaderBoardItems",
    }),
  },
})
export default class LeaderBoard extends MetaView {
  public getLeaderBoardItems: LeaderBoardItem[] | undefined;
  /**
   * Prop which defines list of items in leaderboard table
   *
   * @access readonly
   * @var {items}
   */
  @Prop({ default: () => [] }) readonly items?: LeaderBoardItem[];

  async mounted() {
    if (!this.getLeaderBoardItems?.length) {
      await this.$store.dispatch("leaderboard/fetchLedaderBoard", {
        which: "running",
        period: "weekly",
      });
    }
  }
}
