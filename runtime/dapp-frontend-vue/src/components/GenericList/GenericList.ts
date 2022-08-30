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
import { DappButton } from "@dhealth/components";

@Component({
  components: {
    DappButton,
  },
})
export default class GenericList extends MetaView {
  /**
   * Prop which defines list of items in list
   *
   * @access readonly
   * @var {items}
   */
  @Prop({ default: () => [] }) readonly items?: any[];

  /**
   * Prop which defines title of the list
   *
   * @access readonly
   * @var {title}
   */
  @Prop({ default: () => [] }) readonly title?: string;

  /**
   * Computed that checks if custom slot available
   *
   * @access public
   * returns {boolean}
   */
  get hasCustomSlot() {
    return !!this.$scopedSlots.itemContent || !!this.$slots.itemContent;
  }
}
