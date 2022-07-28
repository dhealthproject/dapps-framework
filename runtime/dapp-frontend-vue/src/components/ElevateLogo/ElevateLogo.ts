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
  /**
   * Prop which defines width of the logo
   * defaults to 0
   *
   * @access readonly
   * @var {width}
   */
  @Prop({
    default: 0,
  })
  readonly width!: number;

  /**
   * Prop which defines color of the logo
   * available values: "dark"
   *
   * @access readonly
   * @var {theme}
   */
  @Prop({
    default: "",
  })
  readonly theme: string | undefined;

  /**
   * Computed which returns
   * color of the logo based on "theme"
   * prop value
   *
   * available vales: "#000000" | "#ffffff"
   *
   * @returns {string}
   */
  get fillColor(): string {
    return this.theme === "dark" ? "#000000" : "#ffffff";
  }
}
