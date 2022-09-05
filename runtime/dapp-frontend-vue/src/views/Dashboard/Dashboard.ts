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
import { DappButton } from "@dhealth/components";

// child components
import Card from "@/components/Card/Card.vue";
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";
import { CarouselItem, CarouselConfig } from "./components/EventsCarousel";
import EventsCarousel from "./components/EventsCarousel.vue";
import { BoardItem } from "./components/LeaderBoard";
import LeaderBoard from "./components/LeaderBoard.vue";
import Tabs from "@/components/Tabs/Tabs.vue";
import GenericList from "@/components/GenericList/GenericList.vue";

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
  },
  computed: {
    ...mapGetters({
      currentUserAddress: "auth/getCurrentUserAddress",
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
   * Computed which defines configuration
   * for vueper carousel
   *
   * @returns {CarouselConfig}
   */
  get sliderConfig(): CarouselConfig {
    return {
      arrows: false,
      bullets: false,
      itemsHeight: "203px",
      visibleSlides: 2.2,
      gap: 4,
    };
  }

  /**
   * Media queried slider configuration
   *
   * @returns {any}
   */
  get sliderBreakPoints(): any {
    return {
      768: {
        visibleSlides: 1,
      },
    };
  }

  /**
   * Computed which defines list of carousel items
   *
   * @returns {CarouselItem[]}
   */
  get carouselItems(): CarouselItem[] {
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
   * Computed which defines list of users in leaderboard table
   *
   * @returns {BoardItem[]}
   */
  get boardItems(): BoardItem[] {
    return [
      {
        avatar: "avatar1.png",
        nickname: "Yoga Master",
        hash: "2994-2399-WGHD-WDHF",
        amount: 698,
        direction: "up",
      },
      {
        avatar: "avatar2.png",
        nickname: "Terminator",
        hash: "2994-2399-WGHD-WDHF",
        amount: 330,
        direction: "up",
      },
      {
        color: "#A990E0",
        nickname: "Purple Master",
        hash: "2994-2399-WGHD-WDHF",
        amount: 330,
        direction: "down",
      },
      {
        avatar: "avatar2.png",
        nickname: "Terminator",
        hash: "2994-2399-WGHD-WDHF",
        amount: 330,
        direction: "down",
      },
      {
        color: "#A990E0",
        nickname: "Purple Master",
        hash: "2994-2399-WGHD-WDHF",
        amount: 330,
        direction: "both",
      },
    ];
  }

  /**
   * Computed which defines
   * list of tabs and structure inside of them
   *
   * @returns {BoardItem[]}
   */
  get tabs() {
    return [
      {
        title: "All time",
        quickStats: [
          {
            title: "Minutes Exercised",
            amount: 3099,
            direction: "up",
          },
          {
            title: "$FIT earned",
            amount: 560,
            direction: "down",
          },
          {
            title: "Calories Burnt",
            amount: 1094,
            direction: "down",
          },
          {
            title: "Friends Referred",
            amount: 5,
            direction: "down",
          },
        ],
        medals: ["medal1.svg", "medal2.svg", "medal3.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
            cta: "Go 1-on-1",
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
            cta: "Go 1-on-1",
          },
        ],
      },
      {
        title: "Today",
        quickStats: [
          {
            title: "Minutes Exercised",
            amount: 520,
            direction: "down",
          },
          {
            title: "$FIT earned",
            amount: 350,
            direction: "down",
          },
          {
            title: "Calories Burnt",
            amount: 2035,
            direction: "up",
          },
          {
            title: "Friends Referred",
            amount: 5,
            direction: "down",
          },
        ],
        medals: ["medal1.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
          },
        ],
      },
    ];
  }

  /**
   *
   */
  protected async mounted() {
    // in case we came here from log-in screen, we may
    // not have a profile in the Vuex Store yet, fill now.
    if (!this.currentUserAddress) {
      await this.$store.dispatch("auth/fetchProfile");
    }

    console.log("[Dashboard] User: ", this.currentUserAddress);
  }
}
