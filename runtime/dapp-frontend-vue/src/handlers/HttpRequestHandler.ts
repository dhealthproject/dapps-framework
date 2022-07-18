/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import axios from "axios";

/**
 * @class HttpRequestHandler
 * @description This class handles running of all API calls
 * @example Using the HttpRequestHandler class
 * ```typescript
 *   const handler = new HttpRequestHandler();
 *   const response = await handler.call("GET", "auth/challenge")
 * ```
 * @param {Record<string, HttpRequestHandler>}    cookie    authentication cookie
 * @since v0.2.0
 */
export class HttpRequestHandler {
  /**
   * Constructs a BackendService instance.
   *
   * @access public
   */
  constructor(protected cookie: string | undefined) {}
  /**
   * Generic method for api calls
   *
   * @param  {string} method
   * @param  {string} url
   * @param  {any} options
   *
   */
  public call(method: string, url: string, options: any) {
    try {
      if (method === "GET") {
        return axios.get(url, {
          ...options,
          headers: {
            authorization: `Bearer ${this.cookie}`,
          },
        });
      }
      // POST
      if (method === "POST") {
        return axios({
          method: method.toLowerCase(),
          url,
          data: {
            ...options,
            headers: {
              authorization: `Bearer ${this.cookie}`,
            },
          },
        });
      }
    } catch (err) {
      console.log("Request failed: ", err);
      throw err;
    }
  }
}
