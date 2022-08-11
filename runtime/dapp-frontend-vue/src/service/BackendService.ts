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
import Cookies from "js-cookie";

// internal dependencies
import { HttpRequestHandler } from "@/handlers/HttpRequestHandler";

/**
 * @interface RequestHandler
 * @description This interface defines obligatory methods to be added
 * to implementing classes that can be used as request handlers in the
 * below {@link BackendService}.
 * <br /><br />
 * A request handler is typically used to *delegate* the execution of
 * *remote* requests (to the backend, the network-api, etc.).
 *
 * @since v0.3.0
 */
export interface RequestHandler {
  call(method: string, url: string, options: any): Record<string, any>;
}

/**
 * @class BackendService
 * @description This class handles the execution of HTTP requests using
 * a running backend runtime.
 * <br /><br />
 * @example Using the BackendService class
 * ```typescript
 *   const app = BackendService.getInstance();
 *   console.log(app.getUrl("auth/challenge"));
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param   {Record<string>}                      baseUrl       Base URL that will be used for all api calls
 * @param   {Record<string, HttpRequestHandler>}  handler       Generated instance of the HttpRequestHandler
 *
 * @since v0.3.0
 */
export class BackendService {
  /**
   * The singleton instance of the backend service.
   *
   * @static
   * @access private
   * @var {BackendService}
   */
  private static instance: BackendService;

  /**
   * This property is used to define the base URL which
   * is queried with each HTTP request executed using this
   * backend service.
   *
   * @example: `"{baseUrl}/{your_endpoint}"`
   *
   * @access protected
   * @var {string}
   */
  protected baseUrl = "http://localhost:7903";

  /**
   * This property is used to handle HTTP requests.
   *
   * @access protected
   * @var {HttpRequestHandler}
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
    // @todo replace secure: false for the development purposes, should be true
    Cookies.set("accessToken", token, {
      secure: false,
      sameSite: "strict",
      domain: "localhost",
    });
  }
}
