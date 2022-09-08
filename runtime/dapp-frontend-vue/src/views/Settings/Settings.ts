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

import "./Settings.scss";

@Component({})
export default class Settings extends MetaView {
  public storedIntegrations: any = [];

  mounted() {
    this.storedIntegrations = JSON.parse(localStorage.getItem("integrations")!);
  }

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

  removeIntegration() {
    localStorage.removeItem("integrations");
    this.storedIntegrations = [];
  }
}
