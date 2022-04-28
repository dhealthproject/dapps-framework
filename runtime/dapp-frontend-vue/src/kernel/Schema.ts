/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { LayoutType } from './Layout';

/**
* @interface Schema
* @description This interface represents groups of pages that
* are defined using so-called **page schemas**. A page schema
* consists of [properties](#properties) that define how pages
* are accessed (router), identified (state) and built (layout).
* <br /><br />
* Furthermore, a page schema defines a recipe of components
* that are necessary to display the expected dataset(s).
* <br /><br />
* @example Using the Schema interface
* ```typescript
*   const config = {
*     routerPath: "/home",
*     identifier: "dashboard",
*     layout: "grid",
*   };
*
*   // using the interface directly
*   const module1 = config as Module;
*
*   // or using a module factory
*   const module2 = createModule(config);
* ```
*
* <br /><br />
* #### Properties
*
* @param  {string}        routerPath           The vue-router path definition, e.g. "/game-leaderboard".
* @param  {string}        identifier           The schema identifier, this is a kebab-case formatted name, e.g. "game-leaderboard".
* @param  {LayoutType}    layoutType           The layout type used for the homepage of this module, e.g. "flex" or "grid".
*
* @since v0.1.0
*/
export interface Schema {
  /**
   * The vue-router path definition, e.g. "/game-leaderboard".
   * This should be unique across each frontend instance. It is
   * also possible to use variables that will be mapped using
   * `vue-router` internally.
   * <br /><br />
   * Note that if you are using dynamic path mappings (Variables),
   * it is important that you also define *validator* instances
   * and *transformers* in case of necessary transformations.
   * <br /><br />
   * @example Examples of valid router paths
   * ```typescript
   * // simple router paths
   * const path1 = "/accounts";
   * const path2 = "/identities";
   *
   * // advanced paths using dynamic path mapping
   * const path3 = "/accounts/:address/transactions";
   * const path4 = "/accounts/:address/mosaics";
   * ```
   *
   * @var {string}
   */
  routerPath: string;

  /**
   * The schema identifier, this is a kebab-case formatted
   * name, e.g. "game-leaderboard". This should be unique
   * across each frontend instance.
   * <br /><br />
   * Note that changing a module identifier on a production
   * environment is not recommended due to the URL change
   * that is going to happen.
   *
   * @var {string}
   */
  identifier: string;

  /**
   * The layout that will be used to display this page
   * schema on the screen. This property defines the template
   * for the DOM-element that contains all items of this
   * page schema.
   * <br /><br />
   * i.e. in case the page should display its items on a
   * grid, use the `"grid"` value.
   *
   * @see {LayoutType}
   * @var {LayoutType}
   */
  layout: LayoutType;
}
