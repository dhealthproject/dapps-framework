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

// styles source
import "./UiButton.scss";

/*
 * @class UiButton
 * @description This class implements a Vue component to display
 * a cta button. This component is wrapper for <DappButton />
 *
 * @since v0.3.0
 */
@Component({
  components: { DappButton },
  props: {
    to: {
      type: [String, Object],
      default: "",
    },
  },
  methods: {
    onClick: () => ({}),
  },
})
export default class UiButton extends MetaView {
  /**
   * This propery used for the setting URL to button.
   * Usage example: `<UiButton :to='{name: "onboarding"}' />` -> button will be a link that leads to Onboarding Page
   *
   * @var {string | object}
   */
  @Prop({
    default: "",
  })
  to?: string | object;

  /**
   * This propery used for the setting disabled state and disabled styles to the button
   *
   * @var {boolean}
   */
  @Prop({
    default: false,
  })
  disabled?: boolean;

  /**
   * This propery used for the setting accent styles for button
   *
   * @var {boolean}
   */
  @Prop({
    default: false,
  })
  accent?: boolean;

  /**
   * This propery used for the setting type of the button
   *
   * @var {boolean}
   */
  @Prop({
    default: "",
  })
  type?: "no-borders";

  /**
   * This methods used for an emitting click above
   *
   * @access public
   * @returns {void}
   */
  public onClick() {
    this.$emit("click");
  }
}
