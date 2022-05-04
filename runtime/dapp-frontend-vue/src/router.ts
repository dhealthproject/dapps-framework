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
import { createRouter, createWebHistory } from "vue-router";

// setup a dynamic modules application kernel
import { AppKernel } from "./kernel";

// builds dynamic module routes
const appKernel = AppKernel.getInstance();
const dynamicRoutes = appKernel.getRoutes();

// configures the `vue-router` routes
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: dynamicRoutes,
});

export default router;
