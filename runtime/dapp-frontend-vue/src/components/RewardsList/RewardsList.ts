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

// internal dependencies
import { MetaView } from "@/views/MetaView";
import Card from "@/components/Card/Card.vue";

// style resource
import "./RewardsList.scss";

export interface MedalItem {
  image: string;
  condition: string;
  relatedActivities?: string;
  received: boolean;
}

/*
 * @class RewardsList
 * @description This class implements a Vue component to display
 * basic list of available medals, based on props value
 *
 * @since v0.3.0
 */
@Component({
  components: {
    Card,
    InlineSvg,
  },
  methods: {
    onMedalClick: () => ({}),
  },
})
export default class RewardsList extends MetaView {
  /**
   * Prop which defines title of current rewards list,
   * example: "Referral".
   * Defaults to "".
   *
   * @access protected
   * @var {string}
   */
  @Prop({ default: "" }) protected title?: string;

  /**
   * Prop which defines description of current rewards list,
   * example: "Keep recording your exercise efforts".
   * Defaults to "".
   *
   * @access protected
   * @var {string}
   */
  @Prop({ default: "" }) protected description?: string;

  /**
   * Prop which defines list of the rewards and their state
   *
   * @access protected
   * @var {MedalItem[]}
   */
  @Prop({ default: () => [] }) protected medals?: MedalItem[];

  /**
   * This method opens "share" popup
   *
   * @access protected
   * @returns void
   */
  public handleShare() {
    // display a custom modal popup
    this.$root.$emit("modal", {
      type: "share",
      overlayColor: "rgba(0, 0, 0, .50)",
      width: 518,
      modalBg: "#FFFFFF",
    });
  }

  /**
   * This method handles opening of medal popup with data received in argument
   *
   * @access protected
   * @returns void
   */
  public onMedalClick(medal: MedalItem) {
    if (medal.received) {
      this.$root.$emit("modal", {
        type: "medal",
        overlayColor: "rgba(0, 0, 0, 0.2)",
        width: 720,
        modalBg: "#FFFFFF",
        medal: medal.image,
        condition: medal.condition,
        activities: medal.relatedActivities,
      });
    }
  }
}
