/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Options } from "vue-class-component";
import { Prop, Vue } from "vue-property-decorator";

// internal dependencies
import type { Variant, VariantConfiguration } from "./types/Variant";
import { useVariant } from "./types/Variant";

/**
 * @class BaseComponent
 * @description This class serves as a base *mixin* for components
 * published with this library. Exported components extend this
 * to make use of base features like setting the design variant or
 * changing base components configuration.
 * <br /><br />
 * Note that this component does not define any HTML other than the
 * possibility to fill the **default** slot:
 * | Slot | Description |
 * | --- | --- |
 * | `default` | Defines the component HTML markup. |
 * <br /><br />
 *
 * @since v0.1.0
 */
@Options({})
export class BaseComponent extends Vue {
  /**
   * The (optional) variant to use when styling this button.
   *
   * @access protected
   * @var {Page}
   */
  @Prop({ default: "primary" }) protected variant?: Variant = "primary";

  /**
   *
   */
  protected get designVariant(): VariantConfiguration {
    // reads variant or uses default
    const v = this.variant ? this.variant : "primary";

    // returns mixin
    return useVariant(v);
  }
}
