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

// style resource
import "./InfoTip.scss";

@Component({
  components: { InlineSvg },
})
export default class InfoTip extends MetaView {
  /**
   * Prop that defines path to the icon that will be displayed,
   * defaults to icons/info-tip.svg
   *
   * @access readonly
   * @var {string}
   */
  @Prop({ default: "icons/info-tip.svg" }) readonly icon?: string;

  /**
   * Prop that defines size of displayed info icon, defaults to 16
   *
   * @access readonly
   * @var {number}
   */
  @Prop({ default: 16 }) readonly iconWidth?: number;

  /**
   * Prop that defines title inside of tooltip, if passed "" title wont be shown
   *
   * @access readonly
   * @var {string}
   */
  @Prop({ default: "" }) readonly title?: string;

  /**
   * Prop that defines text inside of tooltip, if passed "" wont be shown
   *
   * @access readonly
   * @var {string}
   */
  @Prop({ default: "" }) readonly text?: string;

  tipPosition = "";

  tooltipPosition() {
    const el = document.getElementById("tooltip");
    if (el) {
      const rect = el.getBoundingClientRect();

      const left = rect.left + window.scrollX;
      const right = rect.right + window.scrollX;
      console.log({ l: rect.left });

      if (left > el.offsetWidth) {
        this.tipPosition = "right";
        console.log("right");
      } else {
        this.tipPosition = "left";
        console.log("left");
      }
    }
  }
}
