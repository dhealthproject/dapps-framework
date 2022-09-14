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
import UiButton from "../UiButton/UiButton.vue";

// modal config
export interface ModalConfig {
  keepOnBgClick?: boolean;
  overlayColor?: string;
  modalBg?: string;
  type: "form" | "notification";
  title?: string;
  width: number;
  fields?: any[];
  submitCallback?: any;
  description?: string;
  illustration?: string;
}

// styles source
import "./UiPopup.scss";

@Component({
  components: { InlineSvg, UiButton },
})
export default class UiPopup extends MetaView {
  @Prop({ default: false }) shown?: boolean;
  /*
    @Todo: specify interface for config
  */
  @Prop({ default: () => ({}) }) config?: ModalConfig;

  protected handleBgClick() {
    if (!this.config?.keepOnBgClick) {
      this.$root.$emit("modal-close");
    }
  }

  protected handleFormSubmission() {
    const formValues: any = {};

    const inputs = Array.from(document.getElementsByClassName("dynamic-input"));

    inputs.forEach((input) => {
      const inputName = input.getAttribute("name");

      if (inputName) {
        formValues[inputName] = (<HTMLInputElement>input).value;
      }
    });

    if (this.config && this.config.submitCallback) {
      this.config.submitCallback(formValues);
    }
  }
}
