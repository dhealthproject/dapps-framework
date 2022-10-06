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
import { Translations } from "@/kernel/i18n/Translations";

// child components
import Card from "@/components/Card/Card.vue";
import UiButton from "@/components/UiButton/UiButton.vue";
import ProgressBar from "@/components/ProgressBar/ProgressBar.vue";
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";
import Tabs from "@/components/Tabs/Tabs.vue";
import GenericList from "@/components/GenericList/GenericList.vue";
import EventsCarousel from "@/views/Dashboard/components/EventsCarousel.vue";
import LeaderBoard from "@/views/Dashboard/components/LeaderBoard.vue";

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
    LeaderBoard,
    Tabs,
    GenericList,
    UiButton,
    ProgressBar,
  },
  computed: {
    ...mapGetters({
      i18n: "app/i18n",
      hasSnackBar: "app/hasSnackBar",
      currentUserAddress: "auth/getCurrentUserAddress",
      getIntegrations: "oauth/getIntegrations",
    }),
  },
})
export default class Dashboard extends MetaView {
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
   * @var {Translations}
   */
  public i18n!: Translations;

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
   * This property contains refcode,
   * that will be set to refCode input on the dashboard
   * and copied to clipboard
   *
   * @var {string}
   */
  public ref = "";

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
        title: this.i18n.$t("dashboard_statistics_tabs_alltime"),
        quickStats: [
          {
            title: this.i18n.$t("dashboard_statistics_label_minutes_practiced"),
            amount: 3099,
            direction: "up",
          },
          {
            title: this.i18n.$t("dashboard_statistics_label_fit_earned"),
            amount: 560,
            direction: "down",
          },
          {
            title: this.i18n.$t("dashboard_statistics_label_calories_burnt"),
            amount: 1094,
            direction: "down",
          },
          {
            title: this.i18n.$t("dashboard_statistics_label_friends_referred"),
            amount: 5,
            direction: "down",
          },
        ],
        medals: ["medal1.svg", "medal2.svg", "medal3.svg", "medal4.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
            action: this.i18n.$t("dashboard_statistics_label_go1on1"),
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
            action: this.i18n.$t("dashboard_statistics_label_go1on1"),
          },
        ],
      },
      {
        title: this.i18n.$t("dashboard_statistics_tabs_today"),
        quickStats: [
          {
            title: this.i18n.$t("dashboard_statistics_label_minutes_practiced"),
            amount: 520,
            direction: "down",
          },
          {
            title: this.i18n.$t("dashboard_statistics_label_fit_earned"),
            amount: 350,
            direction: "down",
          },
          {
            title: this.i18n.$t("dashboard_statistics_label_calories_burnt"),
            amount: 2035,
            direction: "up",
          },
          {
            title: this.i18n.$t("dashboard_statistics_label_friends_referred"),
            amount: 5,
            direction: "down",
          },
        ],
        medals: ["medal1.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
            action: this.i18n.$t("dashboard_statistics_label_go1on1"),
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
            action: this.i18n.$t("dashboard_statistics_label_go1on1"),
          },
        ],
      },
    ];
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

    // handles "denial" of user authorization on the third-party platform
    if (this.$route.query && "error" in this.$route.query) {
      this.displayErrorMessage(
        `Please click "authorize" on the Strava authorization`
      );
    }

    // extracts "callback" parameters for when the user comes back
    // from the authorization process on the third-party platform
    const { state, code, scope } = this.$route.query;

    // if we come back to dashboard FROM the OAuth Authorization,
    // then we can now *query an access token* from the data provider
    // a redirection will happen after retrieval of the access token.
    if (state && code && scope) {
      this.$root.$emit("toast", {
        title: "Great job!",
        description: "We’ve integrated your account",
        state: "success",
        icon: "icons/like-icon.svg",
        dismissTimeout: 7000,
      });
      this.$store.commit("oauth/setParameters", { code, state, scope });
      await this.oauthCallbackRedirect();
      await this.$router.replace({ name: "app.dashboard" });
    }

    this.ref = "JOINFIT22";
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
  }

  /**
   * Method allows to copy refCode to user's clipboard
   *
   * @access public
   * @param evt: any
   * @param val: string
   * @returns {void}
   */
  copyToClipBoard(evt: any, val: string) {
    navigator.clipboard
      .writeText(val)
      .then(() => console.log("copied", this.ref));
  }
}
