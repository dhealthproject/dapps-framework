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
import "./Toast.scss";

export interface ToastConfig {
  title?: string;
  description?: string;
  state: "success" | "error";
  dismissTimeout?: number;
  icon?: string;
}

@Component({
  components: {
    InlineSvg,
  },
})
export default class Toast extends MetaView {
  @Prop({ default: "" }) readonly icon?: string;
  @Prop({ default: () => ({ dismissTimeout: 6000, state: "success" }) })
  readonly config?: any;

  mounted() {
    setTimeout(() => {
      this.$root.$emit("toast-close");
    }, this.config.dismissTimeout);
  }
}