/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @type FormatterFunction
 * @description This type defines a contract for formatter
 * arrow functions to make sure that they always return
 * `string`-typed results.
 *
 * @since v0.1.0
 */
export type FormatterFunction = (input: any) => string;

/**
 * @interface Formatter
 * @description This interface defines the configuration of
 * an individual **data formatter**. These are used for data
 * transformations and manipulations, e.g. displaying a pretty
 * address format instead of its' raw format.
 * <br /><br />
 * A formatter consists in an arrow function that returns a
 * `string`-typed formatted result given the original dataset
 * as an input.
 * <br /><br />
 * @example Using the Formatter interface
 * ```typescript
 *   const config = {
 *     valueType: "address",
 *     formatter: (in: any) => in.toString(),
 *   };
 *
 *   // using the interface directly
 *   const formatter = config as Formatter;
 *
 *   // or using a formatter factory
 *   const formatter = createFormatter(config);
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param  {any}    input    The input value that must be formatted.
 *
 * @since v0.1.0
 */
export type Formatter = (input: any) => string;

/**
 *
 */
export type FormattersConfig = Record<string, string>;

/**
 *
 */
export type FormatterFunctions = Record<string, Formatter>;
