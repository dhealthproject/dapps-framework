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

export interface SelectItem {
  text: string;
  value: string | number;
  disabled?: boolean;
}

@Component({})
export default class DappSelect extends MetaView {
  @Prop({ default: () => [] }) items?: SelectItem[];

  @Prop({ default: "list" }) type?: "list" | "date";

  @Prop({ default: "" }) className?: string;

  @Prop({ default: "" }) inputId?: string;

  @Prop({ default: "" }) placeholder?: string;

  @Prop({ default: "" }) icon?: string;
}
