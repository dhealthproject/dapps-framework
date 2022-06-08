/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @type Size
 * @description This type defines a *dynamic size* as in
 * whether an element should use `medium`-styles, or other
 * pre-defined dynamic size.
 * <br /><br />
 * This type serves internally to limit the values available
 * for `size` component properties.
 * <br /><br />
 *
 * Depending on styling option, this can be mapped to CSS
 * width/height attributes accordingly.
 * <br /><br />
 *
 * Currently the following values are available to be used
 * in a card's `display.size` configuration:
 *
 * | Value | Description |
 * | --- | --- |
 * | `small` | The component uses the small size option. |
 * | `medium` | The component uses the medium size option. |
 * | `large` | The component uses the large size option. |
 *
 * @since v0.1.0
 */
export type Size = "small" | "medium" | "large";
