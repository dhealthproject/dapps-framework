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
import { Page } from "./Page";

/**
 * @interface Module
 * @description This interface represents individual dynamic
 * modules as loaded by the frontend. Per each module we then
 * define page details, components and state discoveries that
 * are specific to a module.
 * <br /><br />
 * Typically, module configuration files will have either of a
 * `.json` or `.jsonc` extension, depending on whether you like
 * to document/comment module definition files or not.
 * <br /><br />
 * @example Using the Module interface
 * ```typescript
 *   const config = require("./module.json");
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
 * @param   {string}    identifier      The module identifier, this is a kebab-case formatted name, e.g. "game-leaderboard". (Required)
 * @param   {State}     dependencies    The state dependencies configuration. This defines a tear-up process using state discovery for all the pages that are in this module. (Optional)
 * @param   {boolean}   namespaced      This property defines whether the router configuration must use a *namespace* prefix, i.e. the module identifier, in the URL for accessing specific pages.
 * @param   {Record<string, Page>} routerConfig    The page schema(s) that are built to present the module at a end-user level, i.e. {@link Page}. (Required)
 *
 * @since v0.1.0
 */
export interface Module {
  /**
   * The module identifier, this is a kebab-case formatted
   * name, e.g. "leaderboard-statistics". This should be
   * unique across one frontend instance.
   * <br /><br />
   * Note that changing a module identifier on a production
   * environment is not recommended due to the URL change
   * that is going to happen.
   *
   * @var {string}
   */
  identifier: string;

  /**
   * The state dependencies configuration. This defines a
   * tear-up process using state discovery for all the pages
   * that are in this module. This property is optional and only
   * relevant if any state discovery must be run before pages
   * are rendered.
   * <br /><br />
   * Note that for pages specific state discovery, it is best
   * to use the {@link Schema} interface's `dependencies`
   * property.
   * <br /><br />
   * Also note that setting the {@link State.waitFor} property
   * on Module instances' `dependencies` enables the tear-up
   * logic for the entire module instead of for individual
   * pages or components. This is useful in cases where more
   * than one page or card in the same module need one identical
   * dataset or whenever data discovery must happen pre-render.
   *
   * @var {State|undefined}
   */
  dependencies?: State;

  /**
   * This property defines whether the router configuration must
   * use a *namespace* prefix, i.e. the module identifier, in the
   * URL for accessing specific pages.
   * <br /><br />
   * Note that if you are using a namespaced module, **all pages**
   * must be accessed using the *module identifier* prefix.
   *
   * @var {boolean|undefined}
   */
  namespaced?: boolean;

  /**
   * The vue-router paths definition, e.g. "/game-leaderboard".
   * This should define unique routes for the module instance.
   * It is also possible to use variables that will be mapped
   * using `vue-router` internally.
   * <br /><br />
   * Note that if you are using dynamic path mappings (variables),
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
   * @var {Record<string, Page>}
   */
  routerConfig: Record<string, Page>;
}
