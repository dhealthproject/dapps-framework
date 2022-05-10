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
 * | `primary` | The component uses the primary design variant, i.e. currently this maps to the color *Royal Blue*. |
 * | `secondary` | The component uses the secondary design variant, i.e. currently this maps to the color *Turquoise*. |
 * | `tertiary` | The component uses the tertiary design variant, i.e. currently this maps to the color *Navy*. |
 * | `accentFirst` | The component uses the first accent color design variant, i.e. currently this maps to the color *Tangerine*. |
 * | `accentSecond` | The component uses the second accent color design variant, i.e. currently this maps to the color *Violet*. |
 * | `accentThird` | The component uses the third accent color design variant, i.e. currently this maps to the color *Linen*. |
 * | `accentFourth` | The component uses the fourth accent color design variant, i.e. currently this maps to the color *Sand*. |
 *
 * @since v0.1.0
 */
export type Variant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "accentFirst"
  | "accentSecond"
  | "accentThird"
  | "accentFourth";

/**
 *
 */
export type VariantConfiguration = {
  name: Variant;
  isDark: boolean;
};

/**
 *
 */
export const LightBackgroundVariants = [
  "secondary",
  "accentThird",
  "accentFourth",
  "accentFifth",
];

/**
 *
 */
export const DarkBackgroundVariants = [
  "primary",
  "tertiary",
  "accentFirst",
  "accentSecond",
];

/**
 *
 */
export const useVariant = (v: Variant): VariantConfiguration => {
  return {
    name: v,
    isDark: DarkBackgroundVariants.includes(v),
  } as VariantConfiguration;
};
