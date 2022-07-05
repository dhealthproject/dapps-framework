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
import Cookies from "js-cookie";
import VueRouter from "vue-router";

// setup a dynamic modules application kernel
import { AppKernel } from "./kernel";

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
      path: "/about",
      name: "about",
      component: () => import("./views/pages/AboutPage/AboutPage.vue"),
    },
    {
      path: "/onboarding",
      name: "onboarding",
      component: () => import("./views/OnboardingPage/OnboardingPage.vue"),
    },
    {
      path: "/termsofservice",
      name: "termsofservice",
      meta: {
        protected: true,
      },
      component: () =>
        import("./views/TermsOfServicePage/TermsOfServicePage.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = Cookies.get("accessToken");
  console.log({ isAuthenticated });
  if (to?.meta?.protected && !isAuthenticated) {
    next({
      path: "/onboarding",
    });
  }

  next();
});

export default router;
