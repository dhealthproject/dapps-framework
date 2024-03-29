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
import "./ProgressBar.scss";

@Component({})
export default class ProgressBar extends MetaView {
  /**
   * Prop that defines whole amount of items in progress bar
   *
   * @access public
   * @var {number}
   */
  @Prop({ default: 0 }) steps?: number;

  /**
   * Prop that defines amount of items that are completed
   *
   * @access public
   * @var {number}
   */
  @Prop({ default: 0 }) completedSteps?: number;

  /**
   * Prop that defines icon at the end of progress bar
   *
   * @access public
   * @var {string}
   */
  @Prop({ default: "" }) endIcon?: string;
}
