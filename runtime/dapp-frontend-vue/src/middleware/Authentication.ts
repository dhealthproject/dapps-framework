/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import Cookies from "js-cookie";
/**
 * This method is used for handling user authentication
 * it checks if user is authenticated(has token in cookies) and current route protected or not
 *
 * 1. If token is available and route is protected - allow user to enter the route
 * 2. If token is not available and the route is protected - push user to "onboarding" route
 * 3. If token is not available and the route isn't protected - allow user to enter the route
 *
 * @returns {void}
 *
 * @param  {any} to
 * @param  {any} from
 * @param  {any} next
 */
export const authenticationHandler = (to: any, from: any, next: any) => {
  const isAuthenticated = Cookies.get("accessToken");
  if (to?.meta?.protected && !isAuthenticated) {
    next({
      path: "/login",
    });
  }

  next();
};
