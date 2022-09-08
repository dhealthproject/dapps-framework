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
import "./Snackbar.scss";

@Component({
  components: {
    InlineSvg,
  },
})
export default class Snackbar extends MetaView {
  @Prop({ default: "" }) readonly icon?: string;
  @Prop({ required: true }) readonly title?: string;
  @Prop({ required: true }) readonly description?: string;
  @Prop({ default: "success" }) readonly state?: "success" | "error";
}
