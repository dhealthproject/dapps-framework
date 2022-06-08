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
import { Vue } from "vue-class-component";

// internal dependencies
import type { Variant } from "@/types/Variant";

/**
 * @class ComponentProperties
 * @internal
 */
class ComponentProperties {
  variant?: Variant;
  href?: string;
}

/**
 * @class DappButton
 * @description This component displays a clickable button
 * and uses the standard `<button>` tag to automatically
 * make `@click` and `@hover` compatible with browser events.
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
 * <br /><br />
 * Note that this component defines 4 slots that can be filled
 * with content:
 * | Slot | Description |
 * | --- | --- |
 * | `default` | Defines the button text. If no value is provided, the component uses `Click here`. |
 * | `icon` | Defines an optional icon on the left of the button (e.g. informational icon). |
 * | `prefix` | Defines an optional prefix text or element on the left of the button text (e.g. caret icon). |
 * | `suffix` | Defines an optional suffix text or element on the right of the button text (e.g. caret icon). |
 * <br /><br />
 * @example Using the DappButton component with variants
 * Variants that are available with the components library
 * can take up values as defined in {@link Variant}.
 * <br /><br />
 * ```html
 *   <template>
 *     <DappButton
 *       @click="() => console.log('clicked')"
 *       variant="primary"
 *     >My Action</DappButton>
 *   </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {Variant}     variant           The optional design variant (defaults to `"primary"`).
 * @param  {string}      href              The optional href url.
 *
 * @since v0.1.0
 */
export default class DappButton extends Vue.with(ComponentProperties) {
  /**
   * Method to generically handle `@click` event of this component.
   *
   * This generally will handle either:
   *  1. A href (route/url)
   *  2. A closure (onClick)
   *
   * This method handle button onClick event based on the availability of the `href` prop.
   *  - If href is available, assign `location.href` to it.
   *  - In case `href` is not registered as a prop, call `this.$emit("click")`.
   *
   * @access public
   * @returns {void}
   */
  public handleClick(): void {
    this.href ? (location.href = this.href) : this.$emit("click");
  }
}
