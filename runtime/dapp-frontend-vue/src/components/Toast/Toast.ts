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
  /**
   * Prop that defines configuration of toast,
   * example of usage: <br/><br/>
   * `
   * {
    * title: "Success";
    description: "Your action was completed successfully";
    state: "success";
    dismissTimeout: 10000;
    icon: "icons/example.svg";
    * }`
   *
   * @access public
   * @var {ToastConfig}
   */
  @Prop({ default: () => ({ dismissTimeout: 6000, state: "success" }) })
  readonly config?: any;

  mounted() {
    /* Dismiss timeout after dismissTimeout passes, initially 6s */
    setTimeout(() => {
      this.$root.$emit("toast-close");
    }, this.config.dismissTimeout);
  }
}
