/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { RouteRecordRaw } from "vue-router";
import { Module, Page } from "./contracts";

// internal kernel configuration
import MODULES from "../../config/modules";

/**
 * @class AppKernel
 * @description This class handles parsing module files
 * to generate dynamic routes. It accepts a {@link Module}
 * module configuration object
 * <br /><br />
 * Note that this class uses a variant of the Singleton
 * design pattern to forbid the instanciation of more
 * than one application kernel in a process. You must
 * always use the static {@link getInstance} function
 * to retrieve the instance of the application kernel.
 * <br /><br />
 * @example Using the AppKernel class
 * ```typescript
 *   const app = AppKernel.getInstance();
 *   console.log(app.getRoutes());
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param   {Record<string, Module>}    modules      The module configuration to parse, i.e. this should
 * @param   {Record<string, Page>}      routes       The application routes that can be accessed by URL. This contains keys that are fully qualified URIs.
 *
 * @since v0.1.0
 */
export class AppKernel {
  /**
   * The *only* instance of this class that can exist in
   * the lifetime of one application process. The access
   * to this is private such that this variable can only
   * be accessed and modified using internal methods.
   *
   * @access private
   * @var {AppKernel}
   */
  private static INSTANCE: AppKernel;

  /**
   * The module configuration that is parsed to retrieve
   * routes, cards and other configuration options.
   *
   * @access protected
   * @var {Record<string, Module>}
   */
  protected modules: Record<string, Module>;

  /**
   * The routes that are configured with this software and
   * accessible by URI. This property stores {@link Page} objects
   * and maps them to unique URIs ("routes").
   *
   * @access protected
   * @var {Record<string, Page>}
   */
  protected routes: Record<string, Page>;

  /**
   * Create an instance of the application kernel using a set
   * of {@link Module} module configuration objects.
   * <br /><br />
   * This method uses a module's identifier to store it in a
   * property {@link modules} and reads its configuration to
   * find routes that are stored in a property {@link routes}.
   * <br /><br />
   * Note that module identifiers must be unique across dapp
   * configuration files. There cannot be a module identifier
   * that refers to multiple modules.
   * <br /><br />
   * Note also, that you can enable namespaced routes with the
   * `namespaced` property on {@link Module} objects.
   *
   * @access public
   * @static
   * @returns {AppKernel}   A configured application kernel ready to serve dynamic routes with the {@link Assembler}.
   */
  public static getInstance(): AppKernel {
    // singleton pattern
    if (AppKernel.INSTANCE !== undefined) {
      return AppKernel.INSTANCE;
    }

    // initialize modules
    const registry = {} as Record<string, Module>;
    const routes = {} as Record<string, Page>;

    // maps modules to their respective identifier
    // Note that module identifiers must be unique
    // across dapp configuration files. In case of
    // duplicate module identifiers, a warning will
    // be displayed and the **first** module to use
    // an identifier always prevails (no-overwrite).
    for (let i = 0, m = MODULES.length; i < m; i++) {
      // shortcut
      const mod = MODULES[i] as Module;
      const id = mod.identifier;

      // watch for duplicate module identifier
      if (Object.keys(registry).includes(id)) {
        console.warn(
          `[@dhealthdapps/frontend][kernel] Caution: Duplicate module identifier "${id}".`
        );
        continue;
      }

      // save module
      registry[id] = mod;

      // Note that routes must be unique across dapp
      // configuration files in case the configuration
      // of the module is *not* namespaced. In case of
      // namespaced modules, the paths must be unique
      // across said module configuration file only.
      Object.keys(mod.routerConfig).forEach((path) => {
        // retrieves the related page configuration
        const page: Page = mod.routerConfig[path];

        // sets the parent relationship
        page.parent = mod.identifier;

        // path always starts with a slash (URI)
        if (path.indexOf("/") !== 0) {
          path = `/${path}`;
        }

        // handles namespaced module routes prefixes
        if (true === mod.namespaced) {
          path = `/${mod.identifier}${path}`;
        }

        // watch for duplicate route paths
        if (Object.keys(routes).includes(path)) {
          console.warn(
            `[@dhealthdapps/frontend][kernel] Caution: Duplicate route path "${path}".`
          );
          return;
        }

        // stores the unique URI and maps it to a Page
        routes[path] = page;
      });
    }

    // instanciate configured app kernel
    return (AppKernel.INSTANCE = new AppKernel(registry, routes));
  }

  /**
   * Constructs an application kernel instance. This class sets
   * the {@link modules} and {@link routes} properties of the
   * instance.
   *
   * @access protected
   * @param   {Record<string, Module>}    modules    The module configuration that is parsed to retrieve routes and cards.
   * @param   {Record<string, Page>}      routes     The application routes that can be accessed by URL. This contains keys that are fully qualified URIs.
   * @returns {AppKernel}
   */
  protected constructor(
    modules: Record<string, Module>,
    routes: Record<string, Page>
  ) {
    this.modules = modules;
    this.routes = routes;
  }

  /**
   * Returns routes that are compatible with `vue-router` and
   * contain information about the displayed component.
   * <br /><br />
   * We use route level code-splitting with an arrow function
   * at the route-level `component` field so that a separate
   * chunk file is generated for each route (about.[hash].js)
   * and those are lazy-loaded only when the route is visited.
   * <br /><br />
   * Note that we use the {@link Assembler} component to render
   * dynamic module pages and that the *route name* is always
   * set to the page's identifier.
   *
   * @access public
   * @returns {RouteRecordRaw[]}    An array of `vue-router` compatible route objects that map to a specific component.
   */
  public getRoutes(): RouteRecordRaw[] {
    const paths: string[] = Object.keys(this.routes);

    if (!paths.length) {
      return [];
    }

    const routes: RouteRecordRaw[] = [];
    for (const path in this.routes) {
      const page: Page = this.routes[path];

      routes.push({
        path,
        name: page.identifier,
        component: () => import("@/views/Assembler/Assembler.vue"),
        props: {
          page,
        },
      });
    }

    return routes;
  }

  /**
   *
   */
  public getModule(identifier: string): Module | undefined {
    // finds module by identifier
    if (!(identifier in this.modules)) {
      return undefined;
    }

    return this.modules[identifier];
  }

  /**
   *
   */
  public getPage(identifier: string): Page | undefined {
    // finds route by identifier
    const route = Object.keys(this.routes).find(
      (path) => this.routes[path].identifier === identifier
    );

    if (route === undefined) {
      return undefined;
    }

    return this.routes[route];
  }
}
