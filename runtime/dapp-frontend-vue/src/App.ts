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
import Toast from "./components/Toast/Toast.vue";

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
    Toast,
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
      {
        path: { name: "app.dashboard" },
        text: "Dashboard",
        icon: "icons/menu-dashboard.svg",
      },
      { path: "#1", text: "Rewards", icon: "icons/menu-rewards.svg" },
      {
        path: { name: "app.settings" },
        text: "Settings",
        icon: "icons/menu-settings.svg",
      },
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
   * State of the toast notification
   * get's changed only in showToast() || hideToast()
   *
   * @protected {toastShown}
   * @access protected
   */
  protected toastShown = false;

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
   * Toast configurations,
   * getting set once "toast" event getting triggered
   * recets to {} on "toast-close" evt
   *
   * @protected {modalConfig}
   * @access protected
   */
  protected toastConfig: any = {};

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
   * Runs when component being created,
   * enables event listeners for showing/hiding of pop-up
   *
   * @returns void
   * @access public
   */
  public async created() {
    console.log("[App] route: ", this.$route);
    console.log("[App] store: ", this.$store);
    console.log("[App] BACKEND_URL: ", process.env.VUE_APP_BACKEND_URL);
    this.$root.$on("modal", this.showModal);
    this.$root.$on("modal-close", this.hideModal);

    this.$root.$on("toast", this.showToast);
    this.$root.$on("toast-close", this.hideToast);
  }

  /**
   * Being called on @modal event, displays popup with provided configuration
   *
   * @returns void
   * @access public
   * @param modalConfig: any
   */
  showModal(modalConfig: any) {
    this.modalShown = true;
    this.modalConfig = modalConfig;
    console.log("MODAL CALLED", modalConfig);
  }

  /**
   * Being called on @toast event, displays toast with provided configuration
   *
   * @returns void
   * @access public
   * @param toastConfig: any
   */
  showToast(toastConfig: any) {
    this.toastShown = true;
    this.toastConfig = toastConfig;
    console.log("TOAST CALLED", toastConfig);
  }

  /**
   * Being called on @modal-close event, hides popup
   *
   * @returns void
   * @access public
   */
  hideModal() {
    this.modalShown = false;
    this.modalConfig = {};
    console.log("MODAL HIDDEN");
  }

  /**
   * Being called on @toast-close event, hides popup
   *
   * @returns void
   * @access public
   */
  hideToast() {
    this.toastShown = false;
    this.toastConfig = {};
    console.log("TOAST HIDDEN");
  }

  /**
   * Runs when component being destroyed,
   * disables event listeners for showing/hiding popup
   *
   * @returns void
   * @access public
   */
  beforeDestoyed() {
    this.$root.$off("modal", this.showModal);
    this.$root.$off("modal-close", this.hideModal);
  }
}
