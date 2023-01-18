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
import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters({
      currentUserAddress: "auth/getCurrentUserAddress",
    }),
  },
})
export default class Medals extends MetaView {
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
   * This temporary computed returns hardcoded medals.
   * This copy includes disabled(not received) medals.
   * @todo remove after backend will be developed
   *
   * @access protected
   * @returns MedalItem[]
   */
  public get knownMedals(): MedalItem[] {
    return [
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: true,
        relatedActivities: "Running, Walking, Swimming, Cycling",
        assetId: process.env.VUE_APP_ASSETS_BOOST5_IDENTIFIER as string,
      },
      {
        image: "medals/50.svg",
        condition: "Complete 50 kilometers to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
        assetId: process.env.VUE_APP_ASSETS_BOOST10_IDENTIFIER as string,
      },
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
        assetId: process.env.VUE_APP_ASSETS_BOOST15_IDENTIFIER as string,
      },
      {
        image: "medals/100.svg",
        condition: "Complete one more workout to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
        assetId: "fakeIdToShowNotReceivedMedals1",
      },
      {
        image: "medals/50.svg",
        condition: "Complete 50 kilometers to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
        assetId: "fakeIdToShowNotReceivedMedals2",
      },
      {
        image: "medals/100.svg",
        condition: "Complete one more workout to get.",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
        assetId: "fakeIdToShowNotReceivedMedals3",
      },
      {
        image: "medals/10.svg",
        condition: "Finish your first 10KM in one go to get!",
        received: false,
        relatedActivities: "Running, Walking, Swimming, Cycling",
        assetId: "fakeIdToShowNotReceivedMedals4",
      },
    ];
  }

  public async mounted() {
    await this.$store.dispatch("assets/fetchRewards", this.currentUserAddress);
  }
}
