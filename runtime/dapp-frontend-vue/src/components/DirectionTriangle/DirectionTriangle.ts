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
export default class DirectionTriangle extends MetaView {
  /**
   * Prop which defines direction & color of triangle
   * defaults to "up"
   *
   * allowed values: "up" | "down" | "both"
   *
   * @access readonly
   * @var {direction}
   */
  @Prop({ default: "up" }) readonly direction?: "up" | "down" | "both";
}
