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
import "./Dropdown.scss";

@Component({
  data: () => ({
    isOpen: false,
  }),
})
export default class Dropdown extends MetaView {
  /**
   * Defines menu items that going to be displayed on click
   *
   * @access public
   * @var {items}
   */
  @Prop({ default: () => [] }) items?: any[];

  /**
   * Defines state if current dropdown open
   *
   * @access public
   * @var {isOpen}
   */
  public isOpen = false;

  /**
   * Method that calls action passed in item,
   * closes dropdown
   *
   * @access public
   */
  public handleItemClick(event: any, itemAction: any) {
    this.isOpen = false;
    itemAction();
  }
}
