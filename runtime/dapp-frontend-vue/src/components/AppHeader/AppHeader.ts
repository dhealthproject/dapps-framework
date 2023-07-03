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
import { Component, Prop, Watch } from "vue-property-decorator";
import InlineSvg from "vue-inline-svg";
import { mapGetters } from "vuex";

// internal dependencies
import { MetaView } from "@/views/MetaView";

// child components
import ElevateLogo from "../ElevateLogo/ElevateLogo.vue";
import MobileNavigationButton from "../MobileNavigationButton/MobileNavigationButton.vue";
import Dropdown from "../Dropdown/Dropdown.vue";
import UserBalance from "../UserBalance/UserBalance.vue";
import UiButton from "../UiButton/UiButton.vue";

// style resource
import "./AppHeader.scss";

export interface HeaderLink {
  path: string;
  text: string;
  icon: string;
}

@Component({
  components: {
    ElevateLogo,
    InlineSvg,
    MobileNavigationButton,
    Dropdown,
    UserBalance,
    UiButton,
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
  },
})
export default class AppHeader extends MetaView {
  /**
   * Prop which defines list of links available in header. If the list
   * is empty, the header will be displayed without menu links.
   *
   * @access protected
   * @var {HeaderLink[]}
   */
  @Prop({ default: () => [] }) protected links?: HeaderLink[];

  /**
   * Prop which defines if icons(left from menu text) should be shown or not
   *
   * @access protected
   * @var {showIcons}
   */
  @Prop({ default: true }) protected showIcons?: boolean;

  /**
   * @todo ask the user for confirmation
   */
  protected async disconnectWallet() {
    // update application state
    await this.$store.dispatch("auth/logoutProfile");

    // redirect to login
    return this.$router.push({ name: "app.login" });
  }

  protected closeMenu() {
    this.isMenuOpen = false;
  }

  shareModal() {
    // display a custom modal popup
    this.$root.$emit("modal", {
      type: "share",
      overlayColor: "rgba(0, 0, 0, .50)",
      width: 518,
      modalBg: "#FFFFFF",
    });
  }

  /**
   * This property contains the *authentication state* as it
   * is requested from the backend API. This property will be
   * set to `true` given a valid and non-expired *access token*
   * is available.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {boolean}
   */
  public isAuthenticated!: boolean;

  /* Data prop that defines state of mobile menu
   *
   * @access protected
   * @var {showIcons}
   */
  isMenuOpen = false;

  /**
   * Computed that shows if slot is populated
   *
   * @access public
   */
  get hasBackButton(): boolean {
    return !!this.$slots["back-button"];
  }

  /**
   * Computed that defines items for dropwdown,
   * used in :items prop
   *
   * @access public
   */
  get dropDownItems() {
    return [
      {
        text: this.$t("common.activities"),
        action: () => this.$router.push({ name: "app.activities" }),
        icon: "icons/Activity-icon-header.svg",
      },
      {
        text: this.$t("common.dropdown_refer_earn"),
        action: () => this.$router.push({ name: "app.dashboard" }),
        icon: "icons/refer-earn.svg",
      },
      {
        text: this.$t("common.disconnect_wallet"),
        action: () => this.disconnectWallet(),
        icon: "icons/logout.svg",
        isRed: true,
      },
    ];
  }

  /**
   * Watcher that sets overflowY hidden,
   * to prevent scrolling of body when mobile menu opened
   *
   * @access public
   */
  @Watch("isMenuOpen")
  onMenuChanged(newValue: boolean) {
    const body = document.getElementsByTagName("body")[0];
    if (newValue) {
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "initial";
    }
  }

  @Watch("$route.name")
  onRouteChange(newRoute: string, oldRoute: string) {
    if (newRoute !== oldRoute) {
      this.isMenuOpen = false;
    }
  }
}
