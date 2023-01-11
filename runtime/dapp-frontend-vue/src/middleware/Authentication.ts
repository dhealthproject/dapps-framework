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

/**
 *
 * @description this method used for handling authenticated state and pushing user from onboarding in case of existing authentication
 *
 * @param  {any} to
 * @param  {any} from
 * @param  {any} next
 * @returns {void}
 */
export const guestHandler = ({ to, next, router, $store }: any) => {
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

  // analytics tracker
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  window.analytics.page(`Visited page: ${to.name}`, {
    routeName: to.name,
    routePath: to.path,
    isAuthenticated: $store.getters["auth/isAuthenticated"],
  });

  // Access unauthorized
  return next();
};
