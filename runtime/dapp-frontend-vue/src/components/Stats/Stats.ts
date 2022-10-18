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
import { mapGetters } from "vuex";

// child components
import TopActivities from "../TopActivities/TopActivities.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import InfoTip from "../InfoTip/InfoTip.vue";
import { Translations } from "../../kernel";

// style resource
import "./Stats.scss";

export type KnownActivities = "running" | "swimming" | "cycling";

export interface StatsConfig {
  address: string;
  period: string;
  periodFormat: string;
  totalPracticedMinutes: number;
  totalEarned: number;
  topActivities: KnownActivities[];
  totalReferral: number;
  levelReferral: number;
  friendsReferred: number;
}

@Component({
  components: {
    InlineSvg,
    TopActivities,
    ProgressBar,
    InfoTip,
  },
  computed: {
    ...mapGetters({
      i18n: "app/i18n",
    }),
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
