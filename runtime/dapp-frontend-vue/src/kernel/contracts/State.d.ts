/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { FormattersConfig } from "./Formatter";

/**
 * @interface State
 * @description This interface defines the configuration of
 * an individual card's data and state discovery. Cards map
 * directly to Vuex getters, actions and/or mutations.
 * <br /><br />
 * In case an individual state entry *depends* on the result
 * of another state entry, you can use the `waitFor` property
 * as an array such that the software will first request data
 * with this/these getter(s).
 * <br /><br />
 * @example Using the State interface
 * ```typescript
 *   const config = {
 *     waitFor: [],
 *     getter: "account/info",
 *   };
 *
 *   // using the interface directly
 *   const state = config as State;
 *
 *   // or using a state factory
 *   const state = createState(config);
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param  {string[]}       waitFor       The vue-router path definition, e.g. "/game-leaderboard". (Optional)
 * @param  {string}         getter        The schema identifier, this is a kebab-case formatted name, e.g. "game-leaderboard". (Optional)
 * @param  {string}         mutation      The state configuration. This is optional to read datasets from the backend. (Optional)
 * @param  {string}         action        The layout type used for the homepage of this module, e.g. "flex" or "grid". (Optional)
 * @param  {FormattersMap}  formatters    The display formatter(s) that are used before dataset(s) are being displayed. (Optional)
 *
 * @since v0.1.0
 */
export interface State {
  /**
   *
   */
  waitFor?: string[];

  /**
   *
   */
  getter?: string;

  /**
   *
   */
  mutation?: string;

  /**
   *
   */
  action?: string;

  /**
   * The display formatter(s) that are used before dataset(s)
   * are being displayed. These formatters transform input
   * in a *consistent* way across all cards of a schema
   * instance.
   * <br /><br />
   * i.e. if you want to display the pretty format of an
   * address given its' raw format, you would register here
   * a formatter for the value type `address` that refers
   * to the `"format-address-pretty"` formatter.
   *
   * @var {FormattersConfig}
   */
  formatters?: FormattersConfig;
}
