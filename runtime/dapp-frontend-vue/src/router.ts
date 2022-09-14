/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import VueRouter from "vue-router";

// setup a dynamic modules application kernel
import { AppKernel } from "./kernel";
import {
  authenticationHandler as auth,
  guestHandler as guest,
} from "./middleware/Authentication";

// builds dynamic module routes
const appKernel = AppKernel.getInstance();
const dynamicRoutes = appKernel.getRoutes();

/**
 * This helper creates a `nextMiddleware()` function which not
 * only runs the default `next()` callback but also triggers
 * the subsequent Middleware functions.
 *
 * @param     {any}   context
 * @param     {any}   middleware
 * @param     {any}   index
 * @returns   {()=>void}
 */
const nextFactory = (context: any, middleware: any, index: any) => {
  // if no subsequent Middleware exists,
  // the default `next()` callback is returned.
  const subsequentMiddleware = middleware[index];
  if (!subsequentMiddleware) return context.next;

  return (...parameters: any[]) => {
    // run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
};

/**
 * This helper creates a `vue-router` instance using the `history`
 * mode and a base URL using environment variables.
 * <br /><br />
 * Note that **components** are registered for routes using an
 * `import()`-statement to permit *lazy-loading* of components
 * only when they are necessary. Additionally, this statement
 * tells *webpack* that separate chunks must be created which
 * optimizes the LT (loading-time) and TTR (time-to-render).
 *
 * @param     {Vuex.Store}  $store
 * @returns   {VueRouter}
 */
export const createRouter = ($store: any): VueRouter => {
  // configures the `vue-router` routes
  const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
      ...dynamicRoutes,
      {
        path: "/",
        name: "app.home",
        meta: {
          layout: "guest/split-horizontal",
          middleware: [guest],
        },
        component: () =>
          import("./views/OnboardingScreen/OnboardingScreen.vue"),
      },
      {
        path: "/terms-of-service",
        name: "legal.terms-of-service",
        meta: { layout: "guest/default" },
        component: () => import("./views/LegalDisclaimer/LegalDisclaimer.vue"),
      },
      {
        path: "/terms-and-conditions",
        name: "legal.terms-and-conditions",
        meta: { layout: "guest/default" },
        component: () => import("./views/LegalDisclaimer/LegalDisclaimer.vue"),
      },
      {
        path: "/privacy-policy",
        name: "legal.privacy-policy",
        meta: { layout: "guest/default" },
        component: () => import("./views/LegalDisclaimer/LegalDisclaimer.vue"),
      },
      {
        path: "/login",
        name: "app.login",
        meta: { layout: "guest/split-horizontal" },
        component: () => import("./views/LoginScreen/LoginScreen.vue"),
        children: [
          {
            path: ":refCode",
            name: "app.login.withRefCode",
            meta: { layout: "guest/split-horizontal" },
            component: () => import("./views/LoginScreen/LoginScreen.vue"),
          },
        ],
      },
      {
        path: "/dashboard",
        name: "app.dashboard",
        meta: {
          layout: "app/default",
          middleware: [auth],
        },
        component: () => import("./views/Dashboard/Dashboard.vue"),
      },
    ],
  });

  // attach middlewares when they are configured on each
  // route. This will run one middleware after the other
  // and as such *order matters*.
  router.beforeEach((to, from, next) => {
    if (to?.meta?.middleware) {
      // accept individual middleware
      const middleware = Array.isArray(to.meta.middleware)
        ? to.meta.middleware
        : [to.meta.middleware];

      // prepares middleware context
      const context = {
        from,
        next,
        to,
        router,
        $store,
      };

      // executes middleware and "next" middleware
      const nextMiddleware = nextFactory(context, middleware, 1);
      return middleware[0]({ ...context, next: nextMiddleware });
    }

    return next();
  });

  return router;
};
