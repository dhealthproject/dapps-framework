/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth Contracts
 * @subpackage  API
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @type ObjectLiteral
 * @description This type defines a named export that can
 * be used to map `any` object that represents its content
 * as an `object` and contains a set of *fields* with *values*.
 * <br /><br />
 * This type is an *utility*-type that is never **required**,
 * you can always use the underlying `Record<string, any>`
 * type instead, or build the object explicitely (`any`).
 * <br /><br />
 * @example Using the `ObjectLiteral` type
 * ```ts
 * // creating a custom object
 * const the_object = {
 *   coolness: "pow(10, 6)",
 *   usefulness: "pow(10, 6)",
 *   complexity: "pow(10, 0)",
 * } as ObjectLiteral;
 * ```
 *
 * @since v0.3.0
 */
export type ObjectLiteral =
  | Record<string, any>
  | {
      [key: string]: any;
    };
