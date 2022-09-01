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
import { authenticationHandler } from "./middleware/Authentication";

// builds dynamic module routes
const appKernel = AppKernel.getInstance();
const dynamicRoutes = appKernel.getRoutes();

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
        layout: "guest",
      },
      component: () => import("./views/LoginScreen/LoginScreen.vue"),
    },
    {
      path: "/login",
      name: "app.login",
      meta: {
        layout: "guest",
      },
      component: () => import("./views/LoginScreen/LoginScreen.vue"),
      children: [
        {
          path: ":refCode",
          name: "app.login.withRefCode",
          component: () => import("./views/LoginScreen/LoginScreen.vue"),
        },
      ],
    },
    {
      path: "/dashboard",
      name: "app.dashboard",
      meta: {
        layout: "user",
        protected: true,
      },
      component: () => import("./views/Dashboard/Dashboard.vue"),
    },
  ],
});

router.beforeEach(authenticationHandler);

export default router;
