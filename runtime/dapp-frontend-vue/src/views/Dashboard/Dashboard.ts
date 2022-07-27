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
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
import InlineSvg from "vue-inline-svg";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import { DappButton } from "@dhealth/components";
import Header from "@/components/Header/Header.vue";
import Card from "@/components/Card/Card.vue";
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";

// eslint-disable-next-line prettier/prettier
export interface CarouselItem {
  background: string;
  header?: {
    icon: string;
    text: string;
  };
  footer: {
    title: string;
    participants: number | string;
  };
}

@Component({
  components: {
    Header,
    Card,
    DividedScreen,
    DappButton,
    InlineSvg,
    VueperSlides,
    VueperSlide,
    DirectionTriangle,
  },
})
export default class Dasboard extends MetaView {
  selectedTab = 0;

  get carouselItems(): CarouselItem[] {
    return [
      {
        background:
          "url('../../assets/footbalbg.jpg'), linear-gradient(360deg, rgba(32, 89, 234, 0.7) 0%, rgba(32, 94, 255, 0) 106.16%)",
        footer: {
          title: "24/7 HIIT",
          participants: "29,988",
        },
      },
      {
        header: {
          icon: "provided.svg",
          text: "Powered by lululemon®",
        },
        background:
          "url('../../assets/runningbg.jpg'), linear-gradient(0deg, rgba(0, 117, 89, 0.6) 7.64%, rgba(9, 129, 107, 0) 119.21%)",
        footer: {
          title: "Yoga Mind",
          participants: "10,102",
        },
      },
      {
        background:
          "url('../../assets/footbalbg.jpg'), linear-gradient(360deg, rgba(32, 89, 234, 0.7) 0%, rgba(32, 94, 255, 0) 106.16%)",
        footer: {
          title: "24/7 HIIT",
          participants: "29,988",
        },
      },
    ];
  }

  get boardItems() {
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

  get tabs() {
    return ["All time", "Today"];
  }

  get quickStats() {
    return [
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
    ];
  }
}
