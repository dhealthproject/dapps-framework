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
import { RequestHandler } from "@/kernel/remote/RequestHandler";

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
export abstract class BackendService {
  /**
   * This property is used to define the base URL which
   * is queried with each HTTP request executed using this
   * backend service.
   *
   * @example: `"http://localhost:7903"`
   *
   * @access protected
   * @var {string}
   */
  protected baseUrl: string = `${process.env.VUE_APP_BACKEND_URL}`;

  /**
   * This property is used to handle requests using a
   * crafted and specialized request handler as necessary
   * for each child classes.
   *
   * @access protected
   * @returns {HttpRequestHandler}
   */
  protected abstract get handler(): RequestHandler;

  /**
   * Generate URL for .call() method
   *
   * @param  {string} endpoint
   * @returns string
   */
  protected getUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.replace("^/", "")}`;
  }
}
