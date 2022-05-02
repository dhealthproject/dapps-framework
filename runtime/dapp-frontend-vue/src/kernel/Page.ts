/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { LayoutType } from "./Layout";
import { Card } from "./Card";
import { State } from "./State";

/**
 * @interface Page
 * @description This interface represents groups of pages that
 * are defined using so-called **page schemas**. A page schema
 * consists of [properties](#properties) that define how pages
 * are accessed (router), identified (state) and built (layout).
 * <br /><br />
 * Furthermore, a page schema defines a recipe of components
 * that are necessary to display the expected dataset(s).
 * <br /><br />
 * @example Using the Page interface
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
 * @param  {string}         routerPath           The vue-router path definition, e.g. "/game-leaderboard".
 * @param  {State}          dependencies         The state dependencies configuration. This defines a tear-up process using state discovery. (Optional)
 * @param  {LayoutType}     layout               The layout type used for the homepage of this module, e.g. "flex" or "grid".
 * @param  {Card[]}         cards                The cards that are displayed on the page according to this schema instance.
 *
 * @since v0.1.0
 */
export interface Page {
  /**
   * The page identifier, this is a kebab-case formatted
   * name, e.g. "leaderboard-statistics". This should be
   * unique across one module instance.
   *
   * @var {string}
   */
  identifier: string;

  /**
   * The state dependencies configuration. This defines a
   * tear-up process using state discovery for all the cards
   * that are displayed. This property is optional and only
   * relevant if any state discovery must be run before cards
   * are rendered.
   * <br /><br />
   * Note that for cards specific state discovery, it is best
   * to use the {@link Card} interface's `state` property.
   * <br /><br />
   * Also note that setting the {@link State.waitFor} property
   * on Schema instances' `state` enables the tear-up logic
   * for the page instead of for individual components. This
   * is useful in cases where more than one card on the same
   * page need one identical dataset.
   *
   * @var {State}
   */
  dependencies?: State;

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

  /**
   * The cards that are displayed on the page according to this
   * schema instance. Cards are indexed and displayed next to
   * each other.
   * <br /><br />
   * Individual cards represent widgets that are displayed with
   * the frontend and layout using the overarching layout system.
   *
   * @var {Card[]}
   */
  cards: Card[];
}

/**
 * XXX
 *
 * @returns
 */
export const createPage = (): Page => {
  return {} as Page;
};
