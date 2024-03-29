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
import InlineSvg from "vue-inline-svg";
import { mapGetters } from "vuex";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import {
  UserDataAggregateDTO,
  UserStatisticsDTO,
} from "@/models/UserStatisticsDTO";
import { ConfigDTO } from "@/models/ConfigDTO";

// child components
import TopActivities from "../TopActivities/TopActivities.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import InfoTip from "../InfoTip/InfoTip.vue";

// style resource
import "./Stats.scss";

@Component({
  components: {
    InlineSvg,
    TopActivities,
    ProgressBar,
    InfoTip,
  },
  computed: {
    ...mapGetters({
      currentUserAddress: "auth/getCurrentUserAddress",
      userStatistics: "statistics/getUserStatistics",
      appConfig: "app/getConfig",
    }),
  },
})
export default class Stats extends MetaView {
  /**
   * This property contains the authenticated user's dHealth Account
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
   * This property contains the app configuration. The configuration
   * field `referralLevels` is used in translation parameters.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {ConfigDTO}
   */
  public appConfig!: ConfigDTO;

  /**
   * @todo missing property documentation
   * @todo this could also be a Prop assigned by parent
   */
  protected numReferralSteps: number = 5;

  /**
   *
   */
  private hasRequested: boolean = false;

  /**
   * @todo missing method documentation
   */
  public get statisticsData(): UserDataAggregateDTO | undefined {
    if (
      !this.hasRequested ||
      !this.userStatistics ||
      !this.userStatistics.data
    ) {
      return undefined;
    }

    return this.userStatistics.data;
  }

  /**
   * @todo missing method documentation
   */
  public get totalEarned(): number {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return 0;
    }

    return this.formatAmount(
      this.statisticsData.totalEarned ?? this.userStatistics.amount ?? 0
    );
  }

  /**
   * @todo missing method documentation
   */
  public get totalPracticedMinutes(): number {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return 0;
    }

    return this.statisticsData.totalPracticedMinutes ?? 0;
  }

  /**
   * @todo missing method documentation
   */
  public get totalReferral(): number {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return 0;
    }

    return this.statisticsData.totalReferral ?? 0;
  }

  /**
   * @todo missing method documentation
   */
  public get levelReferral(): number {
    if (
      !this.hasRequested ||
      undefined === this.appConfig ||
      !this.appConfig.referralLevels ||
      !this.appConfig.referralLevels.length
    ) {
      return 0;
    }

    const referralLevels = this.appConfig.referralLevels;
    for (let i = referralLevels.length - 1; i >= 0; i--) {
      const level = referralLevels[i];
      if (this.totalReferral >= level.minReferred) {
        return i;
      }
    }

    return 0;
  }

  public get remainingReferralsToNextLevel(): number {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return 10;
    }

    const currentLevel = this.levelReferral;
    const level = this.appConfig.referralLevels[currentLevel];
    return level.minReferred - this.totalReferral;
  }

  public get nextLevelPercentage(): number {
    if (this.levelReferral === 0) {
      return 5;
    } else if (this.levelReferral === 1) {
      return 10;
    } else if (this.levelReferral === 2) {
      return 15;
    }

    return 5;
  }

  public get topActivities(): string[] {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return ["Ride", "Swim"];
    }

    return this.statisticsData.topActivities ?? ["Ride", "Swim"];
  }

  /**
   * @todo missing method documentation
   */
  public get fourDigitsAmount() {
    const withFourDecs = `${this.totalEarned.toFixed(4)}`;
    const firstDigit = withFourDecs.slice(0, -4);
    const secondDigit = withFourDecs.slice(-4);

    return [firstDigit, secondDigit];
  }

  /**
   * @todo missing method documentation
   */
  public async mounted() {
    if (undefined !== this.currentUserAddress) {
      await this.$store.dispatch(
        "statistics/fetchStatistics",
        this.currentUserAddress
      );

      this.hasRequested = true;
    }
  }
}
