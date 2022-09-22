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
import UiButton from "@/components/UiButton/UiButton.vue";

import "./Settings.scss";

@Component({
  components: {
    UiButton,
  },
  computed: {
    ...mapGetters({
      getIntegrations: "integrations/getIntegrations",
    }),
  },
})
export default class Settings extends MetaView {
  /**
   * This property contains Vuex Getter,
   * Store field gets populated on Dashboard mounted() hook or from localstorage directly
   *
   * @var {any}
   */
  public getIntegrations: any;

  /**
   * This computed returns available integrations, currently available ony strava
   *
   * @access public
   */
  get integrationsList() {
    return [
      {
        id: "strava",
        title: "Strava",
        description: "Quick description of strava",
        icon: "strava.png",
      },
    ];
  }

  /**
   * This method triggers Store acion which clears integrations state field and recets it payload(currently []), clears localStorage
   *
   * @access public
   * @return void
   */
  removeIntegration() {
    localStorage.removeItem("integrations");
    this.$store.commit("integrations/assignIntegrations", []);
  }
}
