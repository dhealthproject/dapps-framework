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

// configuration
import packageConfig from "../package.json";

@Component({
  components: {
    Assembler,
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
   *
   */
  public created() {
    console.log("[App] route: ", this.$route);
  }
}
