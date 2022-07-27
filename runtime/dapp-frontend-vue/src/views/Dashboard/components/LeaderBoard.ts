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
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";

export interface BoardItem {
  avatar?: string;
  nickname: string;
  hash: string;
  amount: number;
  direction: "up" | "down" | "both";
  color?: string;
}

@Component({
  components: {
    DirectionTriangle,
  },
})
export default class LeaderBoard extends MetaView {
  @Prop({ default: () => [] }) readonly items?: BoardItem[];
}
