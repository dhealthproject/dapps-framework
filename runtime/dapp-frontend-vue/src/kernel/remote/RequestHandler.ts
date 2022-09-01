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
 * @interface RequestHandler
 * @description This interface defines obligatory methods to be added
 * to implementing classes that can be used as request handlers in the
 * below {@link BackendService}.
 * <br /><br />
 * A request handler is typically used to *delegate* the execution of
 * *remote* requests (to the backend, the network-api, etc.).
 *
 * @todo The {@link call} method should not use `any` for request options/headers
 * @since v0.3.0
 */
export interface RequestHandler {
  /**
   * This method should implement the logic to execute
   * a *request*. It is possible to implement this interface
   * to cover different protocols than `HTTP(S)`.
   *
   * @access public
   * @async
   * @param   {string}   url        The exact URL to be called for the request, e.g. `"http://localhost:7903/auth/challenge"`.
   * @param   {string}   method     A HTTP method name, e.g. `"GET"`. Defaults to `"GET"`.
   * @param   {any}      body       A configuration object that is forwarded to `axios` as the request body (POST requests).
   * @param   {any}      options    A configuration object that is forwarded to `axios` as the request options.
   * @param   {any}      headers    A configuration object that is forwarded to `axios` as the request headers.
   * @returns {Promise<Record<string, any>>}
   */
  call(
    url: string,
    method: string,
    body?: any,
    options?: any,
    headers?: any
  ): Promise<Record<string, any>>;
}
