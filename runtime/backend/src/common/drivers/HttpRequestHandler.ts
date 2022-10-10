/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import axios, { AxiosResponse } from "axios";

/**
 * @type HttpMethod
 * @description The HTTP method name, e.g. `"GET"`. This type is used
 * to execute to HTTP requests using the `axios` dependency.
 *
 * @since v0.3.0
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH";

/**
 * @class HttpRequestHandler
 * @description This class contains methods for executing
 * *remote* API calls, e.g. calling a `GET` HTTP API endpoint.
 *
 * @since v0.3.0
 */
export class HttpRequestHandler {
  public constructor() {}

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
   * @returns {Promise<AxiosResponse<any, any>>}  The {@link Promise} that contains the result {@link AxiosResponse}.
   */
  public async call(
    url: string,
    method: HttpMethod = "GET",
    body: any = {},
    options: any = {},
    headers: any = {},
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
      throw err;
    }
  }
}
