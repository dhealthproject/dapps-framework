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
  @Prop({
    default: "",
  })
  to?: string | object;

  @Prop({
    default: false,
  })
  disabled?: boolean;

  @Prop({
    default: false,
  })
  accent?: boolean;

  @Prop({
    default: "",
  })
  type?: "no-borders";

  onClick() {
    this.$emit("uiButton-click");
  }
}
