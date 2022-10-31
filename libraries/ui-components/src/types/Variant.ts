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
 * @type Variant
 * @description This type defines a *design variant* as in
 * whether an element should use `primary`-styles, or other
 * pre-defined design variants.
 * <br /><br />
 * This type serves internally to limit the values available
 * for `variant` component properties.
 * Currently the following values are available to be used
 * in a card's `display.variant` configuration:
 *
 * | Value | Description |
 * | --- | --- |
 * | `primary` | The component uses the primary design variant, uses the brand blue color in background and white text. |
 * | `secondary` | The component uses the secondary design variant, uses a light color in background and brand blue text. |
 * | `tertiary` | The component uses the tertiary design variant, uses a light color in background and gray text. |
 *
 * @since v0.1.0
 */
export type Variant = "primary" | "secondary" | "tertiary";
