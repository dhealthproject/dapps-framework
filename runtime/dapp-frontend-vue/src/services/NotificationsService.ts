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
import { BackendService } from "./BackendService";
import { HttpRequestHandler } from "../kernel/remote/HttpRequestHandler";

/**
 * @class NotificationsService
 * @description This class handles backend requests for the `/notifications`
 * namespace and endpoints related to *notifications*.
 *
 * @since v0.5.0
 */
export class NotificationsService extends BackendService {
  /**
   * This property sets the request handler used for the implemented
   * requests. This handler forwards the execution of the request to
   * `axios`.
   *
   * @access protected
   * @returns {HttpRequestHandler}
   */
  protected get handler(): HttpRequestHandler {
    return new HttpRequestHandler();
  }

  /**
   * This method fetches the social platform configuration objects
   * from the backend runtime using the `/social/platforms` API.
   *
   * @access public
   * @async
   * @returns   {Promise<SocialPlatformDTO[]>}   An array of social platform configuration objects.
   */
  public async getNotificationsByAddress(address: string): Promise<any> {
    // fetch from backend runtime
    const response = await this.handler.call(
      this.getUrl(`notifications/${address}`),
      "GET",
      undefined, // no-body
      { withCredentials: true, credentials: "include" } // no-headers
    );

    // return the list of identifiers
    return response.data;
  }

  /**
   * This method fetches updated notifications list
   * once notification has been read.
   *
   * @access public
   * @async
   * @returns   {Promise<SocialPlatformDTO[]>}   An array of social platform configuration objects.
   */
  public async patchNotificationAsRead(body: any): Promise<any> {
    // fetch from backend runtime
    const response = await this.handler.call(
      this.getUrl(`notifications/read`),
      "PUT",
      body,
      { withCredentials: true, credentials: "include" } // no-headers
    );

    // return the list of identifiers
    return response.data;
  }
}
