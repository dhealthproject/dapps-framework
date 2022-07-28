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
export default class Card extends MetaView {
  /**
   * Title displayed on top of the card,
   * defaults to ""
   *
   * @access readonly
   * @var {title}
   */
  @Prop({ default: "" }) readonly title?: string;
}
