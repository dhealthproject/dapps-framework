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
   * The router instance that is stored in this class when the host application registers routes.
   *
   * This instance will be available upon this call in host application:
   * ```js
   * app.use(router)
   * ```
   * @see https://router.vuejs.org/guide/#javascript
   * @var {any}
   */
  $router: any;

  /**
   * Method to generically handle `@click` event of this component.
   *
   * This generally will handle either:
   *  1. A href (route/url)
   *  2. A closure (onClick)
   *
   * This method detects whether the passed-in `href` prop is a route or an external url.
   *  - If it is an external url, apply `window.open()`.
   *  - If it is a route, apply `$router.push()`.
   *  - In case `href` is not registered as a prop, a general `this.$emit("click")`.
   *
   * @access public
   * @returns {void}
   */
  public handleClick(): void {
    if (!this.href) {
      this.$emit("click");
    } else if (this.routeExists(this.href)) {
      this.$router?.push(this.href);
    } else {
      window.open(this.href);
    }
  }

  /**
   * Method to check whether a route path exists within the host application.
   * It traverses through all the existing route paths and find a match with the input.
   *
   * @access private
   * @param   {string} routePath  The route path to check
   * @returns {boolean}
   */
  private routeExists(routePath: string): boolean {
    return this.$router
      .getRoutes()
      .some((routeObj: { path: string }) => routePath === routeObj.path);
  }
}
