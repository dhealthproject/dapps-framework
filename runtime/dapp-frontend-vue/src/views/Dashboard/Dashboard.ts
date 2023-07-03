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
import { DappButton } from "@dhealth/components";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import {
  CarouselItem,
  CarouselConfig,
} from "@/views/Dashboard/components/EventsCarousel";
import { SocialPlatformDTO } from "@/models/SocialPlatformDTO";

// child components
import Card from "@/components/Card/Card.vue";
import UiButton from "@/components/UiButton/UiButton.vue";
import ProgressBar from "@/components/ProgressBar/ProgressBar.vue";
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";
import Tabs from "@/components/Tabs/Tabs.vue";
import GenericList from "@/components/GenericList/GenericList.vue";
import EventsCarousel from "@/views/Dashboard/components/EventsCarousel.vue";
import Leaderboard from "@/components/Leaderboard/Leaderboard.vue";
import Stats from "@/components/Stats/Stats.vue";
import ReferralInput from "@/components/ReferralInput/ReferralInput.vue";

export interface OtherPlayer {
  avatar: string;
  name: string;
  action: string;
}

export interface StatisticsNumberWithTrend {
  title: string;
  amount: number;
  direction: "up" | "down";
}

export interface StatisticsTabItem {
  title: string;
  quickStats: StatisticsNumberWithTrend[];
  medals: string[];
  friends: OtherPlayer[];
}

@Component({
  components: {
    Card,
    DividedScreen,
    DappButton,
    InlineSvg,
    DirectionTriangle,
    EventsCarousel,
    Leaderboard,
    Tabs,
    GenericList,
    UiButton,
    ProgressBar,
    Stats,
    ReferralInput,
  },
  computed: {
    ...mapGetters({
      hasSnackBar: "app/hasSnackBar",
      currentUserAddress: "auth/getCurrentUserAddress",
      getIntegrations: "oauth/getIntegrations",
      refCode: "auth/getRefCode",
      fetchedSocialPlatforms: "app/socialApps",
    }),
  },
})
export default class Dashboard extends MetaView {
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
   * This property maps to the store getter `app/socialApps` and contains
   * values defined with {@link SocialPlatformDTO}.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {SocialPlatformDTO[]}
   */
  public fetchedSocialPlatforms!: SocialPlatformDTO[];

  /**
   * This property contains the list of integrations for current user.
   * This field is populated using the Vuex Store after a successful
   * setup of the oauth module.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string[]}
   */
  public getIntegrations!: string[];

  /**
   * This property contains the value as set in the store under
   * `auth/userRefCode`.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string}
   */
  public refCode!: string;

  /**
   * This property contains the referral code *input value*.
   *
   * @access protected
   * @var {string}
   */
  protected refInput?: string | undefined = "";

  /**
   * This computed property defines the configuration of the `vueper`
   * Carousel Widget that is displayed on this screen.
   *
   * @access protected
   * @returns {CarouselConfig}
   */
  protected get sliderConfig(): CarouselConfig {
    return {
      arrows: false,
      bullets: false,
      itemsHeight: "203px",
      visibleSlides: 2.2,
      gap: 4,
    };
  }

  /**
   * This computed property defines *custom media queries* to further
   * configure the `vueper` Carousel. It defines breakpoints to know
   * how many slides can be displayed completely.
   *
   * @access protected
   * @returns {any}
   */
  protected get sliderBreakPoints(): any {
    return {
      768: {
        visibleSlides: 1,
      },
    };
  }

  /**
   * This computed property defines the *list* of slides that are
   * displayed inside the `vueper` Carousel.
   *
   * @deprecated This method must be deprecated in favor the actual carousel
   * items discovery implementation using the backend runtime.
   *
   * @access protected
   * @returns {CarouselItem[]}
   */
  protected get carouselItems(): CarouselItem[] {
    return [
      {
        image: "footballbg.jpg",
        gradient:
          "linear-gradient(360deg, rgba(32, 89, 234, 0.7) 0%, rgba(32, 94, 255, 0) 106.16%)",
        footer: {
          title: "24/7 HIIT",
          participants: "29,988",
        },
      },
      {
        header: {
          icon: "provided.svg",
          text: "Powered by dHealth",
        },
        image: "runningbg.jpg",
        gradient:
          "linear-gradient(0deg, rgba(0, 117, 89, 0.6) 7.64%, rgba(9, 129, 107, 0) 119.21%)",
        footer: {
          title: "Yoga Mind",
          participants: "10,102",
        },
      },
      {
        image: "footballbg.jpg",
        gradient:
          "linear-gradient(360deg, rgba(32, 89, 234, 0.7) 0%, rgba(32, 94, 255, 0) 106.16%)",
        footer: {
          title: "24/7 HIIT",
          participants: "29,988",
        },
      },
    ];
  }

  /**
   * This computed property defines the *statistics tabs* for the currently
   * authenticated player.
   *
   * @deprecated This method must be deprecated in favor the actual list of
   * tabs as defined by the UI team.
   *
   * @access protected
   * @returns {StatisticsTabItem[]}
   */
  protected get statisticsTabs(): StatisticsTabItem[] {
    return [
      {
        title: this.$t("common.all_time"),
        quickStats: [
          {
            title: this.$t("dashboard.statistics_label_minutes_practiced"),
            amount: 0,
            direction: "up",
          },
          {
            title: this.$t("dashboard.statistics_label_fit_earned"),
            amount: 0,
            direction: "down",
          },
          {
            title: this.$t("dashboard.statistics_label_calories_burnt"),
            amount: 0,
            direction: "down",
          },
          {
            title: this.$t("dashboard.statistics_label_friends_referred"),
            amount: 0,
            direction: "down",
          },
        ],
        medals: ["medal1.svg", "medal2.svg", "medal3.svg", "medal4.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
            action: this.$t("dashboard.statistics_label_go1on1"),
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
            action: this.$t("dashboard.statistics_label_go1on1"),
          },
        ],
      },
      {
        title: this.$t("common.today"),
        quickStats: [
          {
            title: this.$t("dashboard.statistics_label_minutes_practiced"),
            amount: 0,
            direction: "down",
          },
          {
            title: this.$t("dashboard.statistics_label_fit_earned"),
            amount: 0,
            direction: "down",
          },
          {
            title: this.$t("dashboard.statistics_label_calories_burnt"),
            amount: 0,
            direction: "up",
          },
          {
            title: this.$t("dashboard.statistics_label_friends_referred"),
            amount: 0,
            direction: "down",
          },
        ],
        medals: ["medal1.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
            action: this.$t("dashboard.statistics_label_go1on1"),
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
            action: this.$t("dashboard.statistics_label_go1on1"),
          },
        ],
      },
    ];
  }

  /**
   * This method returns current operation system of user
   *
   * @access protected
   * @returns {string}
   */
  public get getMobileOS() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      return "Android";
    } else if (
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    ) {
      return "iOS";
    }
    return "Other";
  }

  /**
   * This hook is called upon mounting the component on the App. It
   * should handle the *initialization* of the screen and interpret
   * the request query if necessary.
   *
   * @access protected
   * @async
   * @returns {Promise<void>}
   */
  protected async mounted(): Promise<void> {
    // in case we came here from log-in screen, we may
    // not have a profile in the Vuex Store yet, fill now.
    if (!this.currentUserAddress) {
      await this.$store.dispatch("auth/fetchProfile");
    }

    // extracts "callback" parameters for when the user comes back
    // from the authorization process on the third-party platform
    const { state, code, scope, error } = this.$route.query;

    // if we come back to dashboard FROM the OAuth Authorization,
    // then we can now *query an access token* from the data provider
    // a redirection will happen after retrieval of the access token.
    if (state) {
      // handles the case when selected not all checkboxes
      if (scope && scope !== "read,activity:read_all") {
        this.displayErrorMessage(`Please select all fields`);
      } else if (error) {
        // handles "denial" of user authorization on the third-party platform
        this.displayErrorMessage(
          `Please click "authorize" on the Strava authorization`
        );
      } else {
        // if route query has valid data - display success message
        this.$root.$emit("toast", {
          title: "Great job!",
          description: "We've integrated your account",
          state: "success",
          icon: "icons/like-icon.svg",
          dismissTimeout: 7000,
        });
      }

      this.$store.commit("oauth/setParameters", { code, state, scope, error });
      await this.oauthCallbackRedirect();
      await this.$router.replace({ name: "app.dashboard" });
    }

    this.refInput = this.refCode;
  }

  /**
   * This component method is used internally to display a *pre-configured*
   * snack-bar that contains an *error message*.
   *
   * @access protected
   * @param   {string}    error     The error message
   * @returns {void}
   */
  protected displayErrorMessage(error: string): void {
    this.$root.$emit("toast", {
      title: "Error!",
      description: error,
      state: "error",
      icon: "icons/close-icon.svg",
      dismissTimeout: 7000,
    });
  }

  /**
   * This component method is used to *redirect the user* to the OAuth
   * *authorization page* of a third-party data provider, e.g. Strava.
   * <br /><br />
   * This is the **first step** (Step 1) of the Strava authorization
   * process.
   *
   * @access protected
   * @returns {void}
   */
  protected oauthAuthorizeRedirect(): void {
    // redirects the user to backend /oauth/strava/authorize
    this.$store.dispatch("oauth/authorize", this.currentUserAddress);
  }

  /**
   * This component method is used to *request an access token* from a
   * third-party OAuth provider, e.g. Strava.
   * <br /><br />
   * This is the **second step** (Step 2) of the Strava authorization
   * process.
   *
   * @access protected
   * @async
   * @returns {Promise<void>}
   */
  protected async oauthCallbackRedirect(): Promise<void> {
    // redirects the user to backend /oauth/strava/callback
    await this.$store.dispatch("oauth/callback", this.currentUserAddress);
    // after integrations related actions done - get updated profile
    await this.$store.dispatch("auth/fetchProfile");
  }

  /**
   * @todo missing method documentation
   */
  protected shareModal() {
    // display a custom modal popup
    this.$root.$emit("modal", {
      type: "share",
      overlayColor: "rgba(0, 0, 0, .50)",
      width: 518,
      modalBg: "#FFFFFF",
    });
  }
}
