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
import { Size } from "@/types/Size";

/**
 * @class DappIcon
 * @description This component displays an image icon
 * and uses the standard `<img>` tag.
 * <br /><br />
 * You can customize the look&feel of this components with adjusting the props.
 * <br /><br />
 * @example Using the DappIcon component with sizes
 * Sizes that are available with the components library
 * can take up values as defined in {@link Size}.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappIcon
 *      size="medium"
 *      src="path/to/image.png"
 *      alt="some alts"
 *    />
 *  </template>
 * ```
 * <br /><br />
 * #### Parameters
 * @param  {string}   src     The optional source url.
 * @param  {string}   alt     The optional alt string.
 * @param  {Size}     size    The optional icon size (values are `"small"`, `"medium"` and `"large"`). Default value is `"medium"`.
 */
@Component({})
export default class DappIcon extends Vue {
  /**
   * The optional `src` property.
   * Defines the path to the icon.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected src?: string;

  /**
   * The optional `alt` property.
   * Defines the alternate texts of the Icon.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected alt?: string;

  /**
   * The optional `size` property.
   * Defines the icon size.
   *
   * In this component, the size definitions are:
   * | Value | Description |
   * | --- | --- |
   * | `small`  | 20x20 px |
   * | `medium` | 32x32 px |
   * | `large`  | 64x64 px |
   *
   * @see {@link Size}
   * @access protected
   * @var {Size}
   */
  @Prop({ default: "medium" })
  protected size?: Size;
}
