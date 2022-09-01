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

// configuration
import packageConfig from "../package.json";

@Component({
  components: {
    Assembler,
    Header,
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
   *
   */
  public created() {
    console.log("[App] route: ", this.$route);
    console.log("[App] store: ", this.$store);
  }
}
