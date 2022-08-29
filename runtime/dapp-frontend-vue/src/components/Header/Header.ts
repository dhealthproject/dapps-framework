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
import { DappButton } from "@dhealth/components";

// internal dependencies
import { MetaView } from "@/views/MetaView";

// child components
import ElevateLogo from "../ElevateLogo/ElevateLogo.vue";
import HamburgerButton from "../HamburgerButton/HamburgerButton.vue";

// style resource
import "./Header.scss";
import Cookies from "js-cookie";

export interface HeaderLink {
  path: string;
  text: string;
  icon: string;
}

@Component({
  components: {
    ElevateLogo,
    InlineSvg,
    DappButton,
    HamburgerButton,
  },
})
export default class Header extends MetaView {
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

  get isAuthenticated(): boolean {
    const token = Cookies.get("accessToken");
    return !!token;
  }

  @Watch("isMenuOpen")
  onMenuChanged(newValue: boolean) {
    const body = document.getElementsByTagName("body")[0];
    if (newValue) {
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "initial";
    }
  }
}
