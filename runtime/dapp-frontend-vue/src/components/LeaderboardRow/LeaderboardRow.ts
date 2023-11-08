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

// internal dependencies
import { MetaView } from "@/views/MetaView";

// child components
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";
import TopActivities from "../TopActivities/TopActivities.vue";
import { LeaderboardEntryDTO } from "@/models/LeaderboardDTO";

// style resource
import "./LeaderboardRow.scss";

/**
 * @class LeaderboardRow
 * @description This class implements a Vue component to display
 * a leaderboard row, taking data from the provided {@link LeaderboardEntryDTO}
 * instance.
 * <br /><br />
 * @example Using the LeaderboardRow component
 * ```html
 * <LeaderboardRow :data="yourData">
 *   <template v-slot:default="props">
 *     <h1>{{ props.itemData.title }}</h1>
 *   </template>
 * </LeaderboardRow>
 * ```
 *
 * @since v0.3.2
 */
@Component({
  components: {
    DirectionTriangle,
    TopActivities,
  },
})
export default class LeaderboardRow extends MetaView {
  /**
   * Configuration for current leader board item
   *
   * @access public
   * @var {data}
   */
  @Prop({ default: () => ({}) }) data?: LeaderboardEntryDTO;

  /**
   * Prop that defines if current leader board item is for existing user
   * adds .current-player to wrapper
   *
   * @access public
   * @var {currentPlayer}
   */
  @Prop({ default: false }) currentPlayer?: boolean;

  /**
   * Computed which defines if current leaderboard item
   * uses slot for a custom data displaying
   *
   * @access public
   */
  get isCustom() {
    return !!this.$slots.default || !!this.$scopedSlots.default;
  }

  /**
   * Method for conversion values to format 0# - 10
   *
   * @access public
   */
  pad(num: string, size: number) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
}
