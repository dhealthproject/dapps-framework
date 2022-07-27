/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

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
import { Component, Prop } from "vue-property-decorator";

// internal dependencies
import { MetaView } from "@/views/MetaView";

@Component({})
export default class Tabs extends MetaView {
  @Prop({ default: () => [] }) readonly tabList?: [];

  @Prop({}) readonly initialTab?: number;

  selectedTab = 0;

  get tabNames() {
    return this.tabList?.map((tabItem: any) => tabItem.title);
  }

  mounted() {
    if (this.initialTab) {
      this.selectedTab = this.initialTab;
    }
  }
}
