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
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";
import NavPanel from "@/components/NavPanel/NavPanel.vue";
import ElevateLogo from "@/components/ElevateLogo/ElevateLogo.vue";
import UiButton from "@/components/UiButton/UiButton.vue";

// style resource
import "./OnboardingScreen.scss";

/*
 * @class UiButton
 * @description This class implements a Vue component to display
 * OnboardingScreen
 *
 * @since v0.3.0
 */
@Component({
  components: { DividedScreen, NavPanel, ElevateLogo, UiButton },
  methods: {
    handleStep: () => ({}),
    handleBack: () => ({}),
    skipOnboarding: () => ({}),
  },
  computed: {
    ...mapGetters({
      refCode: "auth/getRefCode",
    }),
    tutorialItems: () => ({}),
  },
})
export default class OnboardingScreen extends MetaView {
  /**
   * This propery used for displaing
   * currently selected screen
   *
   * @var {number}
   * @access public
   */
  public currentScreen = 0;

  /**
   * This property contains the value as set in the store under
   * `auth/userRefCode`.
   * <br /><br />
   * The *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string}
   */
  public refCode!: string;

  /**
   * Returns all available configurations of the screns
   *
   * @access public
   */
  public get carouselItems() {
    return [
      {
        id: "screen_1",
        title: "Burn calories with your activity and Earn crypto.",
        text: "Integrate your fitness apps & wearables to start earning crypto.",
        button: "Get Started",
        image: "login-slides/slide-1.jpg",
        mobileGradient:
          "linear-gradient(180deg, #000000 -5.38%, rgba(44, 63, 81, 0) 27.55%, #395E81 66.26%, #1F94A4 100%);",
      },
      {
        id: "screen_2",
        title: "Participate in virtual challenges, globally.",
        text: "Join  Challenges and Events to earn tokens with others around the world.",
        button: "Next",
        image: "login-slides/slide-2.jpg",
        mobileGradient:
          "linear-gradient(180deg, #000000 -5.38%, rgba(44, 63, 81, 0) 27.55%, #5D3981 63.28%, #391FA4 100%)",
      },
      {
        id: "screen_3",
        title: "Earn NFT Rewards depending on how well you perform.",
        text: "Earn unique NFT Medals & Sportscards that unlock special virtual events",
        button: "Connect your Wallet",
        image: "login-slides/slide-2.jpg",
        mobileGradient:
          "linear-gradient(180deg, #000000 -5.38%, rgba(44, 63, 81, 0) 27.55%, #398149 63.28%, #81A41F 100%)",
      },
    ];
  }

  /**
   * Returns configuration of currently available string
   *
   * @access public
   */
  public get currentItem() {
    return this.carouselItems[this.currentScreen];
  }

  handleStep() {
    if (this.currentScreen >= this.carouselItems.length - 1) {
      this.skipOnboarding();
    } else {
      this.currentScreen += 1;
    }
  }

  /**
   * Decrements value of currently seelcted screen
   *
   * @returns void
   * @access public
   */
  handleBack() {
    this.currentScreen -= 1;
  }

  /**
   * Pushes user to next route after onboarding
   *
   * @returns void
   * @access public
   */
  skipOnboarding() {
    this.$router.push({ name: "legal.terms-and-conditions" });
  }

  /**
   * Opens referral pop-up with specific configration
   *
   * @returns void
   * @access public
   */
  public handleReferral() {
    this.$root.$emit("modal", {
      overlayColor: "rgba(19, 30, 25, 0.7)",
      type: "form",
      title: "Please enter your referral code below",
      modalBg:
        "linear-gradient(122.29deg, #0E0838 0%, #3B2660 45.62%, #8F6F5D 204.42%)",
      width: 327,
      fields: [
        {
          type: "text",
          placeholder: "1988832",
          name: "refCode",
        },
      ],
      submitCallback: async (values: any) => {
        if (values !== undefined && "refCode" in values) {
          await this.$store.commit("auth/setRefCode", values.refCode);
        }

        this.$root.$emit("modal-close");
      },
    });
  }

  /**
   * Runs when component is getting mounted,
   * reads, sets refCode
   *
   * @returns void
   * @access public
   */
  public async mounted() {
    if (this.$route.params.refCode) {
      await this.$store.commit("auth/setRefCode", this.$route.params.refCode);
    }
  }

  /**
   * Runs when route is getting left and component getting destroyed,
   * resets current screen
   *
   * @returns void
   * @access public
   */
  beforeDestroy() {
    this.currentScreen = 0;
  }
}
