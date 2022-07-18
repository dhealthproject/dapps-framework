/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// External dependencies
import Cookies from "js-cookie";

import { HttpRequestHandler } from "@/handlers/HttpRequestHandler";

export interface RequestHandler {
  call(method: string, url: string, options: any): Record<string, any>;
}

/**
 * @class BackendService
 * @description This class handles running HTTP requests(with using of HttpRequestHandler),
 * getting/setting authentication token with cookies
 * @example Using the BackendService class
 * ```typescript
 *   const app = BackendService.getInstance();
 *   console.log(app.getUrl("auth/challenge"));
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param   {Record<string, BackendService>}    instance      Generated instance of the BackendService
 * @param   {Record<string>}                    baseUrl       Base URL that will be used for all api calls
 * @param   {Record<string, HttpRequestHandler>}  handler       Generated instance of the HttpRequestHandler
 *
 * @since v0.2.0
 */
export class BackendService {
  private static instance: BackendService;
  /**
   * This property is used
   * for defining of base URL
   * which is going to be used in
   * each HTTP request
   * example: {baseUrl}/{your_endpoint}
   *
   * @access protected
   * @var {baseUrl}
   */
  protected baseUrl = "http://localhost:7903";

  /**
   * This property is used
   * for initializing HTTP request handler(used for running api calls)
   *
   * @access protected
   * @var {handler}
   */
  protected handler: HttpRequestHandler = new HttpRequestHandler(
    this.getAuthCookie()
  );

  /**
   * Constructs a BackendService instance.
   *
   * @access public
   */
  constructor() {
    return;
  }

  /**
   * This method is used for providing outside instance of BackendService.
   *
   * @access public static
   */
  public static getInstance() {
    if (!BackendService.instance) {
      this.instance = new BackendService();
    }
    return this.instance;
  }
  /**
   * Generate URL for .call() method
   *
   * @param  {string} endpoint
   * @returns string
   */
  public getUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.replace("^/", "")}`;
  }

  /**
   * Get authentication cookie
   *
   * @returns string | undefined
   */
  getAuthCookie() {
    return Cookies.get("accessToken");
  }

  /**
   * Set authentication cookie
   *
   * @returns void
   */
  setAuthCookie(token: string) {
    // replace secure: false for the development purposes, should be true
    Cookies.set("accessToken", token, {
      secure: false,
      sameSite: "strict",
      domain: "localhost",
    });
  }
}
