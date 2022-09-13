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

// style resource
import "./DividedScreen.scss";

/**
 *
 */
@Component({})
export default class DividedScreen extends MetaView {
  /**
   * Defines gap, in pixels, between screens. This property
   * defaults to `20`.
   *
   * @access protected
   * @var {number}
   */
  @Prop({ default: 20, required: false }) protected gap?: number;

  /**
   * Defines size of left part, accepts number and string,
   * if provided number - width will be set with %
   * in case of passing string value should be valid css value
   *
   * usage example:
   * `left-size="20px"` |
   * `left-size="30vh"`
   *
   * @access protected
   * @var {number}
   */
  @Prop({ default: 50 }) protected leftSize?: string | number;

  /**
   * Defines size of right part, accepts number and string,
   * if provided number - width will be set with %
   * in case of passing string value should be valid css value
   *
   * usage example:
   * `right-size="768px"` |
   * `right-size="20ww"`
   *
   * @access protected
   * @var {number}
   */
  @Prop({ default: 50 }) protected rightSize?: string | number;

  get columnsSize() {
    return {
      left:
        typeof this.leftSize === "number" ? this.leftSize + "%" : this.leftSize,
      right:
        typeof this.rightSize === "number"
          ? this.rightSize + "%"
          : this.rightSize,
    };
  }
}
