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
      getIntegrations: "oauth/getIntegrations",
    }),
  },
})
export default class Settings extends MetaView {
  /**
   * This property contains the list of integrations for current user.
   * This field is populated using the Vuex Store after a successful
   * setup of the oauth module.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string[]}
   */
  public getIntegrations!: string[];

  /**
   * This computed property defines a list of *integrated* OAuth providers.
   *
   * @deprecated This method must be deprecated in favor of an actual OAuth
   * integrations discovery implementation using the backend runtime.
   *
   * @access protected
   * @returns {any}
   */
  protected get integrationsList() {
    // translate the description
    const description: string = this.$t(
      "settings.integrations_description_strava"
    );

    return [
      {
        id: "strava",
        title: "Strava",
        description: description,
        icon: "strava.png",
      },
    ];
  }

  /**
   * This component method removes an integration from the currently
   * active user's OAuth providers list in Vuex Store.
   *
   * @access protected
   * @returns {any}
   */
  protected removeIntegration(provider: string) {
    this.$store.dispatch("oauth/deauthorize", provider);
  }
}
