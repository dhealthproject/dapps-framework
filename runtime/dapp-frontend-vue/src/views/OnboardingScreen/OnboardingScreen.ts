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
    return this.$t("onboarding_screen.carousel");
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
      title: this.$t("onboarding_screen.modal.referral_title"),
      modalBg:
        "linear-gradient(122.29deg, #0E0838 0%, #3B2660 45.62%, #8F6F5D 204.42%)",
      width: 327,
      fields: [
        {
          type: "text",
          placeholder: this.$t("onboarding_screen.modal.placeholder"),
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
