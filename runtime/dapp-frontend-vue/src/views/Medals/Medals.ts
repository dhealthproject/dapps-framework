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

// internal dependencies
import { MetaView } from "@/views/MetaView";
import RewardsList from "@/components/RewardsList/RewardsList.vue";
import { MedalItem } from "@/components/RewardsList/RewardsList";

// style resource
import "./Medals.scss";

/*
 * @class Medals
 * @description This class implements a Vue component to display
 * rewards page wit
 *
 * @since v0.3.0
 */
@Component({
  components: {
    RewardsList,
  },
})
export default class Medals extends MetaView {
  /**
   * This temporary computed returns hardcoded medals.
   * @todo remove after backend will be developed
   *
   * @access protected
   * @returns MedalItem[]
   */
  public get tempMedals(): MedalItem[] {
    return [
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/50.svg",
        condition: "Complete 50 kilometers to get.",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/100.svg",
        condition: "Complete one more workout to get.",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/100.svg",
        condition: "Complete one more workout to get.",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/50.svg",
        condition: "Complete 50 kilometers to get.",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
    ];
  }

  /**
   * This temporary computed returns hardcoded medals.
   * This copy includes disabled(not received) medals.
   * @todo remove after backend will be developed
   *
   * @access protected
   * @returns MedalItem[]
   */
  public get tempReferralMedals(): MedalItem[] {
    return [
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/50.svg",
        condition: "Complete 50 kilometers to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/100.svg",
        condition: "Complete one more workout to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/50.svg",
        condition: "Complete 50 kilometers to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/100.svg",
        condition: "Complete one more workout to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
      },
    ];
  }
}
