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
import DappSelect from "@/components/DappSelect/DappSelect.vue";

@Component({
  components: {
    DappSelect,
  },
})
export default class Activities extends MetaView {
  public get balance() {
    // temporary use hardcoded value
    return `${this.formatAmount(31392355)} $FIT`;
  }

  public get dhpAmount() {
    return `≈${this.formatAmount(31392355)} DHP`;
  }

  public get activitiesTableTitles() {
    return this.$t("activities.table_titles");
  }

  public get mockedItems() {
    return [
      {
        type: "activity",
        activityType: "Ride",
        time: "01:47:41",
        distance: 16.64,
        gain: 74,
        pace: 6.28,
        fit: 0.15,
      },
      {
        type: "activity",
        activityType: "Swim",
        time: "00:20:41",
        distance: 5.14,
        gain: 20,
        pace: 1.28,
        fit: 0.015,
      },
      {
        type: "activity",
        activityType: "Walk",
        time: "03:05:20",
        distance: 52.14,
        gain: 8,
        pace: 30.28,
        fit: 20.02,
      },
    ];
  }

  public get mockedSportTypes() {
    return [
      {
        label: "Walk",
        value: "walk",
      },
      {
        label: "Ride",
        value: "ride",
      },
      {
        label: "Swim",
        value: "swim",
      },
    ];
  }
}
