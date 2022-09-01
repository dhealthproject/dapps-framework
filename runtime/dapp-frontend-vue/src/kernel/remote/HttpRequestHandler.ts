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
import axios, { AxiosResponse } from "axios";

// internal dependencies
import { RequestHandler } from "./RequestHandler";

/**
 * @class HttpRequestHandler
 * @description This class implements a handler for API calls
 * that are transported over HTTP to the backend API.
 * <br /><br />
 * It currently *only* implements `GET` and `POST` HTTP methods
 * and must be used by child classes of the {@link BackendService}
 * to execute requests over HTTP(S).
 * <br /><br />
 * @example Using the HttpRequestHandler class
 * ```typescript
 *   const handler = new HttpRequestHandler();
 *   const response = await handler.call(
 *     "http://localhost:7903/auth/challenge",
 *     "GET",
 *     "",
 *   );
 * ```
 *
 * @todo Should accept custom request headers in method {@link call}
 * @todo The {@link call} method should not use `any` for request options/headers
 * @todo The {@link call} method must not use `options` in a request's **data** field
 * @todo Improve error handling and messaging
 *
 * @since v0.2.0
 */
export class HttpRequestHandler implements RequestHandler {
  /**
   * This method implements the logic to execute HTTP
   * requests using the `axios` dependency.
   * <br /><br />
   * Methods currently supported include: `GET`, `POST`.
   *
   * @access public
   * @async
   * @param   {string}   url        The exact URL to be called for the request, e.g. `"http://localhost:7903/auth/challenge"`.
   * @param   {string}   method     A HTTP method name, e.g. `"GET"`. Defaults to `"GET"`.
   * @param   {any}      body       A configuration object that is forwarded to `axios` as the request body (POST requests).
   * @param   {any}      options    A configuration object that is forwarded to `axios` as the request options.
   * @param   {any}      headers    A configuration object that is forwarded to `axios` as the request headers.
   * @returns {Promise<AxiosResponse<any, any>>}
   */
  public async call(
    url: string,
    method = "GET",
    body: any = {},
    options: any = {},
    headers: any = {}
  ): Promise<AxiosResponse<any, any>> {
    // try to execute the HTTP request using
    // axios and do some general error handling
    try {
      // POST requests are supported
      if (method === "POST") {
        return axios.post(url, body, {
          ...options,
          headers,
        });
      }

      // GET requests are supported
      return axios.get(url, {
        ...options,
        headers,
      });
    } catch (err) {
      console.log("Request failed: ", err);
      throw err;
    }
  }
}
