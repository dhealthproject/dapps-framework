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
import "./TopActivities.scss";

@Component({})
export default class TopActivities extends MetaView {
  /**
   * Top activities list
   *
   * @access readonly
   * @var {items}
   */
  @Prop({ default: () => [], required: true }) readonly items?: string[];
}