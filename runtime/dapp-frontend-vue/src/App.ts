/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { Component } from "vue-property-decorator";

// internal dependencies
import { MetaView } from "@/views/MetaView";

// child components
import Assembler from "@/views/Assembler/Assembler.vue";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import Loader from "@/components/Loader/Loader.vue";
import UiPopup from "./components/UiPopup/UiPopup.vue";

// style resource
import "./App.scss";

// configuration
import packageConfig from "../package.json";

@Component({
  components: {
    Assembler,
    Header,
    Footer,
    Loader,
    UiPopup,
  },
})
export default class App extends MetaView {
  /**
   * The current frontend software version.
   *
   * @access protected
   * @var {string}
   */
  protected version: string = packageConfig.version;

  /**
   * Demo list of links for header, for authenticated user
   *
   * @protected {headerLinks}
   * @access protected
   */
  protected get headerLinks() {
    return [
      { path: "#", text: "Home", icon: "icons/Home.svg" },
      { path: "#1", text: "Fitness", icon: "icons/Running.svg" },
      { path: "#2", text: "Mindfulness", icon: "icons/Yoga.svg" },
      { path: "#3", text: "Wellness", icon: "icons/Apple.svg" },
    ];
  }

  /**
   * State of the modal
   * get's changed only in showModal() || hideModal()
   *
   * @protected {modalShown}
   * @access protected
   */
  protected modalShown = false;

  /**
   * Popup configurations,
   * getting set once "modal" event getting triggered
   * recets to {} on "modal-close" evt
   *
   * @protected {modalConfig}
   * @access protected
   */
  protected modalConfig: any = {};

  /**
   *
   */
  protected get emptyFooterLinks() {
    return [
      { path: "terms-and-conditions", text: "Terms & Conditions" },
      { path: "privacy-policy", text: "Privacy Policy" },
    ];
  }

  /**
   *
   */
  public async created() {
    console.log("[App] route: ", this.$route);
    console.log("[App] store: ", this.$store);
    console.log("[App] BACKEND_URL: ", process.env.VUE_APP_BACKEND_URL);
    this.$root.$on("modal", this.showModal);
    this.$root.$on("modal-close", this.hideModal);
  }

  showModal(modalConfig: any) {
    this.modalShown = true;
    this.modalConfig = modalConfig;
    console.log("MODAL CALLED", modalConfig);
  }

  hideModal() {
    this.modalShown = false;
    this.modalConfig = {};
    console.log("MODAL HIDDEN");
  }

  beforeDestoyed() {
    this.$root.$off("modal", this.showModal);
    this.$root.$off("modal-close", this.hideModal);
  }
}
