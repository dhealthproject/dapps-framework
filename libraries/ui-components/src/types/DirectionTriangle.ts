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
 * @type DirectionTriangle
 * @description This type defines a *direction triangle* as in
 * whether an element should display `up` direction, or other
 * pre-defined design direction.
 * <br /><br />
 * This type serves internally to limit the values available
 * for `direction` component properties.
 * Currently the following values are available to be used
 * in a component's `direction` configuration:
 *
 * | Value | Description |
 * | --- | --- |
 * | `up`   | The component uses the up direction. Displays an upward triangle with green color.  |
 * | `down` | The component uses the down direction. Displays a downward triangle with red color. |
 * | `both` | The component uses both directions. Displays both upward and downward triangles.    |
 *
 * @since v0.3.1
 */
export type DirectionTriangle = "up" | "down" | "both";
