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

@Component({
  components: { InlineSvg },
})
export default class ElevateLogo extends MetaView {
  @Prop({
    default: 0,
  })
  readonly width!: number;

  @Prop({
    default: "",
  })
  readonly theme: string | undefined;

  get fillColor(): string {
    return this.theme === "dark" ? "#000000" : "#ffffff";
  }
}
