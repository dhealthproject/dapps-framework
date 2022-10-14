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
import InlineSvg from "vue-inline-svg";

// style resource
import "./Stats.scss";

export type KnownActivities = "running" | "swimming" | "walking";

export interface StatsConfig {
  address: string;
  period: string;
  periodFormat: string;
  totalPracticedMinutes: number;
  totalEarned: number;
  topActivities: KnownActivities[];
  totalReferral: number;
  levelReferral: number;
}

@Component({
  components: {
    InlineSvg,
  },
})
export default class Stats extends MetaView {
  /**
   * Quickstats component configuration
   *
   * @access readonly
   * @var {data}
   */
  @Prop({ default: () => ({}) }) readonly data?: StatsConfig;

  get fourDigitsAmount() {
    const stringedAmount = `${(
      Math.round((this.data?.totalEarned ?? 0) * 100) / 100
    ).toFixed(4)}`;

    const firstDigit = `${(
      Math.round((this.data?.totalEarned ?? 0) * 100) / 100
    ).toFixed(2)}`;
    const secondDigit = stringedAmount.slice(-2);

    return [firstDigit, secondDigit];
  }

  mounted() {
    this.$store.dispatch("stats/initialize");
  }
}
