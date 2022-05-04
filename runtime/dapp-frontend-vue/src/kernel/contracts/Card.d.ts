/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { State } from "./State";
import { PaginationMode } from "./Pagination";

/**
 * @type CardComponentType
 * @description This type defines the component types that
 * can be wrapped in cards with this software.
 * <br /><br />
 * This type serves internally to limit the keys available
 * with the {@link Card} interface's `component` field.
 *
 * @since v0.1.0
 */
export type CardComponentType = "Card" | "TableCard";

/**
 * @type CardWrapperSize
 * @description This type defines the wrapper size that is
 * used to render the card.
 * <br /><br />
 * This type serves internally to limit the keys available
 * with the {@link CardDisplayMode} interface's `size`
 * field.
 * <br /><br />
 * Currently the following values are available to be used
 * in a card's `display.size` configuration:
 *
 * | Value | Description |
 * | --- | --- |
 * | `full-width` | The card will take up the full width of its parent node. |
 * | `adapt-to-content` | The card will take as much room as as necessary to display its own content. |
 * | `flex` | The card will take as much room as necessary to display its own content *and* will fill up some extra space if the parent node is not filled. |
 *
 * @since v0.1.0
 */
export type CardWrapperSize = "full-width" | "adapt-to-content" | "flex";

/**
 * @interface CardDisplayMode
 * @description This type defines the display mode settings
 * for an individual card component. Display modes are used
 * to determine whether a card must be displayed or not in
 * the event of *errors* or the dataset being *empty*.
 * <br /><br />
 * By default, cards that produce errors are hidden and cards
 * that contain empty datasets are displayed.
 *
 * @since v0.1.0
 */
export interface CardDisplayMode {
  /**
   * The display size defines whether the card should be using
   * the full screen width or be adaptive in that it adapts its
   * width to its' own content.
   *
   * @var {CardWrapperSize}
   */
  size: CardWrapperSize;

  /**
   * This property defines whether a card should be displayed
   * or not given an empty dataset. Typically, this should be
   * set to `true` as it is usual to display a message to the
   * end-user when datasets are returned empty.
   * <br /><br />
   * Note that setting a `string` value for this field will
   * use the value as a message being displayed given an empty
   * dataset.
   *
   * @var {boolean | string}
   */
  onEmpty: boolean | string;

  /**
   * This property defines whether a card should be displayed
   * or not given an error during discovery. Typically, this
   * should be set to `false` as it is usual to avoid displaying
   * error information in production environments.
   * <br /><br />
   * Note that setting a `string` value for this field will
   * use the value as a message being displayed given an error
   * during discovery.
   *
   * @var {boolean | string}
   */
  onError: boolean | string;

  /**
   * A list of custom CSS classes that should be added on the
   * component tag. This applies to the `<card>` or `<table-card>`
   * elements, not to their dynamic content.
   * <br /><br />
   * It is recommended to add container classes from TailWind
   * in this property if any must be set on a card instance.
   *
   * @var {string[]}
   */
  classes: string[];
}

/**
 * @interface Card
 * @description This interface defines the configuration of
 * an individual card on the screen.
 * <br /><br />
 * A display mode can be set using the property `display`,
 * which defines whether the card is displayed or not, when a
 * state error happens or when state is empty. Loading state
 * does not count as state being empty.
 * <br /><br />
 * Pagination can be configured to use a default, client-side
 * pagination with `"client"`, a server-side pagination with
 * `"server"` or to be disabled overall with `"none"`.
 * <br /><br />
 * State is defined using the property `state`, which defines
 * any type of state discoveries that have to be waited for,
 * a data getter path, using the namespaced Vuex store, and
 * optionally a list of columns that are displayed only for
 * TableCard components.
 * <br /><br />
 * Last but not least, the format of display can be defined
 * using the `format` property, which optionally defines the
 * displayed columns - thereby implying some are hidden - or
 * transforming/manipulating datasets otherwise before display.
 * <br /><br />
 * @example Using the Card interface
 * ```typescript
 *   const config = {
 *     identifier: "account-information-widget",
 *     component: "TableCard",
 *     display: {
 *       size: "full-width",
 *       onEmpty: false,
 *       onError: false,
 *       classes: ["text-green-800", "text-bold"]
 *     },
 *     pagination: "none", // | "default" | "client" | "server"
 *     state: {
 *       waitFor: [],
 *       getter: "account/info",
 *       formatters: {
 *         address: "format-mini-address",
 *         balance: "format-absolute-amount"
 *       }
 *     }
 *   };
 *
 *   // using the interface directly
 *   const card = config as Card;
 *
 *   // or using a card factory
 *   const card = createCard(config);
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param   {string}              identifier    The card identifier, must be unique across one page's cards.
 * @param   {CardComponentType}   component     The type of component that will be used to display for this card, i.e. one of `Card` or `TableCard`.
 * @param   {CardDisplayMode}     display       The display mode that will be used. This defines whether the card should display in error cases and when state is empty. (Optional)
 * @param   {PaginationMode}      pagination    The pagination mode, one of: 'none', 'default', 'client' or 'server'. (Optional)
 * @param   {State}               state         The state configuration. This is required to read datasets from the backend. (Optional)
 *
 * @since v0.1.0
 */
export interface Card {
  /**
   * A unique identifier that can be used to refer to this
   * card. This must be unique across one page's cards
   * configuration.
   *
   * @var {string}
   */
  identifier: string;

  /**
   * The type of component that will be used to display for
   * this card, i.e. one of `Card` or `TableCard`. More card
   * component types will be added in next iterations.
   *
   * @var {CardComponentType}
   */
  component: CardComponentType;

  /**
   * The display mode that will be used. This defines whether
   * the card should display in error cases and when state is
   * empty.
   *
   * @var {CardDisplayMode}
   */
  display?: CardDisplayMode;

  /**
   * The pagination mode that will be used, if any. This sets
   * the pagination to use either client-side or server-side
   * pagination, or to be disabled using `"none"`.
   *
   * @see {PaginationMode}
   * @var {PaginationMode}
   */
  pagination?: PaginationMode;

  /**
   * The state configuration for discovery and mutations. This
   * is required to perform read/write operations with datasets
   * from the backend.
   * <br /><br />
   * A state configuration entry *may* directly map to the `vuex`
   * store's getters, mutations or actions. Additionally, it is
   * possible to define "tear-up" logic using the {@link State.waitFor}
   * property.
   *
   * @see {State}
   * @var {State}
   */
  state?: State;
}
