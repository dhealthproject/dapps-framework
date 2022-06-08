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
import { Size } from "@/types/Size";

/**
 * @class ComponentProperties
 * @internal
 */
class ComponentProperties {
  src?: string;
  alt?: string;
  size?: Size;
}

/**
 * @class DappIcon
 * @description This component displays an image icon
 * and uses the standard `<img>` tag.
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
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
 * @param  {Size}     size    The optional icon size (values are `"small"`, `"medium"` and `"large"`).
 */
export default class DappIcon extends Vue.with(ComponentProperties) {}
