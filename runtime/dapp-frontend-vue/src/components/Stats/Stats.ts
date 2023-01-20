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
   * Property that indicates the number of referral steps that this
   * component displays.
   * Defaulted to 5.
   *
   * @access protected
   * @var {number}
   */
  protected numReferralSteps: number = 5;

  /**
   * Property to indicate whether statistics data has already
   * been requested.
   * Defaulted to false.
   *
   * @access private
   * @var {boolean}
   */
  private hasRequested: boolean = false;

  /**
   * Getter method to return this component's statistics data.
   * Returns undefined if statistics data doesn't exist.
   *
   * @access public
   * @returns {UserDataAggregateDTO | undefined}
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
   * Getter method to return the total amount earned by this user.
   *
   * @access public
   * @returns {number}
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
   * Getter method to return the total practice (exercise) minutes
   * of this user.
   *
   * @access public
   * @returns {number}
   */
  public get totalPracticedMinutes(): number {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return 0;
    }

    return this.statisticsData.totalPracticedMinutes ?? 0;
  }

  /**
   * Getter method to return the total number of refferals
   * the user made.
   *
   * @access public
   * @returns {number}
   */
  public get totalReferral(): number {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return 0;
    }

    return this.statisticsData.totalReferral ?? 0;
  }

  /**
   * Getter method to return the current level of referrals
   * the user has.
   *
   * @access public
   * @returns {number}
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

  /**
   * Getter method to return the remaining refferals the user
   * need to make the next referral level.
   *
   * @access public
   * @returns {number}
   */
  public get remainingReferralsToNextLevel(): number {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return 10;
    }

    const currentLevel = this.levelReferral;
    const level = this.appConfig.referralLevels[currentLevel];
    return level.minReferred - this.totalReferral;
  }

  /**
   * Getter method to return the percentage of the next level.
   *
   * @access public
   * @returns {number}
   */
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

  /**
   * Getter method to return the top activities that the user
   * has participated in.
   *
   * @access public
   * @returns {string[]}
   */
  public get topActivities(): string[] {
    if (!this.hasRequested || undefined === this.statisticsData) {
      return ["Ride", "Swim"];
    }

    return this.statisticsData.topActivities ?? ["Ride", "Swim"];
  }

  /**
   * Getter method to return the total earned amount in a four
   * digits format amount. The result is an array of 2 strings,
   * indicating the whole amount, and the fractional part.
   *
   * @access public
   * @returns {[string, string]}
   */
  public get fourDigitsAmount(): [string, string] {
    const withFourDecs = `${this.totalEarned.toFixed(4)}`;
    const firstDigit = withFourDecs.slice(0, -4);
    const secondDigit = withFourDecs.slice(-4);

    return [firstDigit, secondDigit];
  }

  /**
   * Method to handle `mounted` event of this component.
   *
   * @access public
   * @async
   * @returns {Promise<void>}
   */
  public async mounted(): Promise<void> {
    if (undefined !== this.currentUserAddress) {
      await this.$store.dispatch(
        "statistics/fetchStatistics",
        this.currentUserAddress
      );

      this.hasRequested = true;
    }
  }
}
