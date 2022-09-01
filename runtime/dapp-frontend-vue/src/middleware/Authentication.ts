/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { AuthService } from "@/services/AuthService";

/**
 * This method is used for handling user authentication
 * it checks if user is authenticated(has token in cookies) and current route protected or not
 *
 * 1. If token is available and route is protected - allow user to enter the route
 * 2. If token is not available and the route is protected - push user to "log-in" route
 * 3. If token is not available and the route isn't protected - allow user to enter the route
 *
 * @todo add referrer_url parameter to redirect after log-in.
 *
 * @param  {any} to
 * @param  {any} from
 * @param  {any} next
 * @returns {void}
 */
export const authenticationHandler = (to: any, from: any, next: any) => {
  if (!("meta" in to) || !to.meta.protected) {
    // Access authorized
    return next();
  }

  // protected pages
  if (!AuthService.hasClientAuthorization()) {
    // Unauthorized: redirect to log-in
    // @todo add referrer_url parameter to redirect after log-in.
    return next({
      path: "/login",
    });
  }

  // Access authorized
  return next();
};
