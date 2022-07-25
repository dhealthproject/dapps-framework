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
import InlineSvg from "vue-inline-svg";
// internal dependencies
import { MetaView } from "@/views/MetaView";
import ElevateLogo from "../ElevateLogo/ElevateLogo.vue";
import { DappButton } from "@dhealth/components";

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
  },
})
export default class Header extends MetaView {
  @Prop({ default: () => [], required: true }) protected links?: HeaderLink[];
  @Prop({ default: true }) protected showIcons?: boolean;
}
