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
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";
import NavPanel from "@/components/NavPanel/NavPanel.vue";
import ElevateLogo from "@/components/ElevateLogo/ElevateLogo.vue";
import UiButton from "@/components/UiButton/UiButton.vue";

// style resource
import "./OnboardingScreen.scss";

@Component({
  components: { DividedScreen, NavPanel, ElevateLogo, UiButton },
  methods: {
    handleStep: () => ({}),
    handleBack: () => ({}),
    skipOnboarding: () => ({}),
  },
})
export default class OnboardingScreen extends MetaView {
  currentScreen = 0;

  get carouselItems() {
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

  get currentItem() {
    return this.carouselItems[this.currentScreen];
  }

  handleStep() {
    if (this.currentScreen >= this.carouselItems.length - 1) {
      this.skipOnboarding();
    } else {
      this.currentScreen += 1;
    }
  }

  handleBack() {
    this.currentScreen -= 1;
  }

  skipOnboarding() {
    this.$router.push({ name: "legal.terms-and-conditions" });
  }

  beforeDestroyed() {
    this.currentScreen = 0;
  }
}
