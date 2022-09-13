/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 *
 * @todo add referrer_url parameter to redirect after log-in.
 * @param  {any} to
 * @param  {any} from
 * @param  {any} next
 * @returns {void}
 */
export const authenticationHandler = ({ next, router, $store }: any) => {
  // read authentication state from vuex store
  const isAuthenticated: boolean = $store.getters["auth/isAuthenticated"];

  // routes using this middleware should redirect
  // to /login given unauthenticated guest users.
  if (!isAuthenticated) {
    console.log("coming here");
    // Unauthorized: redirect to log-in
    // @todo add referrer_url parameter to redirect after log-in.
    return router.push({
      name: "app.login",
      replace: true,
    });
  }

  // Access authorized
  return next();
};

export const guestHandler = ({ next, router, $store }: any) => {
  // read authentication state from vuex store
  const isAuthenticated: boolean = $store.getters["auth/isAuthenticated"];

  // routes using this middleware should redirect
  // to /dashboard given authenticated guest users.
  if (isAuthenticated) {
    return router.push({
      name: "app.dashboard",
      replace: true,
    });
  }

  // Access unauthorized
  return next();
};
