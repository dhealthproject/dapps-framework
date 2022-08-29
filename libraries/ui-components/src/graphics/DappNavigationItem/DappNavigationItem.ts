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
import { Component, Prop, Vue } from "vue-property-decorator";

// internal dependencies
import { Variant } from "@/types/Variant";
import DappIcon from "../DappIcon/DappIcon.vue";

/**
 * @class DappNavigationItem
 * @description This component displays a navigation bar item and uses the standard `<div>` tag.
 * <br /><br />
 * You can customize the look&feel of this components with adjusting the props.
 * <br /><br />
 * @example Using the DappNavigationItem component with noOfItems that are available with the
 * components library that can take up any number values and injected `DappNavigationItem`:
 * <br /><br />
 * ```html
 *  <template>
 *    <DappNavigationItem icon="/img/icons/icon1.svg" label="About" slot="menuItem1" class="active" />
 *  </template>
 * ```
 * <br /><br />
 * #### Parameters
 * @param  {variant}   variant  The optional design variant (defaults to `"primary"`).
 * @param  {string}    icon     The required icon src of this navigation item. Note that this must be an svg file so that its color can be updated to the `active` class.
 * @param  {string}    label    The optional label content of menu item.
 *
 * @since v0.2.2
 */
@Component({
  components: {
    DappIcon,
  },
})
export default class DappNavigationItem extends Vue {
  /**
   * The optional design variant (defaults to `"primary"`).
   *
   * @access protected
   * @var {Variant}
   */
  @Prop({ default: "primary" })
  protected variant?: Variant;

  /**
   * The required icon's src of this navigation item.
   * Note that this must be an svg file so that its color can be updated to the `active` class.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected icon?: string;

  /**
   * The optional label content of menu item.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected label?: string;

  /**
   * The component creation hook. It convert the icon `img` tag to `svg` so that
   * its color can be updated programatically based on this component's `active` class.
   *
   * @async
   * @access public
   * @returns {Promise<void>}
   */
  public async mounted(): Promise<void> {
    await this.addSVG();
  }

  /**
   * Method to convert the icon `img` tag to `svg`.
   * It fetches the image from the image source and
   * utilizes the {@link DOMParser} to extract the
   * svg content of the image, then replaces the `img`
   * tag with an `svg` element that contains this content.
   *
   * @async
   * @access protected
   * @returns {Promise<void>}
   */
  protected async addSVG(): Promise<void> {
    const imgEl = this.$el.querySelector("img");
    const src = imgEl?.getAttribute("src");
    if (!src) return;
    const fetchRes = await fetch(src);
    const data = await fetchRes.text();
    const parser = new DOMParser();
    const svg = parser
      .parseFromString(data, "image/svg+xml")
      .querySelector("svg");
    if (!svg) return;
    if (imgEl?.id) svg.id = imgEl.id;
    if (imgEl?.className) (svg as any).classList = imgEl.classList;
    svg.querySelector("g")?.removeAttribute("fill");
    svg.querySelector("path")?.removeAttribute("fill");
    svg.removeAttribute("fill");
    svg.classList.add("dappNavigationItem-svg");

    imgEl?.parentNode?.replaceChild(svg, imgEl);
  }
}
